import React, { useCallback } from "react";
import { useEditorStore } from "../store/editorStore";
import type { DocumentVersion } from "../types/editor";

function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function VersionItem({ version }: { version: DocumentVersion }) {
  const activeVersionId = useEditorStore((s) => s.activeVersionId);
  const setActiveVersion = useEditorStore((s) => s.setActiveVersion);
  const setContent = useEditorStore((s) => s.setContent);
  const isActive = activeVersionId === version.id;

  const handleClick = useCallback(() => {
    if (isActive) {
      setActiveVersion(null);
    } else {
      setActiveVersion(version.id);
      setContent(version.content);
    }
  }, [isActive, version, setActiveVersion, setContent]);

  return (
    <div
      className={`version-item ${isActive ? "version-item--active" : ""}`}
      onClick={handleClick}
    >
      <div className="version-item__time">
        {formatTimestamp(version.timestamp)}
      </div>
      <div className="version-item__author">{version.authorName}</div>
      <div className="version-item__summary">{version.summary}</div>
    </div>
  );
}

export function VersionHistory() {
  const versions = useEditorStore((s) => s.versions);
  const activeVersionId = useEditorStore((s) => s.activeVersionId);
  const setActiveVersion = useEditorStore((s) => s.setActiveVersion);
  const content = useEditorStore((s) => s.content);
  const currentUserName = useEditorStore((s) => s.currentUserName);
  const addVersion = useEditorStore((s) => s.addVersion);

  const handleSnapshot = useCallback(() => {
    const version: DocumentVersion = {
      id: crypto.randomUUID(),
      content: JSON.parse(JSON.stringify(content)),
      timestamp: Date.now(),
      authorName: currentUserName,
      summary: `${content.length} blocks edited`,
    };
    addVersion(version);
  }, [content, currentUserName, addVersion]);

  return (
    <div className="synapse-sidebar__body">
      <div style={{ padding: "8px 12px" }}>
        <button
          className="comment-input__submit"
          style={{ width: "100%", padding: "8px" }}
          onClick={handleSnapshot}
        >
          Save snapshot
        </button>
      </div>

      {activeVersionId && (
        <div style={{ padding: "4px 12px" }}>
          <button
            className="toolbar-btn"
            style={{ fontSize: 12, color: "var(--brand)" }}
            onClick={() => setActiveVersion(null)}
          >
            ← Back to current version
          </button>
        </div>
      )}

      {versions.length === 0 ? (
        <div className="empty-state">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>No versions yet</span>
          <span style={{ fontSize: 12 }}>
            Click "Save snapshot" to create one
          </span>
        </div>
      ) : (
        versions.map((v) => <VersionItem key={v.id} version={v} />)
      )}
    </div>
  );
}
