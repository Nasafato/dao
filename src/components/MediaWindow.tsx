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

export const mediaAtom = atom<{
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  mediaType: string;
  mediaSource: string | null;
}>({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.5,
  mediaType: "audio",
  mediaSource: null,
});

export function DebugAtom({ atom }: { atom: any }) {
  const [value] = useAtom(atom);
  return <pre>{JSON.stringify(value, null, 2)}</pre>;
}

export const isPlayingAtom = atom(
  (get) => get(mediaAtom).isPlaying,
  (get, set, isPlaying: boolean) =>
    set(mediaAtom, { ...get(mediaAtom), isPlaying })
);
export const currentTimeAtom = atom((get) => get(mediaAtom).currentTime);
export const durationAtom = atom((get) => get(mediaAtom).duration);
export const volumeAtom = atom((get) => get(mediaAtom).volume);
export const mediaTypeAtom = atom((get) => get(mediaAtom).mediaType);
export const mediaSourceAtom = atom(
  (get) => get(mediaAtom).mediaSource,
  (get, set, mediaSource: string) => {
    set(mediaAtom, { ...get(mediaAtom), mediaSource });
  }
);

export const changeMediaSourceAtom = atom(
  null,
  (
    get,
    set,
    {
      mediaSource,
      mediaType = "audio",
      startPlaying = true,
    }: { mediaSource: string; mediaType?: string; startPlaying?: boolean }
  ) => {
    const currentMediaSource = get(mediaSourceAtom);
    if (currentMediaSource === mediaSource) {
      return;
    }
    set(mediaAtom, {
      ...get(mediaAtom),
      mediaSource,
      mediaType,
      currentTime: 0,
      isPlaying: startPlaying,
    });
  }
);

export function MediaWindow() {
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
      <audio
        controls
        src={mediaSource}
        ref={audioRef}
        preload="metadata"
      ></audio>
    </div>
  );
}
