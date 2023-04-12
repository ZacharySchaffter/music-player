import { useState, useEffect, useMemo } from "react";
import type { Song } from "../types";

type HookResult = {
  data: Song[] | null;
  error: string | object | null;
  loading: boolean;
};

const API_URL =
  "https://storage.googleapis.com/atticus-frontend-assessment/api/songs.json";

type SongWithoutId = Omit<Song, "id">;

export const useFetchSongs = () => {
  const [data, setData] = useState<HookResult["data"]>();
  const [error, setError] = useState<HookResult["error"]>();
  const [loading, setLoading] = useState(false);

  // Lifecycle - trigger request and update state
  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        // If data is misshapen, bail and let catch handle it.
        if (!data?.songs || !Array.isArray(data.songs)) {
          throw new Error("API returned an invalid shape.");
        }

        // Note: Our app's `Song` boasts an extra 'id' property that the API
        // doesn't return, so we'll set it here == the index
        const enhancedData: Song[] = (data.songs as SongWithoutId[]).map(
          (itm, i) => ({
            ...itm,
            id: i,
            // Normalizing this property to camelcase, but leaving snaked one on
            // the obj due to time
            // @ts-expect-error
            songLength: itm.song_length,
          })
        );
        setData(enhancedData);
      })
      .catch((err) => {
        console.warn("Error while fetching song data:");
        console.warn(err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const result = useMemo(
    () => ({
      data,
      error,
      loading,
    }),
    [data, error, loading]
  );

  return result;
};
