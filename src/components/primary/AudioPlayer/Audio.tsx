import { useEffect, useRef } from "react";
import { useDaoStore } from "../../../state/store";

export function Audio() {
  const ref = useRef<HTMLAudioElement>(null);
  const progress = useDaoStore((state) => state.audioProgress);
  const audioUrl = useDaoStore((state) => state.audioUrl);
  const audioStatus = useDaoStore((state) => state.audioStatus);
  const setVisualProgress = useDaoStore((state) => state.setVisualProgress);
  const setAudioDuration = useDaoStore((state) => state.setAudioDuration);
  const isDragging = useDaoStore((state) => state.isDragging);

  const handleTimeUpdate = () => {
    if (!ref.current) return;
    console.log("time", ref.current.currentTime);
    if (!isDragging) {
      setVisualProgress(ref.current.currentTime / ref.current.duration);
    }
  };

  const handleLoadedMetadata = () => {
    if (!ref.current) return;
    setAudioDuration(ref.current.duration);
  };

  useEffect(() => {
    if (ref.current) {
      if (ref.current.duration) {
        console.log("setting progress", progress);
        const time = progress * ref.current.duration;
        console.log("newTime", time);
        ref.current.currentTime = time;
      }
    }
  }, [progress]);

  useEffect(() => {
    if (ref.current) {
      if (audioStatus === "playing") {
        console.log("playing from status change");
        ref.current.play();
      } else {
        ref.current.pause();
      }
    }
  }, [audioStatus]);

  const audioUrlRef = useRef<string | null>(audioUrl);
  useEffect(() => {
    if (ref.current && audioUrl) {
      if (audioUrlRef.current === audioUrl) {
        return;
      }
      ref.current.src = audioUrl;
      console.log("playing from url change");
      ref.current.load();
      ref.current.play();
      audioUrlRef.current = audioUrl;
    }
  }, [audioUrl]);

  return (
    <audio
      ref={ref}
      onLoadedMetadata={handleLoadedMetadata}
      onTimeUpdate={handleTimeUpdate}
    ></audio>
  );
}
