import { useDaoStore } from "@/state/store";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export function ProgressBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const progress = useDaoStore((state) => state.audioProgress);
  const setProgress = useDaoStore((state) => state.setAudioProgress);
  const setVisualProgress = useDaoStore((state) => state.setVisualProgress);
  const visualProgress = useDaoStore((state) => state.visualProgress);
  const isDragging = useDaoStore((state) => state.isDragging);
  const setIsDragging = useDaoStore((state) => state.setIsDragging);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setVisualProgress(computeProgress(e.x, containerRef.current!));
    };

    const handleMouseUp = (e: MouseEvent) => {
      console.log("mouseup");
      if (!containerRef.current) return;
      const progress = computeProgress(e.x, containerRef.current);
      console.log("progress", progress);
      setProgress(progress);
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, setIsDragging, setProgress, progress, setVisualProgress]);

  return (
    <div
      ref={containerRef}
      onMouseDown={() => {
        setIsDragging(true);
      }}
      //   onMouseUp={() => {
      //     setIsDragging(false);
      //   }}
      onClick={(e) => {
        if (containerRef.current) {
          const progress = computeProgress(e.clientX, containerRef.current);
          setProgress(progress);
        }
      }}
      className="group w-40 rounded-full h-2 border bg-gray-100"
    >
      <div
        ref={innerRef}
        className={twMerge(
          "bg-white h-full group-hover:bg-green-500 relative rounded-full",
          isDragging && "bg-green-500"
        )}
        style={{
          width: `${visualProgress * 100}%`,
        }}
      >
        <div
          className={twMerge(
            " hidden group-hover:block w-3 h-3 bg-black rounded-full absolute -right-[6px] top-1/2 -translate-y-1/2",
            isDragging && "block"
          )}
        ></div>
      </div>
    </div>
  );
}

function computeProgress(x: number, el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const width = el.clientWidth;
  const distanceFromLeft = x - rect.left;
  const progress = distanceFromLeft / width;
  if (progress > 1.0) {
    return 1.0;
  }
  if (progress < 0.0) {
    return 0.0;
  }

  return progress;
}
