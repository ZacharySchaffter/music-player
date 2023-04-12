# Music Player

A simple music player shell built with React, Typescript, and Vite.

## Choices

- I chose vite because it's incredibly quick and light to spin up a dev server.
- I chose Emotion mainly for speed - CSS-in-JS styling is faster for quick prototypes like this, in my experience.
- I focused first on the general app state, establishing a React Context provider to handle most of the logic at the `App.tsx` component level, which then gets leveraged by child components via the `usePlayerContext` hook.
- The only component library I used, in the interest of time, was [react-data-table](https://github.com/jbetancur/react-data-table-component) (mostly to avoid needing to write the sort functions and the state values necessary for them)

## Remaining to-do items

I wasn't able to clear all the items in the requirements list. The major ones still missing are:

- General cleanup of the now playing component (icon buttons, scrub bar, better spacing, range slider styles)
- Controls to add songs to playlists
- Album art for each row of the data table
- A general 'Play' state to advance through the songs as time elapses, with shuffle selecting a random song from the `activePlaylist` to go next.

## To Run Project

```
  nvm use
  npm i
  npm run dev # starts the vite webserver
```
