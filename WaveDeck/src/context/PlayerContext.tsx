import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { type Track, type RepeatMode, type ViewMode } from "../types/music";

/* ---- Context Types ---- */
interface PlayerContextType {
  tracks: Track[];
  filteredTracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  queue: Track[];
  repeatMode: RepeatMode;
  shuffle: boolean;
  crossfadeMs: number;
  currentFolder: string | null;
  viewMode: ViewMode;
  searchQuery: string;
  play: (track?: Track) => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (v: number) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  reorderTracks: (fromId: string, toId: string) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleShuffle: () => void;
  setCrossfade: (ms: number) => void;
  setCurrentFolder: (folder: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (q: string) => void;
}

interface ProgressContextType {
  progress: number;
  seek: (p: number) => void;
}

const PlayerCtx = createContext<PlayerContextType | null>(null);
const ProgressCtx = createContext<ProgressContextType>({
  progress: 0,
  seek: () => {},
});

export function usePlayer() {
  const ctx = useContext(PlayerCtx);
  if (!ctx) throw new Error("usePlayer must be inside PlayerProvider");
  return ctx;
}

export function useProgress() {
  return useContext(ProgressCtx);
}

/* ---- Provider ---- */
export function PlayerProvider({
  children,
  initialTracks,
}: {
  children: ReactNode;
  initialTracks: Track[];
}) {
  const [tracks, setTracks] = useState(initialTracks);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [queue, setQueue] = useState<Track[]>([]);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");
  const [shuffle, setShuffle] = useState(false);
  const [crossfadeMs, setCrossfadeMs] = useState(0);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTracks = useMemo(() => {
    let result = tracks;
    if (currentFolder)
      result = result.filter((t) => t.folder === currentFolder);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.album.toLowerCase().includes(q),
      );
    }
    return result;
  }, [tracks, currentFolder, searchQuery]);

  // Refs for stable access in callbacks
  const stateRef = useRef({
    queue,
    filteredTracks,
    currentTrack,
    shuffle,
    repeatMode,
  });
  stateRef.current = {
    queue,
    filteredTracks,
    currentTrack,
    shuffle,
    repeatMode,
  };
  const progressRef = useRef(0);
  progressRef.current = progress;

  const advance = useCallback(() => {
    const {
      queue: q,
      filteredTracks: ft,
      currentTrack: ct,
      shuffle: sh,
      repeatMode: rm,
    } = stateRef.current;

    if (q.length > 0) {
      const [next, ...rest] = q;
      setQueue(rest);
      setCurrentTrack(next);
      setProgress(0);
      setIsPlaying(true);
      return;
    }

    if (!ct || ft.length === 0) {
      setIsPlaying(false);
      return;
    }
    if (rm === "one") {
      setProgress(0);
      return;
    }

    const idx = ft.findIndex((t) => t.id === ct.id);
    let nextIdx: number;

    if (sh) {
      nextIdx = Math.floor(Math.random() * ft.length);
    } else {
      nextIdx = idx + 1;
      if (nextIdx >= ft.length) {
        if (rm === "all") nextIdx = 0;
        else {
          setIsPlaying(false);
          return;
        }
      }
    }

    setCurrentTrack(ft[nextIdx]);
    setProgress(0);
    setIsPlaying(true);
  }, []);

  // Simulated playback timer
  useEffect(() => {
    if (!isPlaying || !currentTrack) return;
    const id = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.1 / currentTrack.duration;
        if (next >= 1) {
          setTimeout(advance, 0);
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, [isPlaying, currentTrack, advance]);

  const play = useCallback((track?: Track) => {
    if (track) {
      setCurrentTrack(track);
      setProgress(0);
    }
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => setIsPlaying(false), []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      if (!stateRef.current.currentTrack) {
        const ft = stateRef.current.filteredTracks;
        if (ft.length > 0) {
          setCurrentTrack(ft[0]);
          setProgress(0);
          return true;
        }
        return false;
      }
      return !prev;
    });
  }, []);

  const next = useCallback(() => advance(), [advance]);

  const prev = useCallback(() => {
    if (progressRef.current > 0.1) {
      setProgress(0);
      return;
    }
    const { filteredTracks: ft, currentTrack: ct } = stateRef.current;
    if (!ct) return;
    const idx = ft.findIndex((t) => t.id === ct.id);
    if (idx > 0) {
      setCurrentTrack(ft[idx - 1]);
      setProgress(0);
    } else {
      setProgress(0);
    }
  }, []);

  const seek = useCallback(
    (p: number) => setProgress(Math.max(0, Math.min(1, p))),
    [],
  );
  const setVolume = useCallback(
    (v: number) => setVolumeState(Math.max(0, Math.min(1, v))),
    [],
  );
  const addToQueue = useCallback(
    (track: Track) => setQueue((q) => [...q, track]),
    [],
  );
  const removeFromQueue = useCallback(
    (i: number) => setQueue((q) => q.filter((_, idx) => idx !== i)),
    [],
  );
  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);

  const reorderTracks = useCallback((fromId: string, toId: string) => {
    setTracks((prev) => {
      const next = [...prev];
      const fromIdx = next.findIndex((t) => t.id === fromId);
      const toIdx = next.findIndex((t) => t.id === toId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  }, []);

  const playerValue = useMemo(
    (): PlayerContextType => ({
      tracks,
      filteredTracks,
      currentTrack,
      isPlaying,
      volume,
      queue,
      repeatMode,
      shuffle,
      crossfadeMs,
      currentFolder,
      viewMode,
      searchQuery,
      play,
      pause,
      togglePlay,
      next,
      prev,
      setVolume,
      addToQueue,
      removeFromQueue,
      reorderTracks,
      setRepeatMode,
      toggleShuffle,
      setCrossfade: setCrossfadeMs,
      setCurrentFolder,
      setViewMode,
      setSearchQuery,
    }),
    [
      tracks,
      filteredTracks,
      currentTrack,
      isPlaying,
      volume,
      queue,
      repeatMode,
      shuffle,
      crossfadeMs,
      currentFolder,
      viewMode,
      searchQuery,
      play,
      pause,
      togglePlay,
      next,
      prev,
      setVolume,
      addToQueue,
      removeFromQueue,
      reorderTracks,
      toggleShuffle,
    ],
  );

  const progressValue = useMemo(() => ({ progress, seek }), [progress, seek]);

  return (
    <PlayerCtx.Provider value={playerValue}>
      <ProgressCtx.Provider value={progressValue}>
        {children}
      </ProgressCtx.Provider>
    </PlayerCtx.Provider>
  );
}
