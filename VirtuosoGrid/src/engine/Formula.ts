/**
 * Lightweight formula engine for VirtSheet.
 * Supports: =SUM(A1:A10), =AVG(B1:B5), =A1+B2*3, =MIN(), =MAX(), =COUNT(), cell refs
 */

export type CellData = {
  raw: string; // what the user typed
  computed: string; // display value after formula eval
  isFormula: boolean;
};

export type CellStore = Map<string, CellData>;

// Convert col index (0-based) to letter: 0->A, 25->Z, 26->AA
export function colToLetter(col: number): string {
  let s = "";
  let c = col;
  while (c >= 0) {
    s = String.fromCharCode(65 + (c % 26)) + s;
    c = Math.floor(c / 26) - 1;
  }
  return s;
}

// Convert letter to col index
export function letterToCol(letters: string): number {
  let col = 0;
  for (let i = 0; i < letters.length; i++) {
    col = col * 26 + (letters.charCodeAt(i) - 64);
  }
  return col - 1;
}

// Parse cell reference like "A1" => { col: 0, row: 0 }
function parseCellRef(ref: string): { col: number; row: number } | null {
  const match = ref.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  return { col: letterToCol(match[1]), row: parseInt(match[2], 10) - 1 };
}

// Expand range "A1:B3" into individual cell keys
function expandRange(range: string): string[] {
  const [startRef, endRef] = range.split(":");
  const start = parseCellRef(startRef);
  const end = parseCellRef(endRef);
  if (!start || !end) return [];
  const keys: string[] = [];
  for (
    let r = Math.min(start.row, end.row);
    r <= Math.max(start.row, end.row);
    r++
  ) {
    for (
      let c = Math.min(start.col, end.col);
      c <= Math.max(start.col, end.col);
      c++
    ) {
      keys.push(`${colToLetter(c)}${r + 1}`);
    }
  }
  return keys;
}

function getNumericValues(keys: string[], store: CellStore): number[] {
  return keys
    .map((k) => {
      const cell = store.get(k);
      if (!cell) return NaN;
      const v = parseFloat(cell.computed);
      return v;
    })
    .filter((v) => !isNaN(v));
}

// Evaluate a formula string (without the leading '=')
function evalExpression(
  expr: string,
  store: CellStore,
  visited: Set<string>,
): number {
  // Handle function calls: SUM(...), AVG(...), MIN(...), MAX(...), COUNT(...)
  const fnMatch = expr.match(/^(SUM|AVG|AVERAGE|MIN|MAX|COUNT)\((.+)\)$/i);
  if (fnMatch) {
    const fn = fnMatch[1].toUpperCase();
    const arg = fnMatch[2].trim();
    // Could be a range or comma-separated
    let keys: string[] = [];
    if (arg.includes(":")) {
      keys = expandRange(arg);
    } else {
      keys = arg.split(",").map((s) => s.trim());
    }
    // Recursively evaluate referenced cells
    for (const k of keys) {
      if (!store.has(k)) continue;
      if (!visited.has(k)) {
        evaluateCell(k, store, visited);
      }
    }
    const vals = getNumericValues(keys, store);
    switch (fn) {
      case "SUM":
        return vals.reduce((a, b) => a + b, 0);
      case "AVG":
      case "AVERAGE":
        return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      case "MIN":
        return vals.length ? Math.min(...vals) : 0;
      case "MAX":
        return vals.length ? Math.max(...vals) : 0;
      case "COUNT":
        return vals.length;
      default:
        return 0;
    }
  }

  // Replace cell references with their numeric values
  let replaced = expr.replace(/([A-Z]+\d+)/g, (ref) => {
    const parsed = parseCellRef(ref);
    if (!parsed) return "0";
    const key = ref;
    if (!visited.has(key) && store.has(key)) {
      evaluateCell(key, store, visited);
    }
    const cell = store.get(key);
    if (!cell) return "0";
    const v = parseFloat(cell.computed);
    return isNaN(v) ? "0" : String(v);
  });

  // Safe eval using Function constructor (only arithmetic)
  try {
    // Only allow numbers, operators, parens, dots, spaces
    if (/^[\d\s+\-*/().]+$/.test(replaced)) {
      const result = new Function(`return (${replaced})`)();
      return typeof result === "number" && isFinite(result) ? result : 0;
    }
    return 0;
  } catch {
    return 0;
  }
}

export function evaluateCell(
  key: string,
  store: CellStore,
  visited: Set<string> = new Set(),
): void {
  if (visited.has(key)) return; // circular ref guard
  visited.add(key);

  const cell = store.get(key);
  if (!cell) return;

  if (!cell.isFormula) {
    cell.computed = cell.raw;
    return;
  }

  const expr = cell.raw.slice(1).trim(); // remove '='
  try {
    const result = evalExpression(expr, store, visited);
    cell.computed = String(Math.round(result * 1e10) / 1e10);
  } catch {
    cell.computed = "#ERR";
  }
}

export function evaluateAllFormulas(store: CellStore): void {
  const visited = new Set<string>();
  for (const key of store.keys()) {
    const cell = store.get(key)!;
    if (cell.isFormula) {
      evaluateCell(key, store, visited);
    }
  }
}

export function createCellData(raw: string): CellData {
  const isFormula = raw.startsWith("=");
  return { raw, computed: isFormula ? "" : raw, isFormula };
}
