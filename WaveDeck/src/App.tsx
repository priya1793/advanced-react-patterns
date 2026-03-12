import { useMemo } from "react";
import { PlayerProvider, usePlayer } from "./context/PlayerContext";
import { generateDemoTracks } from "./data/demoTracks";
import { Sidebar } from "./components/Sidebar";
import { Playlist } from "./components/Playlist";
import { AlbumGrid } from "./components/AlbumGrid";
import { Player } from "./components/Player";
import { Toolbar } from "./components/Toolbar";

function AppContent() {
  const { viewMode } = usePlayer();

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Toolbar />
        {viewMode === "list" ? <Playlist /> : <AlbumGrid />}
      </div>
      <Player />
    </div>
  );
}

export default function App() {
  const demoTracks = useMemo(() => generateDemoTracks(1000), []);

  return (
    <PlayerProvider initialTracks={demoTracks}>
      <AppContent />
    </PlayerProvider>
  );
}
