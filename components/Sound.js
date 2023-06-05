import { use, useState } from "react";

export default function MyComponent({ audioref }) {
  const [isPlaying, setIsPlaying] = useState(false);

  function playAudio() {
    audioref.current.play();
    setIsPlaying(true);
  }
  function pauseAudio() {
    audioref.current.pause();
    setIsPlaying(false);
  }

  return (
    <>
      <audio ref={audioref} onEnded={() => setIsPlaying(false)}></audio>
      {isPlaying ? (
        <button className="play" onClick={pauseAudio}>
          PAUSE
        </button>
      ) : (
        <button className="play" onClick={playAudio}>
          PLAY
        </button>
      )}
    </>
  );
}
