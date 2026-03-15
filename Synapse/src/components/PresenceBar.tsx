import React from "react";
import { useEditorStore } from "../store/editorStore";

const COLORS = [
  "#e91e63",
  "#00bcd4",
  "#ff9800",
  "#4caf50",
  "#9c27b0",
  "#ff5722",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function PresenceBar() {
  const participants = useEditorStore((s) => s.participants);
  const currentUserName = useEditorStore((s) => s.currentUserName);

  const users = Array.from(participants.values());

  return (
    <div className="presence-bar">
      {/* Current user */}
      <div
        className="presence-avatar"
        style={{ background: COLORS[0] }}
        title={`${currentUserName} (you)`}
      >
        {getInitials(currentUserName)}
        <span className="presence-avatar__pulse" />
      </div>

      {/* Remote participants */}
      {users.map((user, i) => (
        <div
          key={user.id}
          className="presence-avatar"
          style={{ background: user.color || COLORS[(i + 1) % COLORS.length] }}
          title={`${user.name}${user.isTyping ? " — typing..." : ""}`}
        >
          {getInitials(user.name)}
          <span
            className={`presence-avatar__pulse ${
              user.isTyping ? "" : "presence-avatar__pulse--idle"
            }`}
          />
        </div>
      ))}
    </div>
  );
}
