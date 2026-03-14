import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
  memo,
} from "react";
import {
  colToLetter,
  createCellData,
  evaluateCell,
  type CellStore,
  type CellData,
} from "../../engine/formula";
import { FormulaBar } from "./FormulaBar";
import { StatusBar } from "./StatusBar";
import { TourGuide } from "./TourGuide";
import "./Spreadsheet.css";

const TOTAL_ROWS = 1_000_000;
const TOTAL_COLS = 100;
const DEFAULT_ROW_HEIGHT = 28;
const HEADER_HEIGHT = 32;
const ROW_NUM_WIDTH = 60;
const MIN_COL_WIDTH = 40;
const OVERSCAN_ROWS = 8;
const OVERSCAN_COLS = 4;

interface SelectedCell {
  row: number;
  col: number;
}

// Memoized cell component
const Cell = memo(function Cell({
  row,
  col,
  width,
  height,
  value,
  isSelected,
  isEditing,
  onSelect,
  onDoubleClick,
  onEditComplete,
}: {
  row: number;
  col: number;
  width: number;
  height: number;
  value: string;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: (row: number, col: number) => void;
  onDoubleClick: (row: number, col: number) => void;
  onEditComplete: (row: number, col: number, value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        e.stopPropagation();
        onEditComplete(row, col, (e.target as HTMLInputElement).value);
      } else if (e.key === "Escape") {
        e.stopPropagation();
        onEditComplete(row, col, value);
      }
    },
    [row, col, value, onEditComplete],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      onEditComplete(row, col, e.target.value);
    },
    [row, col, onEditComplete],
  );

  const className = `cell${isSelected ? " cell--selected" : ""}${isEditing ? " cell--editing" : ""}`;

  return (
    <div
      className={className}
      style={{ width, height, minWidth: width }}
      onClick={() => onSelect(row, col)}
      onDoubleClick={() => onDoubleClick(row, col)}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className="cell__input"
          defaultValue={value}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      ) : (
        <span className="cell__text">{value}</span>
      )}
    </div>
  );
});

export default function Spreadsheet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [viewportHeight, setViewportHeight] = useState(600);
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
  const [editingCell, setEditingCell] = useState<SelectedCell | null>(null);
  const [colWidths, setColWidths] = useState<number[]>(() =>
    Array.from({ length: TOTAL_COLS }, () => 100),
  );
  const cellStore = useRef<CellStore>(new Map());
  const [cellVersion, setCellVersion] = useState(0);
  const [showTour, setShowTour] = useState(() => {
    return !localStorage.getItem("virtsheet-tour-seen");
  });
  const [resizingCol, setResizingCol] = useState<number | null>(null);
  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(0);

  // Precompute column prefix sums for virtualization
  const colPrefixSums = useMemo(() => {
    const sums = new Array(TOTAL_COLS + 1);
    sums[0] = 0;
    for (let i = 0; i < TOTAL_COLS; i++) {
      sums[i + 1] = sums[i] + colWidths[i];
    }
    return sums;
  }, [colWidths]);

  const totalContentWidth = colPrefixSums[TOTAL_COLS];
  const totalContentHeight = TOTAL_ROWS * DEFAULT_ROW_HEIGHT;

  // Viewport measurement
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setViewportWidth(rect.width);
      setViewportHeight(rect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Visible row range (binary search not needed for fixed height)
  const visibleRows = useMemo(() => {
    const startRow = Math.floor(scrollTop / DEFAULT_ROW_HEIGHT);
    const endRow = Math.ceil((scrollTop + viewportHeight) / DEFAULT_ROW_HEIGHT);
    return {
      start: Math.max(0, startRow - OVERSCAN_ROWS),
      end: Math.min(TOTAL_ROWS - 1, endRow + OVERSCAN_ROWS),
    };
  }, [scrollTop, viewportHeight]);

  // Visible col range (binary search for variable widths)
  const visibleCols = useMemo(() => {
    let startCol = 0;
    for (let i = 0; i < TOTAL_COLS; i++) {
      if (colPrefixSums[i + 1] > scrollLeft) {
        startCol = i;
        break;
      }
    }
    let endCol = startCol;
    for (let i = startCol; i < TOTAL_COLS; i++) {
      endCol = i;
      if (colPrefixSums[i] > scrollLeft + viewportWidth) break;
    }
    return {
      start: Math.max(0, startCol - OVERSCAN_COLS),
      end: Math.min(TOTAL_COLS - 1, endCol + OVERSCAN_COLS),
    };
  }, [scrollLeft, viewportWidth, colPrefixSums]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setScrollTop(target.scrollTop);
    setScrollLeft(target.scrollLeft);
  }, []);

  const getCellKey = useCallback((row: number, col: number) => {
    return `${colToLetter(col)}${row + 1}`;
  }, []);

  const getCellDisplay = useCallback(
    (row: number, col: number): string => {
      const key = getCellKey(row, col);
      const cell = cellStore.current.get(key);
      return cell ? cell.computed : "";
    },
    [getCellKey, cellVersion],
  );

  const getCellRaw = useCallback(
    (row: number, col: number): string => {
      const key = getCellKey(row, col);
      const cell = cellStore.current.get(key);
      return cell ? cell.raw : "";
    },
    [getCellKey, cellVersion],
  );

  const handleSelect = useCallback(
    (row: number, col: number) => {
      if (editingCell && (editingCell.row !== row || editingCell.col !== col)) {
        setEditingCell(null);
      }
      setSelectedCell({ row, col });
    },
    [editingCell],
  );

  const handleDoubleClick = useCallback((row: number, col: number) => {
    setEditingCell({ row, col });
    setSelectedCell({ row, col });
  }, []);

  const handleEditComplete = useCallback(
    (row: number, col: number, value: string) => {
      const key = getCellKey(row, col);
      if (value.trim() === "") {
        cellStore.current.delete(key);
      } else {
        const cellData = createCellData(value);
        cellStore.current.set(key, cellData);
        evaluateCell(key, cellStore.current);
      }
      // Re-evaluate formulas that might depend on this cell
      for (const [k, cell] of cellStore.current) {
        if (cell.isFormula) {
          evaluateCell(k, cellStore.current, new Set());
        }
      }
      setEditingCell(null);
      setCellVersion((v) => v + 1);
    },
    [getCellKey],
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selectedCell || editingCell) return;
      const { row, col } = selectedCell;
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setSelectedCell({ row: Math.max(0, row - 1), col });
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedCell({ row: Math.min(TOTAL_ROWS - 1, row + 1), col });
          break;
        case "ArrowLeft":
          e.preventDefault();
          setSelectedCell({ row, col: Math.max(0, col - 1) });
          break;
        case "ArrowRight":
          e.preventDefault();
          setSelectedCell({ row, col: Math.min(TOTAL_COLS - 1, col + 1) });
          break;
        case "Enter":
          e.preventDefault();
          setEditingCell({ row, col });
          break;
        case "Delete":
        case "Backspace":
          e.preventDefault();
          handleEditComplete(row, col, "");
          break;
        default:
          // Start typing to edit
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            setEditingCell({ row, col });
          }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedCell, editingCell, handleEditComplete]);

  // Column resize handlers
  const handleResizeStart = useCallback(
    (col: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setResizingCol(col);
      resizeStartX.current = e.clientX;
      resizeStartWidth.current = colWidths[col];
    },
    [colWidths],
  );

  useEffect(() => {
    if (resizingCol === null) return;
    const handleMove = (e: MouseEvent) => {
      const diff = e.clientX - resizeStartX.current;
      const newWidth = Math.max(MIN_COL_WIDTH, resizeStartWidth.current + diff);
      setColWidths((prev) => {
        const next = [...prev];
        next[resizingCol] = newWidth;
        return next;
      });
    };
    const handleUp = () => setResizingCol(null);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [resizingCol]);

  // Formula bar value
  const formulaBarValue = selectedCell
    ? getCellRaw(selectedCell.row, selectedCell.col)
    : "";
  const formulaBarRef = selectedCell
    ? `${colToLetter(selectedCell.col)}${selectedCell.row + 1}`
    : "";

  const handleFormulaBarChange = useCallback(
    (value: string) => {
      if (!selectedCell) return;
      handleEditComplete(selectedCell.row, selectedCell.col, value);
    },
    [selectedCell, handleEditComplete],
  );

  // Build visible rows
  const rows: React.ReactNode[] = [];
  for (let r = visibleRows.start; r <= visibleRows.end; r++) {
    const cells: React.ReactNode[] = [];
    const y = r * DEFAULT_ROW_HEIGHT;

    // Row number (sticky)
    cells.push(
      <div
        key="rownum"
        className={`row-number${selectedCell?.row === r ? " row-number--active" : ""}`}
        style={{
          height: DEFAULT_ROW_HEIGHT,
          lineHeight: `${DEFAULT_ROW_HEIGHT}px`,
        }}
      >
        {r + 1}
      </div>,
    );

    // Spacer for columns before visible range
    if (visibleCols.start > 0) {
      cells.push(
        <div
          key="spacer"
          style={{
            width: colPrefixSums[visibleCols.start],
            minWidth: colPrefixSums[visibleCols.start],
            flexShrink: 0,
          }}
        />,
      );
    }

    for (let c = visibleCols.start; c <= visibleCols.end; c++) {
      const isSelected = selectedCell?.row === r && selectedCell?.col === c;
      const isEditing = editingCell?.row === r && editingCell?.col === c;
      cells.push(
        <Cell
          key={c}
          row={r}
          col={c}
          width={colWidths[c]}
          height={DEFAULT_ROW_HEIGHT}
          value={isEditing ? getCellRaw(r, c) : getCellDisplay(r, c)}
          isSelected={isSelected}
          isEditing={isEditing}
          onSelect={handleSelect}
          onDoubleClick={handleDoubleClick}
          onEditComplete={handleEditComplete}
        />,
      );
    }

    rows.push(
      <div
        key={r}
        className="virtual-row"
        style={{
          position: "absolute",
          top: y,
          left: 0,
          height: DEFAULT_ROW_HEIGHT,
          display: "flex",
          paddingLeft: 0,
        }}
      >
        {cells}
      </div>,
    );
  }

  // Build header
  const headerCells: React.ReactNode[] = [];
  headerCells.push(
    <div
      key="corner"
      className="header-corner"
      style={{ width: ROW_NUM_WIDTH, minWidth: ROW_NUM_WIDTH }}
    />,
  );
  // Spacer for columns before visible range
  if (visibleCols.start > 0) {
    headerCells.push(
      <div
        key="header-spacer"
        style={{
          width: colPrefixSums[visibleCols.start],
          minWidth: colPrefixSums[visibleCols.start],
          flexShrink: 0,
        }}
      />,
    );
  }
  for (let c = visibleCols.start; c <= visibleCols.end; c++) {
    headerCells.push(
      <div
        key={c}
        className={`header-cell${selectedCell?.col === c ? " header-cell--active" : ""}`}
        style={{ width: colWidths[c], minWidth: colWidths[c] }}
      >
        <span>{colToLetter(c)}</span>
        <div
          className="resize-handle"
          onMouseDown={(e) => handleResizeStart(c, e)}
        />
      </div>,
    );
  }

  const handleCloseTour = useCallback(() => {
    setShowTour(false);
    localStorage.setItem("virtsheet-tour-seen", "1");
  }, []);

  return (
    <div className="spreadsheet-app">
      {showTour && <TourGuide onClose={handleCloseTour} />}
      <FormulaBar
        cellRef={formulaBarRef}
        value={formulaBarValue}
        onChange={handleFormulaBarChange}
      />
      <div className="spreadsheet-container">
        {/* Header */}
        <div
          className="header-row"
          style={{
            paddingLeft: 0,
            transform: `translateX(-${scrollLeft}px)`,
          }}
        >
          {headerCells}
        </div>

        {/* Tour button */}
        <button
          className="tour-trigger"
          onClick={() => setShowTour(true)}
          title="Show feature tour"
        >
          ?
        </button>

        {/* Virtualized grid */}
        <div
          ref={containerRef}
          className="grid-viewport"
          onScroll={handleScroll}
        >
          <div
            className="grid-content"
            style={{
              width: totalContentWidth + ROW_NUM_WIDTH,
              height: totalContentHeight,
              position: "relative",
            }}
          >
            {/* Row numbers column — rendered inline with rows for correct vertical virtualization */}
            <div
              style={{
                position: "sticky",
                left: 0,
                zIndex: 2,
                width: 0,
              }}
            />
            {rows}
          </div>
        </div>
      </div>
      <StatusBar
        totalRows={TOTAL_ROWS}
        totalCols={TOTAL_COLS}
        selectedCell={
          selectedCell
            ? `${colToLetter(selectedCell.col)}${selectedCell.row + 1}`
            : null
        }
        cellCount={cellStore.current.size}
      />
    </div>
  );
}
