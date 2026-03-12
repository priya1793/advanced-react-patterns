import { useCallback } from "react";
import { usePlayer } from "../context/PlayerContext";

export function Toolbar() {
  const {
    filteredTracks,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    currentFolder,
  } = usePlayer();

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery],
  );

  return (
    <div className="toolbar">
      <span className="toolbar-title">{currentFolder || "All Tracks"}</span>
      <span className="toolbar-count">{filteredTracks.length} tracks</span>
      <div className="toolbar-spacer" />
      <input
        className="search-input"
        placeholder="Search tracks..."
        value={searchQuery}
        onChange={handleSearch}
      />
      <div className="view-toggle">
        <button
          className={`view-btn${viewMode === "list" ? " active" : ""}`}
          onClick={() => setViewMode("list")}
          title="List view"
        >
          ☰
        </button>
        <button
          className={`view-btn${viewMode === "grid" ? " active" : ""}`}
          onClick={() => setViewMode("grid")}
          title="Grid view"
        >
          ⊞
        </button>
      </div>
    </div>
  );
}
