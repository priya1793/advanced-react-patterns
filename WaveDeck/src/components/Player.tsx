import { useCallback } from "react";
import { usePlayer, useProgress } from "../context/PlayerContext";
import { WaveformCanvas } from "./WaveformCanvas";
import { CrossfadeVisualizer } from "./CrossfadeVisualizer";
import { type RepeatMode } from "../types/music";

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function Player() {
  const {
    currentTrack,
    isPlaying,
    volume,
    togglePlay,
    next,
    prev,
    setVolume,
    shuffle,
    toggleShuffle,
    repeatMode,
    setRepeatMode,
    crossfadeMs,
    setCrossfade,
  } = usePlayer();
  const { progress, seek } = useProgress();

  const cycleRepeat = useCallback(() => {
    const modes: RepeatMode[] = ["off", "all", "one"];
    const idx = modes.indexOf(repeatMode);
    setRepeatMode(modes[(idx + 1) % 3]);
  }, [repeatMode, setRepeatMode]);

  const cycleCrossfade = useCallback(() => {
    const values = [0, 3000, 5000, 8000, 12000];
    const idx = values.indexOf(crossfadeMs);
    setCrossfade(values[(idx + 1) % values.length]);
  }, [crossfadeMs, setCrossfade]);

  const handleVolumeClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setVolume((e.clientX - rect.left) / rect.width);
    },
    [setVolume],
  );

  return (
    <div className="player-bar">
      {/* Track Info */}
      <div className="player-track-info">
        {currentTrack ? (
          <>
            <div
              className="player-art"
              style={{ background: currentTrack.color }}
            >
              {currentTrack.album[0]}
            </div>
            <div className="player-text">
              <div className="player-title">{currentTrack.title}</div>
              <div className="player-artist-name">{currentTrack.artist}</div>
            </div>
          </>
        ) : (
          <div className="player-text">
            <div
              className="player-title"
              style={{ color: "var(--text-muted)" }}
            >
              No track selected
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="player-controls">
        <div className="player-buttons">
          <button
            className={`player-btn${shuffle ? " active" : ""}`}
            onClick={toggleShuffle}
            title="Shuffle"
          >
            ⇄
          </button>
          <button className="player-btn" onClick={prev} title="Previous">
            ⏮
          </button>
          <button className="player-btn play-btn" onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button className="player-btn" onClick={next} title="Next">
            ⏭
          </button>
          <button
            className={`player-btn${repeatMode !== "off" ? " active" : ""}`}
            onClick={cycleRepeat}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === "one" ? "🔂" : "🔁"}
          </button>
        </div>
        <div className="player-progress">
          <span className="player-time">
            {currentTrack
              ? formatTime(progress * currentTrack.duration)
              : "0:00"}
          </span>
          {currentTrack ? (
            <WaveformCanvas
              waveform={currentTrack.waveform}
              progress={progress}
              height={32}
              className="player-waveform"
              onClick={seek}
            />
          ) : (
            <div className="progress-bar-container">
              <div className="progress-fill" style={{ width: "0%" }} />
            </div>
          )}
          <span className="player-time right">
            {currentTrack ? formatTime(currentTrack.duration) : "0:00"}
          </span>
        </div>
      </div>

      {/* Extras */}
      <div className="player-extras">
        {currentTrack && crossfadeMs > 0 && (
          <CrossfadeVisualizer
            crossfadeMs={crossfadeMs}
            progress={progress}
            duration={currentTrack.duration}
          />
        )}
        <button
          className={`crossfade-badge${crossfadeMs > 0 ? " active" : ""}`}
          onClick={cycleCrossfade}
          title="Crossfade"
        >
          XF {crossfadeMs > 0 ? `${crossfadeMs / 1000}s` : "OFF"}
        </button>
        <div className="volume-control">
          <button
            className="volume-icon"
            onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
          >
            {volume > 0.5 ? "🔊" : volume > 0 ? "🔉" : "🔇"}
          </button>
          <div className="volume-slider" onClick={handleVolumeClick}>
            <div
              className="volume-fill"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
