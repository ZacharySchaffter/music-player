import { useCallback, useMemo, useState } from "react";
import { PlayerContextProvider } from "./context";
import type { Playlist, Song } from "./types";
import { Sidebar } from "./Sidebar";
import { Library } from "./Library";
import { NowPlaying } from "./NowPlaying";
import { useFetchSongs } from "./hooks";

function App() {
  // Fetch songs
  const { data, loading, error } = useFetchSongs();

  // Library state
  const songs = useMemo(() => (data || []) as Song[], [data]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  // Player state
  // TODO: Refactor as reducer to better compartmentalize these values
  const [activePlaylistId, setActivePlaylistId] = useState<Playlist["id"]>(0);
  const [activeSongId, setActiveSongId] = useState<Song["id"] | null>();
  const [isShuffled, setIsShuffled] = useState(false);
  const [volume, setVolume] = useState<number>(50);
  const [isPlaying, setIsPlaying] = useState(false);

  // Memoized player state
  const playerState = useMemo(() => {
    return {
      isLoading: loading,
      activePlaylist: playlists.find((p) => p.id === activePlaylistId) || {
        id: 0,
        title: "All Songs",
        songs: songs as Song[],
      },
      activeSong: songs.find((s) => s.id === activeSongId),
      isShuffled,
      isPlaying,
      volume,
    };
  }, [loading, activePlaylistId, activeSongId, isShuffled, volume, isPlaying]);

  // Callback player actions
  const togglePlay = useCallback(() => {
    setIsPlaying((state) => !state);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffled((state) => !state);
  }, []);

  const createPlaylist = useCallback(() => {
    // Since we can't delete playlists yet, incrementing from end of the arr is safe
    const nextId = playlists.length
      ? playlists[playlists.length - 1].id + 1
      : 1;
    const newPlaylist = {
      id: nextId,
      title: `New playlist #${nextId + 1}`,
      songs: [] as Song[],
    };
    setPlaylists([...playlists, newPlaylist]);
  }, [playlists, setPlaylists]);

  const addSongToPlaylist = useCallback(
    (songId: Song["id"], playlistId: Playlist["id"]) => {
      const song = songs.find((s) => s.id === songId);
      if (!song) return;
      const updatedPlaylists: Playlist[] = playlists.map((pl) =>
        pl.id === playlistId ? { ...pl, songs: [...pl.songs, song] } : pl
      );
      setPlaylists(updatedPlaylists);
    },
    [playlists]
  );

  // Memoize full context object to prevent needless re-renders
  const ctx = useMemo(
    () => ({
      songs,
      playlists,
      player: playerState,
      togglePlay,
      toggleShuffle,
      createPlaylist,
      setActivePlaylist: setActivePlaylistId,
      setActiveSong: setActiveSongId,
      setVolume,
      addSongToPlaylist,
    }),
    [
      songs,
      playlists,
      playerState,
      togglePlay,
      toggleShuffle,
      setActivePlaylistId,
      setActiveSongId,
    ]
  );

  return (
    <PlayerContextProvider value={ctx}>
      {/* Top */}
      <div
        css={{
          width: "100vw",
          height: "100vh",
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          gridTemplateRows: "1fr 120px",
          gridTemplateAreas: `
            "sidebar library"
            "player player"
          `,
        }}
      >
        {/* Sidebar */}
        <div
          css={{
            minWidth: "200px",
            backgroundColor: "#242424",
            gridArea: "sidebar",
            padding: "0.5rem",
          }}
        >
          <Sidebar />
        </div>

        {/* Main Content */}
        <div
          css={{
            gridArea: "library",
            padding: "0.5rem",
          }}
        >
          <Library />
        </div>
        {/* Bottom */}
        <div
          css={{
            gridArea: "player",
            padding: "0.5rem",
            borderTop: "1px solid white",
          }}
        >
          <NowPlaying />
        </div>
      </div>
    </PlayerContextProvider>
  );
}

export default App;
