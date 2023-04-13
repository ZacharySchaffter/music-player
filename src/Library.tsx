import React, { useState, useMemo, useRef, useEffect, ReactNode } from "react";
import { usePlayerContext } from "./context";
import DataTable, { createTheme } from "react-data-table-component";
import { Song } from "./types";
import { secondsToMinutes } from "./utils";
createTheme(
  "Custom",
  {
    text: {
      primary: "rgba(255, 255, 255, 0.87);",
      secondary: "rgba(255, 255, 255, 0.87);",
    },
    background: {
      default: "#242424",
    },
    context: {
      background: "#242424",
      text: "rgba(255, 255, 255, 0.87);",
    },
    divider: {
      default: "rgba(255, 255, 255, 0.87);",
      hover: "rgba(255, 255, 255, 0.87);",
    },
    button: {
      default: "#2aa198",
      hover: "rgba(0,0,0,.08)",
      focus: "rgba(255,255,255,.12)",
      disabled: "rgba(255, 255, 255, .34)",
    },
    sortFocus: {
      default: "#2aa198",
    },
    highlightOnHover: {
      default: "#151515",
    },
  },
  "dark"
);

export const Library: React.FC<{}> = () => {
  const { player, playlists, setActiveSong, addSongToPlaylist } =
    usePlayerContext();
  const { activePlaylist, isLoading } = player;

  const [filter, setFilter] = useState("");
  const songs: Song[] = activePlaylist?.songs || [];
  const filteredSongs = useMemo(() => {
    if (!filter) return songs;

    const regex = new RegExp(filter, "i");

    return !filter
      ? songs
      : songs.filter(
          (s) =>
            regex.test(s.title) || regex.test(s.album) || regex.test(s.artist)
        );
  }, [filter, activePlaylist?.songs]);

  const editablePlaylists = useMemo(
    () => playlists.filter((pl) => pl.id !== 0),
    [playlists]
  );

  const columns = [
    {
      name: "Art",
      maxWidth: "5%",
      cell: () => (
        <div
          css={{ aspectRatio: "1", width: "1.5rem", backgroundColor: "white" }}
        />
      ),
    },
    {
      name: "Song",
      maxWidth: "30%",
      selector: (row: Song) => row.title,
      sortable: true,
    },
    {
      name: "Album",
      maxWidth: "20%",
      selector: (row: Song) => row.album,
      sortable: true,
    },
    {
      name: "Artist",
      maxWidth: "20%",
      selector: (row: Song) => row.artist,
      sortable: true,
    },
    {
      name: "Length",
      maxWidth: "5%",
      selector: (row: Song) => secondsToMinutes(row.songLength),
      sortable: true,
    },
    {
      name: "Actions",
      maxWidth: "15%",
      cell: (song: Song) => {
        // TODO: Performance concerns around time complexity of the filter.map combo
        return (
          <select
            onChange={(e) => {
              // Add this song to playlist, and reset this select
              addSongToPlaylist(song.id, parseInt(e.target.value));
              e.target.value = "";
            }}
            defaultValue=""
            css={{ width: "100%" }}
          >
            <option disabled={true} value="">
              Add to...
            </option>

            {editablePlaylists
              .filter((pl) => !pl.songs.find((s) => s.id === song.id))
              .map((pl) => (
                <option value={pl.id}>{pl.title}</option>
              ))}
          </select>
        );
      },
    },
  ];

  const data =
    filteredSongs.map((song) => ({
      ...song,
      customKey:
        `${activePlaylist?.title}-${song.title}-${song.album}`.replaceAll(
          " ",
          "_"
        ),
    })) || [];

  // If loading, render loader
  if (isLoading) {
    return (
      <div
        css={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      css={{
        width: "100%",
        height: "100%",
        overflowY: "scroll",
        position: "relative",
      }}
    >
      <div css={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }}>
        <div
          css={{
            display: "flex",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem",
          }}
        >
          <label
            htmlFor="filter"
            css={{ paddingRight: "0.5rem", fontSize: ".75rem" }}
          >
            Filter
          </label>
          <input
            name="filter"
            type="search"
            value={filter}
            placeholder="Search by song title, artist, or album"
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            css={{ flex: 1 }}
          />
        </div>
        <div>
          <DataTable
            columns={columns}
            data={data}
            highlightOnHover={true}
            pointerOnHover={true}
            onRowClicked={(song) => {
              setActiveSong(song.id);
            }}
            theme="Custom"
            noDataComponent={
              <div css={{ padding: "2rem" }}>
                {activePlaylist?.songs.length === 0
                  ? "Add some songs!"
                  : "No songs match current filter"}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};
