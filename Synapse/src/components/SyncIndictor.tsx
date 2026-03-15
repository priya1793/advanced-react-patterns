import React from "react";
import { useEditorStore } from "../store/editorStore";
import { CloudIcon } from "./icons";

export function SyncIndicator() {
  const isSyncing = useEditorStore((s) => s.isSyncing);

  return (
    <div
      className="sync-indicator"
      title={isSyncing ? "Saving..." : "All changes saved"}
    >
      <CloudIcon />
      <span
        className={`sync-indicator__dot ${isSyncing ? "sync-indicator__dot--syncing" : ""}`}
      />
    </div>
  );
}
