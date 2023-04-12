import React, { useState, useMemo, useRef, useEffect } from "react";
import { usePlayerContext } from "./context";
import DataTable, { createTheme } from "react-data-table-component";
import { Song } from "./types";

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
      cursor: "pointer",
      text: "rgba(255, 255, 255, 0.87);",
    },
    divider: {
      default: "rgba(255, 255, 255, 0.87);",
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
  },
  "dark"
);

export const Library: React.FC<{}> = () => {
  const { player, setActivePlaylist, setActiveSong } = usePlayerContext();
  const { activePlaylist, isLoading } = player;
  const table = useRef<HTMLDivElement | null>(null);

  const [filter, setFilter] = useState("");
  const songs: Song[] = activePlaylist?.songs || [];
  const filteredSongs = useMemo(() => {
    return !filter
      ? songs
      : songs.filter(
          (s) =>
            s.title.includes(filter) ||
            s.album.includes(filter) ||
            s.artist.includes(filter)
        );
  }, [filter, activePlaylist?.songs]);

  const columns = [
    {
      name: "Song",
      selector: (row: Song) => row.title,
      sortable: true,
    },
    {
      name: "Album",
      selector: (row: Song) => row.album,
      sortable: true,
    },
    {
      name: "Artist",
      selector: (row: Song) => row.artist,
      sortable: true,
    },
    {
      name: "Length",
      selector: (row: Song) =>
        `${Math.floor(row.songLength / 60)}:${row.songLength % 60}`,
      sortable: true,
    },
  ];

  const data = filteredSongs || [];

  // Bind delegated click event handler to datatable
  useEffect(() => {
    if (!table.current) return;

    // Hacky, but time constraints necessitate grabbing the click somehow
    const handleClick = (e: Event) => {
      const id = (e.target as HTMLElement).getAttribute("id");
      console.log(id);
      if (!id) return;
      const songId = parseInt(id.replace("row-", ""));
    };

    table.current.addEventListener("click", handleClick);

    return () => {
      table?.current?.removeEventListener("click", handleClick);
    };
  }, [table]);

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
        <div ref={table}>
          <DataTable
            columns={columns}
            data={data}
            onRowClicked={(song) => {
              setActiveSong(song.id);
            }}
            theme="Custom"
          />
        </div>
      </div>
    </div>
  );
};
