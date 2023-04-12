// MediaWindow.js
import React, { useContext, createContext, useState } from "react";
// import MediaControls from "./MediaControls";
// import { AudioPlayer } from "./HeadlessAudioPlayer";

// MediaWindowContext.tsx

type MediaWindowContextType = {
  mediaType: string | null;
  setMediaType: (mediaType: string | null) => void;
  mediaSource: string | null;
  setMediaSource: (mediaSource: string | null) => void;
};

const MediaWindowContext = createContext<MediaWindowContextType>({
  mediaType: null,
  setMediaType: () => {},
  mediaSource: null,
  setMediaSource: () => {},
});

export const useMediaWindowContext = () => useContext(MediaWindowContext);

export function MediaWindowProvider({
  defaultMediaSource,
  defaultMediaType,
  children,
}: {
  children: React.ReactNode;
  defaultMediaSource?: string | null;
  defaultMediaType?: string | null;
}) {
  const [mediaType, setMediaType] = useState<string | null>(
    defaultMediaType ?? null
  );
  const [mediaSource, setMediaSource] = useState<string | null>(
    defaultMediaSource ?? null
  );

  return (
    <MediaWindowContext.Provider
      value={{ mediaType, setMediaType, mediaSource, setMediaSource }}
    >
      {children}
    </MediaWindowContext.Provider>
  );
}

export function MediaWindow() {
  const { mediaType, mediaSource } = useMediaWindowContext();
  //   const [isPlaying, setIsPlaying] = useState<boolean>(false);
  //   const [currentTime, setCurrentTime] = useState(0);
  //   const [duration, setDuration] = useState(0);
  //   const [volume, setVolume] = useState(1);

  //   const handlePlayPause = () => {
  //     setIsPlaying(!isPlaying);
  //   };

  //   const handleTimeUpdate = (time: number) => {
  //     setCurrentTime(time);
  //   };

  //   const handleDurationChange = (duration: number) => {
  //     setDuration(duration);
  //   };

  //   const handleVolumeChange = (volume: number) => {
  //     setVolume(volume);
  //   };

  //   const handleSeek = (time: number) => {
  //     setCurrentTime(time);
  //   };

  return (
    <div className="fixed bottom-0 px-3 py-2 border-t border-gray-200 w-full bg-white shadow-md left-0 flex justify-center items-center">
      {mediaType === "audio" && mediaSource && (
        <audio src={mediaSource} preload="metadata" controls></audio>
      )}
    </div>
  );
}
