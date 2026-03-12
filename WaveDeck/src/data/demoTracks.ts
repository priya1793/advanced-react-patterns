import { type Track, type FolderNode } from "../types/music";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const ARTISTS = [
  "Neon Drift",
  "Crystal Cascade",
  "Void Echo",
  "Solar Flare",
  "Lunar Tide",
  "Arctic Pulse",
  "Ember Wave",
  "Ghost Signal",
  "Prism Break",
  "Deep Current",
  "Static Bloom",
  "Phase Shift",
  "Velvet Haze",
  "Iron Cloud",
  "Silk Aether",
  "Nova Dust",
  "Coral Syntax",
  "Obsidian",
  "Cyan Theorem",
  "Amber Circuit",
];

const ALBUMS = [
  "Midnight Protocol",
  "Synthetic Dreams",
  "Digital Horizon",
  "Echoes of Light",
  "Fractured Silence",
  "Chromatic",
  "Parallel Lines",
  "Deep State",
  "Zenith",
  "Wavefront",
  "Dissolve",
  "Orbit",
  "Resonance",
  "Spectrum",
  "Monolith",
  "Drift",
  "Pulse",
  "Refraction",
  "Catalyst",
  "Entropy",
];

const TITLE_WORDS = [
  "Midnight",
  "Crystal",
  "Neon",
  "Shadow",
  "Electric",
  "Golden",
  "Silver",
  "Floating",
  "Endless",
  "Hidden",
  "Lost",
  "Broken",
  "Frozen",
  "Burning",
  "Silent",
  "Distant",
  "Ancient",
  "Digital",
  "Phantom",
  "Hollow",
  "Dreams",
  "Waves",
  "Light",
  "Rain",
  "Stars",
  "Clouds",
  "Echoes",
  "Roads",
  "Rivers",
  "Mountains",
  "Cities",
  "Gardens",
  "Oceans",
  "Deserts",
  "Signals",
  "Codes",
  "Patterns",
  "Cycles",
  "Fragments",
  "Layers",
];

const KEYS = [
  "Am",
  "Bm",
  "Cm",
  "Dm",
  "Em",
  "Fm",
  "Gm",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "Abm",
  "Bbm",
  "Ebm",
  "F#m",
  "C#m",
  "G#m",
];

const FOLDERS = [
  "Electronic",
  "Ambient",
  "Techno",
  "House",
  "Downtempo",
  "Experimental",
  "IDM",
  "Chill",
];

const COLORS = [
  "#c0392b",
  "#d35400",
  "#f39c12",
  "#27ae60",
  "#16a085",
  "#2980b9",
  "#8e44ad",
  "#c0392b",
  "#00838f",
  "#e64a19",
  "#546e7a",
  "#5d4037",
  "#6a1b9a",
  "#1565c0",
  "#00695c",
  "#ef6c00",
  "#ad1457",
  "#283593",
];

function generateWaveform(rand: () => number, length = 80): number[] {
  const waveform: number[] = [];
  let val = 0.3 + rand() * 0.3;
  for (let i = 0; i < length; i++) {
    val += (rand() - 0.48) * 0.18;
    val = Math.max(0.08, Math.min(0.98, val));
    waveform.push(val);
  }
  return waveform;
}

export function generateDemoTracks(count = 1000): Track[] {
  const rand = seededRandom(42);
  const tracks: Track[] = [];

  for (let i = 0; i < count; i++) {
    const w1 = TITLE_WORDS[Math.floor(rand() * TITLE_WORDS.length)];
    const w2 = TITLE_WORDS[Math.floor(rand() * TITLE_WORDS.length)];

    tracks.push({
      id: `track-${i}`,
      title: w1 === w2 ? w1 : `${w1} ${w2}`,
      artist: ARTISTS[Math.floor(rand() * ARTISTS.length)],
      album: ALBUMS[Math.floor(rand() * ALBUMS.length)],
      duration: 120 + Math.floor(rand() * 360),
      bpm: 72 + Math.floor(rand() * 108),
      musicalKey: KEYS[Math.floor(rand() * KEYS.length)],
      color: COLORS[Math.floor(rand() * COLORS.length)],
      folder: FOLDERS[Math.floor(rand() * FOLDERS.length)],
      waveform: generateWaveform(rand),
    });
  }

  return tracks;
}

export function getFolders(tracks: Track[]): FolderNode[] {
  const map = new Map<string, number>();
  tracks.forEach((t) => map.set(t.folder, (map.get(t.folder) || 0) + 1));
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, path: name, trackCount: count }));
}
