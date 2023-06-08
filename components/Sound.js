import { useRef, useState } from "react";

export default function MyComponent({ audioref, aud }) {
  const [isPlaying, setIsPlaying] = useState(false);

  function playAudio() {
    audioref.current.play();
    setIsPlaying(true);
  }
  function pauseAudio() {
    audioref.current.pause();
    setIsPlaying(false);
  }

  function ended() {
    setIsPlaying(false);
  }

  const audio = useRef(null);

  return (
    <>
      <audio ref={audioref} onEnded={ended}></audio>
      {aud ? (
        isPlaying ? (
          <button className="play" onClick={pauseAudio}>
            PAUSE
          </button>
        ) : (
          <button className="play" onClick={playAudio}>
            PLAY
          </button>
        )
      ) : (
        <div>No preview</div>
      )}
    </>
  );
}
