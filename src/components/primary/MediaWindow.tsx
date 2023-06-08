// MediaWindow.js
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import {
  isPlayingAtom,
  mediaSourceAtom,
  mediaTypeAtom,
} from "../../state/mediaAtoms";
import { twMerge } from "tailwind-merge";
import { SoftBorder } from "../../styles";

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
    <div
      className={twMerge(
        "fixed bottom-0 px-3 py-2 border-t  w-full bg-white shadow-md left-0 flex justify-center items-center dark:bg-gray-950 z-20",
        SoftBorder
      )}
    >
      <audio
        // crossOrigin="anonymous"
        controls
        src={mediaSource}
        ref={audioRef}
        // preload="metadata"
      ></audio>
    </div>
  );
}
