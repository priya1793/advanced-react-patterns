export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  bpm: number;
  musicalKey: string;
  color: string;
  folder: string;
  waveform: number[];
}

export interface FolderNode {
  name: string;
  path: string;
  trackCount: number;
}

export type ViewMode = "list" | "grid";
export type RepeatMode = "off" | "all" | "one";
