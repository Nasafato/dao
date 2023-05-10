import React, { useState, useEffect, useRef } from "react";

function AudioPlayer({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (!isPlaying) {
      if (currentTime === duration) {
        setCurrentTime(0);
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  useEffect(() => {
    if (!audioRef.current) return;
    const ref = audioRef.current;
    // Listen for onloaded
    ref.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      ref.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  });

  useEffect(() => {
    if (!audioRef.current) return;
    const ref = audioRef.current;
    ref.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      ref.removeEventListener("timeupdate", handleTimeUpdate);
    };
  });
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    console.log("time", audioRef.current.currentTime);
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className="py-2 flex items-center gap-x-4">
      <audio
        src={src}
        ref={audioRef}
        onEnded={handleEnded}
        crossOrigin="anonymous"
      />
      <button
        className="bg-gray-800 text-white rounded-full flex h-6 w-6 items-center justify-center focus:outline-none"
        onClick={togglePlayPause}
      >
        {!isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 5.25v13.5m-7.5-13.5v13.5"
            />
          </svg>
        )}
      </button>
      <div className="bg-gray-300 rounded-full p-1 w-40">
        <div
          className="bg-gray-800 rounded-full h-1 transition-all duration-300"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        ></div>
      </div>
      <div className="flex gap-x-2 items-center">
        <div className="text-xs font-medium text-gray-800">
          {currentTime.toFixed(0)}/{duration.toFixed(0)}{" "}
          <span className="-ml-1">seconds</span>
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
