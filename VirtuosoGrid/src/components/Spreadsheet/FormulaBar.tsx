import React, { useState, useCallback, useEffect } from "react";

interface FormulaBarProps {
  cellRef: string;
  value: string;
  onChange: (value: string) => void;
}

export function FormulaBar({ cellRef, value, onChange }: FormulaBarProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onChange(localValue);
      }
    },
    [localValue, onChange],
  );

  const handleBlur = useCallback(() => {
    onChange(localValue);
  }, [localValue, onChange]);

  return (
    <div className="formula-bar">
      <div className="formula-bar__ref">{cellRef || "—"}</div>
      <div className="formula-bar__sep" />
      <div className="formula-bar__icon">𝑓𝑥</div>
      <input
        className="formula-bar__input"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder="Enter value or formula (e.g. =SUM(A1:A10))"
      />
    </div>
  );
}
