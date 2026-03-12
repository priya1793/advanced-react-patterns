import { useMemo } from "react";
import { usePlayer } from "../context/PlayerContext";
import { getFolders } from "../data/demoTracks";

export function Sidebar() {
  const { currentFolder, setCurrentFolder, queue, removeFromQueue, tracks } =
    usePlayer();
  const folders = useMemo(() => getFolders(tracks), [tracks]);

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <span>◉</span> WaveDeck
      </div>

      <div className="sidebar-header">Folders</div>
      <div className="folder-tree">
        <button
          className={`folder-item${currentFolder === null ? " active" : ""}`}
          onClick={() => setCurrentFolder(null)}
        >
          📁 All Tracks
          <span className="count">{tracks.length}</span>
        </button>
        {folders.map((f) => (
          <button
            key={f.path}
            className={`folder-item${currentFolder === f.path ? " active" : ""}`}
            onClick={() => setCurrentFolder(f.path)}
          >
            📂 {f.name}
            <span className="count">{f.trackCount}</span>
          </button>
        ))}
      </div>

      <div className="queue-section">
        <div className="sidebar-header">Queue · {queue.length}</div>
        {queue.length === 0 && (
          <div className="queue-empty">Right-click a track to queue it</div>
        )}
        {queue.map((t, i) => (
          <div key={`${t.id}-${i}`} className="queue-item">
            <span
              style={{
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {t.title}
            </span>
            <button className="queue-remove" onClick={() => removeFromQueue(i)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
