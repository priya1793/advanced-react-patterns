/**
 * ============================================================
 * GENERIC TYPESCRIPT COMPONENT
 * ============================================================
 *
 * PATTERN: Generic TypeScript Components
 * ----------------------------------------
 * This component is generic over the item type <T>.
 * TypeScript infers T from the `items` prop, so the
 * `renderItem` callback is fully typed without manual annotation.
 *
 * Usage:
 *   <GenericList
 *     items={[{ id: 1, name: "Alice" }]}
 *     renderItem={(item) => <span>{item.name}</span>}
 *     keyExtractor={(item) => item.id}
 *   />
 *
 * T is inferred as { id: number; name: string } automatically.
 */

import React from "react";

interface GenericListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  emptyMessage?: string;
  style?: React.CSSProperties;
}

export function GenericList<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = "No items",
  style,
}: GenericListProps<T>) {
  if (items.length === 0) {
    return (
      <div
        style={{ padding: "12px", opacity: 0.5, fontStyle: "italic", ...style }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={style}>
      {items.map((item, index) => (
        <React.Fragment key={keyExtractor(item, index)}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
}
