import React from "react";
import { usePlayerContext } from "./context";

const SidebarButton: React.FC<{
  isActive: boolean;
  label: string;
  onClick: () => void;
}> = ({ isActive, label, onClick }) => {
  return (
    <button
      type="button"
      css={{
        backgroundColor: "unset",
        border: "unset",
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        ...(isActive ? { fontWeight: "bold" } : {}),
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export const Sidebar: React.FC<{}> = () => {
  const { playlists, player, setActivePlaylist, createPlaylist } =
    usePlayerContext();
  const { activePlaylist } = player;

  const menuItems = [
    {
      id: 0,
      title: "All Songs",
    },
    ...playlists,
  ];

  return (
    <div
      css={{
        display: "flex",
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Playlists */}
      <ul>
        {menuItems.map((itm) => (
          <li css={{ borderBottom: "1px solid white" }}>
            <SidebarButton
              label={itm.title}
              isActive={(activePlaylist?.id || null) === itm.id}
              onClick={() => {
                setActivePlaylist(itm.id);
              }}
            />
          </li>
        ))}
      </ul>

      {/* Create Playlist button */}
      <div>
        <button type="button" onClick={() => createPlaylist()}>
          Create Playlist
        </button>
      </div>
    </div>
  );
};
