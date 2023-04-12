export type Song = {
  id: number;
  title: string;
  album: string;
  artist: string;
  songLength: number;
};

export type Playlist = {
  id: number;
  title: string;
  songs: Song[];
};

export type Player = {
  isLoading: boolean;
  activePlaylist: Playlist | undefined;
  activeSong: Song | undefined;
  isShuffled: boolean;
  isPlaying: boolean;
  volume: number;
};
