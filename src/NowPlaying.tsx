import React, { ReactNode } from "react";
import { usePlayerContext } from "./context";
import { secondsToMinutes } from "./utils";
import {
  BiPlay,
  BiPause,
  BiShuffle,
  BiSkipPrevious,
  BiSkipNext,
} from "react-icons/bi";

const CircleButton: React.FC<
  Record<string, unknown> & {
    css: Record<string, string | number>;
    children: ReactNode;
  }
> = ({ css, children, ...props }) => {
  return (
    <button
      {...props}
      css={{
        borderRadius: "50%",
        aspectRatio: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        textAlign: "center",
        ...css,
      }}
    >
      {children}
    </button>
  );
};

const Controls: React.FC = () => {
  const { player, togglePlay, toggleShuffle } = usePlayerContext();
  const { isPlaying, isShuffled } = player;

  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr) auto repeat(2, 1fr)",
        fontSize: "1.5rem",
        justifyContent: "center",
      }}
    >
      <CircleButton
        title="Shuffle"
        type="button"
        css={{
          width: "70%",
          justifySelf: "center",
          alignSelf: "center",
          fontSize: ".75em",
          ...(isShuffled ? { color: "limegreen" } : {}),
        }}
        onClick={() => {
          toggleShuffle();
        }}
      >
        <BiShuffle />
      </CircleButton>
      <CircleButton
        type="button"
        title="Back"
        css={{ width: "70%", justifySelf: "center", alignSelf: "center" }}
      >
        <BiSkipPrevious />
      </CircleButton>
      <CircleButton
        type="button"
        css={{
          fontSize: "2em",
          justifySelf: "center",
          alignSelf: "center",
        }}
        onClick={() => {
          togglePlay();
        }}
      >
        {isPlaying ? <BiPause /> : <BiPlay />}
      </CircleButton>
      <CircleButton
        type="button"
        css={{
          justifySelf: "center",
          alignSelf: "center",
          width: "70%",
        }}
      >
        <BiSkipNext />
      </CircleButton>
    </div>
  );
};

export const NowPlaying: React.FC<{}> = () => {
  const { player, setVolume } = usePlayerContext();
  const { activeSong, isLoading, volume } = player;

  // Don't render player if still loading
  if (isLoading || !activeSong) return null;

  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: "1fr 300px 1fr",
        gap: "1rem",
        height: "100%",
      }}
    >
      {/* Song info */}
      <div
        css={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          maxWidth: "350px",
        }}
      >
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
      <div
        css={{
          display: "grid",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Controls />

        {/* Scrubber */}
        <div
          css={{
            display: "flex",
            fontSize: "12px",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div>0:00</div>
          <div
            css={{ height: "8px", width: "200px", backgroundColor: "white" }}
          ></div>
          <div>{secondsToMinutes(activeSong.songLength)}</div>
        </div>
      </div>

      {/* Volume Slider */}
      <div
        css={{
          display: "grid",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
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
