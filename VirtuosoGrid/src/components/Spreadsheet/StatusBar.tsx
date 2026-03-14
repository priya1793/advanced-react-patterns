import React from "react";

interface StatusBarProps {
  totalRows: number;
  totalCols: number;
  selectedCell: string | null;
  cellCount: number;
}

export const StatusBar = React.memo(function StatusBar({
  totalRows,
  totalCols,
  selectedCell,
  cellCount,
}: StatusBarProps) {
  return (
    <div className="status-bar">
      <span className="status-bar__item">
        {totalRows.toLocaleString()} rows × {totalCols} cols
      </span>
      <span className="status-bar__item">
        {cellCount.toLocaleString()} cells with data
      </span>
      {selectedCell && (
        <span className="status-bar__item status-bar__item--active">
          Selected: {selectedCell}
        </span>
      )}
      <span className="status-bar__item status-bar__item--right">
        VirtSheet — Virtual Scrolling Demo
      </span>
    </div>
  );
});
