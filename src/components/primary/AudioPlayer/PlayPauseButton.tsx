import { PauseIcon, PlayIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useDaoStore } from "../../../state/store";

export function PlayPauseButton({
  verseMediaSource,
  className,
}: {
  verseMediaSource: string;
  className?: string;
}) {
  const audioUrl = useDaoStore((state) => state.audioUrl);
  const status = useDaoStore((state) => state.audioStatus);
  const setAudioStatus = useDaoStore((state) => state.setAudioStatus);
  const playAudioUrl = useDaoStore((state) => state.playAudioUrl);

  return (
    <button
      className={clsx(
        "h-4 w-4 ring-1 ring-gray-200 rounded-full flex justify-center items-center text-gray-400 hover:bg-gray-200",
        className
      )}
      onClick={() => {
        if (audioUrl === verseMediaSource) {
          if (status === "playing") {
            setAudioStatus("paused");
          } else {
            setAudioStatus("playing");
          }
        } else {
          playAudioUrl(verseMediaSource);
        }
      }}
    >
      {status === "playing" && audioUrl === verseMediaSource ? (
        <PauseIcon className="h-2 w-2" />
      ) : (
        <PlayIcon className="h-2 w-2" />
      )}
    </button>
  );
}
