import React from "react";
import { usePlayerContext } from "./context";

export const NowPlaying: React.FC<{}> = () => {
  const { player, togglePlay, toggleShuffle, setVolume } = usePlayerContext();
  const { activeSong, isLoading, volume } = player;

  // Don't render player if still loading
  if (isLoading || !activeSong) return null;

  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      {/* Song info */}
      <div css={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Album art */}
        <div
          css={{
            height: "80px",
            aspectRatio: "1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid white",
            fontSize: "8px",
            padding: "0.25rem",
            textAlign: "center",
          }}
        >
          {activeSong?.album} art goes here
        </div>
        {/* Title, artist */}
        <div>
          <h3>{activeSong?.title}</h3>
          <h4>{activeSong?.artist}</h4>
        </div>
      </div>

      {/* Main Controls */}
      <div>
        {/* Controls (shuffle, back, play, next)} */}
        <div
          css={{
            flex: "0",
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "0.5rem",
          }}
        >
          <button
            type="button"
            onClick={() => {
              toggleShuffle();
            }}
          >
            Shuffle
          </button>
          <button type="button">Back</button>
          <button
            type="button"
            onClick={() => {
              togglePlay();
            }}
          >
            Play
          </button>
          <button type="button">Next</button>
        </div>

        {/* Scrubber */}
        <div css={{ display: "flex", fontSize: "8px", gap: ".25rem" }}>
          <div>0:00</div>
          <div
            css={{ height: "10px", width: "200px", backgroundColor: "white" }}
          ></div>
          <div>
            {Math.floor(activeSong.songLength / 60)}:
            {activeSong.songLength % 60}
          </div>
        </div>
      </div>

      {/* Volume Slider */}
      <div>
        <div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            className="slider"
            id="volume"
            onChange={(e) => {
              setVolume(parseInt(e.target.value));
            }}
          />
        </div>
      </div>
    </div>
  );
};
