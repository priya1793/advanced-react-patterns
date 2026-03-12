import { useMemo } from "react";
import { usePlayer } from "../context/PlayerContext";
import { type Track } from "../types/music";

interface AlbumGroup {
  album: string;
  artist: string;
  color: string;
  tracks: Track[];
  totalDuration: number;
}

export function AlbumGrid() {
  const { filteredTracks, play } = usePlayer();

  const albums = useMemo((): AlbumGroup[] => {
    const map = new Map<string, AlbumGroup>();
    filteredTracks.forEach((t) => {
      const existing = map.get(t.album);
      if (existing) {
        existing.tracks.push(t);
        existing.totalDuration += t.duration;
      } else {
        map.set(t.album, {
          album: t.album,
          artist: t.artist,
          color: t.color,
          tracks: [t],
          totalDuration: t.duration,
        });
      }
    });
    return Array.from(map.values());
  }, [filteredTracks]);

  if (albums.length === 0) {
    return (
      <div className="empty-state">
        <span style={{ fontSize: 32 }}>💿</span>
        <span>No albums found</span>
      </div>
    );
  }

  return (
    <div className="album-grid">
      {albums.map((a) => (
        <div
          key={a.album}
          className="album-card"
          onClick={() => play(a.tracks[0])}
        >
          <div
            className="album-art"
            style={{
              background: `linear-gradient(135deg, ${a.color}, ${a.color}88)`,
            }}
          >
            {a.album[0]}
            <div className="album-art-overlay">▶</div>
          </div>
          <div className="album-info">
            <div className="album-name" title={a.album}>
              {a.album}
            </div>
            <div className="album-artist">{a.artist}</div>
            <div className="album-meta">
              {a.tracks.length} tracks · {Math.round(a.totalDuration / 60)}m
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
