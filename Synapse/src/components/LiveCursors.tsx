import React from "react";
import { useEditorStore } from "../store/editorStore";

/**
 * Renders decorative cursor indicators for remote participants.
 * In a full implementation these would be positioned based on
 * Slate's DOM node positions. Here we show them as a visual
 * indicator in the sidebar presence bar.
 *
 * The actual cursor rendering in a production app would use
 * Slate's decorate API to highlight remote selections.
 */
export function LiveCursors() {
  const participants = useEditorStore((s) => s.participants);
  const users = Array.from(participants.values()).filter((u) => u.cursor);

  if (users.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {users.map((user) => {
        if (!user.cursor) return null;
        // Approximate position based on path for demo
        const topOffset = (user.cursor.anchor.path[0] || 0) * 28 + 72;
        const leftOffset = Math.min(user.cursor.anchor.offset * 8, 600) + 96;

        return (
          <div
            key={user.id}
            className="live-cursor"
            style={{
              transform: `translate(${leftOffset}px, ${topOffset}px)`,
              transition: "transform 150ms cubic-bezier(0.25, 0.1, 0.25, 1)",
            }}
          >
            <div
              className="live-cursor__caret"
              style={{ background: user.color }}
            />
            <div
              className="live-cursor__flag"
              style={{ background: user.color }}
            >
              {user.name.split(" ")[0]}
            </div>
          </div>
        );
      })}
    </div>
  );
}
