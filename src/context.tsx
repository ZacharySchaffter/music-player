import React, { ReactNode, useContext } from "react";
import type { Song, Playlist, Player } from "./types";

type PlayerContextType = {
  songs: Song[];
  playlists: Playlist[];
  player: Player;
  togglePlay: () => void;
  toggleShuffle: () => void;
  createPlaylist: () => void;
  setActivePlaylist: (id: Playlist["id"]) => void;
  setActiveSong: (id: Song["id"]) => void;
  setVolume: (volume: number) => void;
};

const PlayerContext = React.createContext<PlayerContextType>({
  songs: [],
  playlists: [],
  player: {
    isLoading: true,
    activePlaylist: undefined,
    activeSong: undefined,
    isShuffled: false,
    isPlaying: true,
    volume: 50,
  },
  togglePlay: () => {},
  toggleShuffle: () => {},
  createPlaylist: () => {},
  setActivePlaylist: (id: Playlist["id"]) => {},
  setActiveSong: (id: Song["id"]) => {},
  setVolume: (volume: number) => {},
});

type ProviderProps = {
  value: PlayerContextType;
  children: ReactNode;
};
export const PlayerContextProvider: React.FC<ProviderProps> = ({
  value,
  children,
}) => {
  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export const usePlayerContext = () => useContext(PlayerContext);
