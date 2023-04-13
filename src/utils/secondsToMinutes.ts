export const secondsToMinutes = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padEnd(2, "0")}`;
