# 🎵 WaveDeck (Advanced Music Player with Waveform Playlists)

A high-performance, feature-rich music player built with React. Handles thousands of tracks with smooth virtualization, real-time waveform rendering, and advanced playback features. This project demonstrates patterns for building scalable and performant media applications.

## ✨ Features

- Virtualized Playlist — Smooth scrolling with 1,000+ tracks using custom virtual list implementation (only visible rows in DOM)

- Waveform Rendering & Caching — Canvas-based waveform visualization with progress tracking and seek functionality. Generated waveforms are cached in IndexedDB for instant subsequent loads.

- Drag & Drop — Reorder tracks with intuitive drag-and-drop

- Crossfade Visualization — Visual representation of active crossfades with adjustable durations (3s, 5s, 8s, 12s)

- Album Art Grid — Browse your library in an immersive grid view

- Queue Management — Right-click tracks to add them to a persistent queue

- Folder Navigation — Browse by folder structure (Ambient, Chill, etc.) with genre-based filtering

- Search — Real-time filtering by title, artist, or album

- Playback Controls — Play/pause, next/previous, shuffle, repeat, volume control

- Waveform Seeking — Click anywhere on the main player waveform to jump to that position

## 🎯 Quick Validation

Use these steps to verify all features:

- Virtualized Playlist — Scroll through the track list; verify only visible rows are in the DOM

- Play a Track — Double-click any track; waveform in player bar should animate with progress

- Search — Type in search box to filter tracks in real-time

- Folder Navigation — Click folders in sidebar (Ambient, Chill, etc.) to filter by genre

- Queue Management — Right-click any track → Add to Queue; verify in sidebar queue

- Drag Reorder — Drag and drop tracks to reorder playlist

- Playback Controls — Test play/pause, next/previous, shuffle (⇄), repeat (🔁)

- Crossfade — Click "XF OFF" badge to cycle values (3s, 5s, 8s, 12s); crossfade visualizer appears

- Volume — Click speaker icon to mute/unmute; drag slider to adjust

- Grid View — Click grid icon (⊞) to switch to album art view; click album to play first track

- Waveform Seek — Click anywhere on waveform to jump to that position

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/priya1793/advanced-react-patterns.git

# Install dependencies
cd wavedeck
npm install

# Start the development server
npm run dev
```

## Quick Start

- Add your music folder via the folder navigation sidebar

- Browse by genre or search for specific tracks

- Double-click any track to start playback

- Build playlists by dragging tracks or adding to queue

## 🏗️ Architecture

### Tech Stack

- Frontend: React + TypeScript
- State Management: Zustand
- Audio Engine: Web Audio API
- Virtualization: react-window
- Waveforms: waveform-data.js + Canvas
- BPM Detection: aubio.js / web-audio-beat-detector
- Key Detection: chroma.js / custom FFT analysis
- UI Components: Tailwind CSS + Framer Motion

## Performance Optimizations

- Context Splitting — Separate contexts for player state, playlist state, and UI state to minimize re-renders

- Custom Virtual List — Lightweight virtualization without external dependencies

- Memoized Components — Strategic use of React.memo for expensive components

- Stable Callbacks — useRef + useCallback patterns to prevent unnecessary re-renders

- IndexedDB Caching — Waveforms cached locally after first analysis

- Dependency-Free — No Tailwind, Radix, Zod, or unnecessary packages

## 📝 License

MIT License — see LICENSE file for details.
