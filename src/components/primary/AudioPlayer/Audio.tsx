import { useEffect, useRef } from "react";
import { useDaoStore } from "@/state/store";

export function Audio() {
  const ref = useRef<HTMLAudioElement>(null);
  const progress = useDaoStore((state) => state.audioProgress);
  const audioUrl = useDaoStore((state) => state.audioFile?.url ?? null);
  const audioStatus = useDaoStore((state) => state.audioStatus);
  const setAudioStatus = useDaoStore((state) => state.setAudioStatus);
  const setVisualProgress = useDaoStore((state) => state.setVisualProgress);
  const setAudioDuration = useDaoStore((state) => state.setAudioDuration);
  const isDragging = useDaoStore((state) => state.isDragging);

  useEffect(() => {
    if (ref.current) {
      if (ref.current.duration) {
        const time = progress * ref.current.duration;
        ref.current.currentTime = time;
      }
    }
  }, [progress]);

  useEffect(() => {
    if (ref.current) {
      if (audioStatus === "playing") {
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
      ref.current.load();
      ref.current.play();
      audioUrlRef.current = audioUrl;
    }
  }, [audioUrl]);

  return (
    <audio
      ref={ref}
      onEnded={() => {
        setAudioStatus("paused");
      }}
      onLoadedMetadata={() => {
        if (!ref.current) return;
        setAudioDuration(ref.current.duration);
      }}
      onTimeUpdate={() => {
        if (!ref.current) return;
        if (!isDragging) {
          setVisualProgress(ref.current.currentTime / ref.current.duration);
        }
      }}
    ></audio>
  );
}
