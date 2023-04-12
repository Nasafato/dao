// MediaWindow.js
import { atom, useAtom } from "jotai";
import React, {
  useContext,
  createContext,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  Ref,
  MutableRefObject,
} from "react";
import { useLogPropChanges } from "../hooks";
// import MediaControls from "./MediaControls";
// import { AudioPlayer } from "./HeadlessAudioPlayer";

// MediaWindowContext.tsx

export const isPlayingAtom = atom(false);
export const currentTimeAtom = atom(0);
export const durationAtom = atom(0);
export const volumeAtom = atom(0.5);
export const mediaTypeAtom = atom("audio");
export const mediaSourceAtom = atom<string | null>(null);

export const AudioContext = createContext<{
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  // @ts-ignore
}>({});

type MediaWindowContextType = {
  mediaType: string | null;
  setMediaType: (mediaType: string | null) => void;
  mediaSource: string | null;
  setMediaSource: (mediaSource: string | null) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentTime: number;
  setCurrentTime: (currentTime: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  handlePlayPause: () => void;
  handleTimeUpdate: (time: number) => void;
  handleDurationChange: (duration: number) => void;
  handleVolumeChange: (volume: number) => void;
  handleSeek: (time: number) => void;
  changeMediaSource: (
    mediaSource: string,
    options?: { type: string; reset: boolean }
  ) => void;
};

const MediaWindowContext = createContext<MediaWindowContextType>({
  mediaType: null,
  setMediaType: () => {},
  mediaSource: null,
  setMediaSource: () => {},
  isPlaying: false,
  setIsPlaying: () => {},
  currentTime: 0,
  setCurrentTime: () => {},
  duration: 0,
  setDuration: () => {},
  volume: 1,
  setVolume: () => {},
  handlePlayPause: () => {},
  handleTimeUpdate: () => {},
  handleDurationChange: () => {},
  handleVolumeChange: () => {},
  handleSeek: () => {},
  changeMediaSource: () => {},
});

export const useMediaWindowContext = () => useContext(MediaWindowContext);

export const useAudioContext = () => useContext(AudioContext);

export function MediaWindowProvider({
  defaultMediaSource,
  defaultMediaType,
  children,
}: {
  children: React.ReactNode;
  defaultMediaSource?: string | null;
  defaultMediaType?: string | null;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [mediaType, setMediaType] = useState<string | null>(
    defaultMediaType ?? null
  );
  const [mediaSource, setMediaSource] = useState<string | null>(
    defaultMediaSource ?? null
  );

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleDurationChange = (duration: number) => {
    setDuration(duration);
  };

  const handleVolumeChange = (volume: number) => {
    setVolume(volume);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  return (
    <AudioContext.Provider value={{ audioRef }}>
      <MediaWindowContext.Provider
        value={{
          changeMediaSource: (
            mediaSource: string,
            options = { type: "audio", reset: true }
          ) => {
            setMediaSource(mediaSource);
            if (options.reset) {
              setCurrentTime(0);
            }
          },
          mediaType,
          setMediaType,
          mediaSource,
          setMediaSource,
          isPlaying,
          setIsPlaying,
          currentTime,
          setCurrentTime,
          duration,
          setDuration,
          volume,
          setVolume,
          handlePlayPause,
          handleTimeUpdate,
          handleDurationChange,
          handleVolumeChange,
          handleSeek,
        }}
      >
        {children}
      </MediaWindowContext.Provider>
    </AudioContext.Provider>
  );
}

function PlaybackController() {
  const { audioRef } = useAudioContext();
  const { isPlaying } = useMediaWindowContext();

  console.log("rerendering");
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioRef]);

  return null;
}

export function MediaWindow() {
  // const {
  //   isPlaying,
  //   mediaType,
  //   setIsPlaying,
  //   setDuration,
  //   volume,
  //   setVolume,
  //   ...ctx
  // } = useMediaWindowContext();
  // const { audioRef } = useAudioContext();

  // console.log("rerendering media window");
  // const mediaSource = useMemo(() => {
  //   return ctx.mediaSource;
  // }, [ctx.mediaSource]);

  // useEffect(() => {
  //   console.log("prop ctx changed to", ctx);
  // }, [ctx]);

  // useLogPropChanges({ mediaSource, isPlaying, audioRef });

  const [mediaSource] = useAtom(mediaSourceAtom);
  const [mediaType] = useAtom(mediaTypeAtom);
  const [isPlaying] = useAtom(isPlayingAtom);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  // const cachedMediaSource = useRef<string | null>(mediaSource);

  // useEffect(() => {
  //   if (cachedMediaSource.current === mediaSource) {
  //     return;
  //   }

  //   if (audioRef.current && mediaSource) {
  //     // cachedMediaSource.current = mediaSource;
  //     audioRef.current.load();
  //     if (isPlaying) {
  //       audioRef.current.play();
  //     }
  //   }
  // }, [mediaSource, isPlaying, audioRef]);

  // useEffect(() => {
  //   if (audioRef.current) {
  //     audioRef.current.volume = volume;
  //   }
  // }, [volume]);

  // const handleLoadedMetadata = useCallback(() => {
  //   console.log("metadata loaded ");
  //   if (audioRef.current) {
  //     setDuration(audioRef.current.duration);
  //   }
  // }, [setDuration]);

  // const audioComponent = useMemo(() => {
  //   console.log("rerendering audio component");
  //   return (
  //     <audio
  //       src={mediaSource ?? undefined}
  //       preload="metadata"
  //       controls
  //       ref={audioRef}
  //       // onPlay={() => setIsPlaying(true)}
  //       // onPause={() => setIsPlaying(false)}
  //       // onEnded={() => setIsPlaying(false)}
  //       // onDurationChange={(e) => setDuration(e.currentTarget.duration)}
  //       // onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
  //       onLoadedMetadata={handleLoadedMetadata}
  //     ></audio>
  //   );
  // }, [handleLoadedMetadata, mediaSource]);

  if (mediaType !== "audio" || !mediaSource) {
    return null;
  }

  return (
    <div className="fixed bottom-0 px-3 py-2 border-t border-gray-200 w-full bg-white shadow-md left-0 flex justify-center items-center">
      {/* {mediaType === "audio" && mediaSource && audioComponent} */}
      <audio
        controls
        src={mediaSource}
        ref={audioRef}
        preload="metadata"
      ></audio>
    </div>
  );
}

export function Player() {
  const { isPlaying } = useMediaWindowContext();

  return <audio></audio>;
}

export function AudioWindow() {}
