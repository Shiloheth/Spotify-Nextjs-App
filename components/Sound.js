import { useRef, useState, useEffect } from "react";

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

  const audio = useRef(null);
  useEffect(() => {
    if (audio.current) {
      if (!isPlaying) {
        audio.current.style.animationPlayState = "paused";
      } else {
        audio.current.style.animationPlayState = "running";
      }
    }
  }, [isPlaying]);

  return (
    <>
      {isPlaying ? (
        <div className="progressbar">
          <div className="progressbar1" ref={audio}></div>
        </div>
      ) : null}
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
