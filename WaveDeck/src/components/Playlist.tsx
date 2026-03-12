import { useState, useCallback, memo } from "react";
import { usePlayer } from "../context/PlayerContext";
import { useVirtualList } from "../hooks/useVirtualList";
import { type Track } from "../types/music";
import { WaveformCanvas } from "./WaveformCanvas";

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

interface TrackRowProps {
  track: Track;
  index: number;
  isActive: boolean;
  style: React.CSSProperties;
  onPlay: () => void;
  onAddToQueue: () => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  isDragging: boolean;
  isDragOver: boolean;
}

const TrackRow = memo(function TrackRow({
  track,
  index,
  isActive,
  style,
  onPlay,
  onAddToQueue,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  isDragOver,
}: TrackRowProps) {
  const cls = `track-row${isActive ? " active" : ""}${isDragging ? " dragging" : ""}${isDragOver ? " drag-over" : ""}`;

  return (
    <div
      className={cls}
      style={style}
      onDoubleClick={onPlay}
      onContextMenu={(e) => {
        e.preventDefault();
        onAddToQueue();
      }}
      draggable
      onDragStart={(e) => onDragStart(e, track.id)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(e);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e, track.id);
      }}
    >
      <span className={`track-number${isActive ? " playing" : ""}`}>
        {isActive ? "▶" : index + 1}
      </span>
      <span className="track-title">{track.title}</span>
      <span className="track-artist">{track.artist}</span>
      <span className="track-album">{track.album}</span>
      <span className="track-bpm">{track.bpm}</span>
      <span className="track-key">{track.musicalKey}</span>
      <WaveformCanvas
        waveform={track.waveform}
        height={24}
        activeColor={isActive ? "#00c8ff" : "#3a3a52"}
        inactiveColor="#2a2a42"
        className="track-waveform-mini"
      />
      <span className="track-duration">{formatTime(track.duration)}</span>
    </div>
  );
});

export function Playlist() {
  const { filteredTracks, currentTrack, play, addToQueue, reorderTracks } =
    usePlayer();
  const { containerRef, visibleItems, totalHeight, onScroll } = useVirtualList({
    items: filteredTracks,
    itemHeight: 48,
  });

  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((_e: React.DragEvent) => {}, []);

  const handleDragOverItem = useCallback((id: string) => {
    setDragOverId(id);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, toId: string) => {
      e.preventDefault();
      if (dragId && dragId !== toId) {
        reorderTracks(dragId, toId);
      }
      setDragId(null);
      setDragOverId(null);
    },
    [dragId, reorderTracks],
  );

  const handleDragEnd = useCallback(() => {
    setDragId(null);
    setDragOverId(null);
  }, []);

  if (filteredTracks.length === 0) {
    return (
      <div className="empty-state">
        <span style={{ fontSize: 32 }}>🎵</span>
        <span>No tracks found</span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflow: "hidden",
      }}
    >
      <div className="playlist-header">
        <span>#</span>
        <span>Title</span>
        <span>Artist</span>
        <span>Album</span>
        <span>BPM</span>
        <span>Key</span>
        <span>Waveform</span>
        <span style={{ textAlign: "right" }}>Time</span>
      </div>
      <div
        className="virtual-list"
        ref={containerRef}
        onScroll={onScroll}
        onDragEnd={handleDragEnd}
      >
        <div className="virtual-list-inner" style={{ height: totalHeight }}>
          {visibleItems.map(({ item, index, style }) => (
            <TrackRow
              key={item.id}
              track={item}
              index={index}
              style={style}
              isActive={currentTrack?.id === item.id}
              onPlay={() => play(item)}
              onAddToQueue={() => addToQueue(item)}
              onDragStart={handleDragStart}
              onDragOver={() => handleDragOverItem(item.id)}
              onDrop={handleDrop}
              isDragging={dragId === item.id}
              isDragOver={dragOverId === item.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
