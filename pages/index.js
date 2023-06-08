import { Buffer } from "buffer";
import React, { useRef, useState, useEffect } from "react";

import dynamic from "next/dynamic";
import CurrentDate from "../components/Curretdate";
import MyComponent from "../components/Sound";
import Loader from "../components/Loader";
import { getRefreshToken, getToken } from "../components/utils";

const ComponentWithNoSSR = dynamic(() => import("../components/Time"), {
  ssr: false,
});

const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
const code = process.env.NEXT_PUBLIC_CODE;
const redirect_uri = "http://localhost:3000/";

export default function HomePage() {
  const inputRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const [song, setSong] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (inputRef.current?.paused) {
        fetchSongs();
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  async function fetchSongs() {
    const access_token = await getToken();
    const headers = {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    };
    try {
      //fetch data from the currently-playing endpoint
      const request = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        headers
      );

      //throw new Error if the request wanst successful
      if (!request.ok) {
        const text = await request.json();
        throw new Error(text.error.message);
      }
      const result = request.status === 200 ? await request.json() : null;

      //if what is a song isn't currently being played or the playing type isnt a track fetch data from the recently played endpoint
      if (
        result === null ||
        result.is_playing === false ||
        result.currently_playing_type !== "track"
      ) {
        const request = await fetch(
          "https://api.spotify.com/v1/me/player/recently-played?limit=1",
          headers
        );
        const result = await request.json();
        setIsPlaying(false);
        setLastSeen(result.items[0].played_at.slice(11, 19));
        if (inputRef.current.src !== result.items[0].track.preview_url) {
          inputRef.current.src = result.items[0].track.preview_url;
          setSong(result.items[0].track.preview_url);
        }
        document.querySelector(
          ".main"
        ).style.backgroundImage = `url(${result.items[0].track.album.images[0].url})`;
        document.querySelector(
          ".content"
        ).style.backgroundImage = `url(${result.items[0].track.album.images[0].url})`;
        document.querySelector(".artist").textContent =
          result.items[0].track.artists[0].name;
        document.querySelector(".song").textContent =
          result.items[0].track.name;
        document.querySelector(".loader")?.classList.remove("loader");
      } else {
        setIsPlaying(true);
        if (inputRef.current.src !== result.item.preview_url) {
          inputRef.current.src = result.item.preview_url;
          setSong(result.item.preview_url);
        }
        document.querySelector(
          ".main"
        ).style.backgroundImage = `url(${result.item.album.images[0].url})`;
        document.querySelector(
          ".content"
        ).style.backgroundImage = `url(${result.item.album.images[0].url})`;
        document.querySelector(".artist").textContent =
          result.item.artists[0].name;
        document.querySelector(".song").textContent = result.item.name;
        document.querySelector(".loader")?.classList.remove("loader");
      }
    } catch (error) {
      if (error.message === "The access token expired") {
        getRefreshToken();
      }
    }
  }

  return (
    <>
      <div className="main"></div>
      <Loader />
      {isPlaying ? (
        <div className="text">
          <div className="circle">LIVE</div>
        </div>
      ) : (
        <div className="lastSeen">Last Seen:{lastSeen}</div>
      )}
      <div className="container">
        <ComponentWithNoSSR />
        <CurrentDate />
        <div className="content"></div>

        <MyComponent audioref={inputRef} aud={song} />
        <div className="track">
          <div className="song"></div>
          <div className="artist"></div>
        </div>
      </div>
    </>
  );
}
