import { ForwardIcon, PauseIcon, PlayIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useDaoStore } from "@/state/store";
import { twJoin } from "tailwind-merge";
import { buildVerseMediaSourceUrl } from "../../../utils";

const LightColorStyle = "text-gray-400 hover:text-gray-500";
const SkipButtonStyle = twJoin(
  "h-5 w-5",
  LightColorStyle,
  "dark:hover:text-gray-300"
);

export function AudioController({ className }: { className?: string }) {
  const status = useDaoStore((state) => state.audioStatus);
  const verseId = useDaoStore((state) => state.audioVerseId);
  const setAudioStatus = useDaoStore((state) => state.setAudioStatus);
  const audioUrl = useDaoStore((state) => state.audioUrl);
  const playAudioUrl = useDaoStore((state) => state.playAudioUrl);
  const playNextVerse = () => {
    if (verseId && verseId < 81) {
      playAudioUrl(buildVerseMediaSourceUrl(verseId + 1), verseId + 1);
    }
  };
  const playPrevVerse = () => {
    if (verseId && verseId > 1) {
      playAudioUrl(buildVerseMediaSourceUrl(verseId - 1), verseId - 1);
    }
  };

  return (
    <div
      className={twJoin("flex justify-center items-center gap-x-3", className)}
    >
      <button onClick={playPrevVerse}>
        <ForwardIcon className={twJoin(SkipButtonStyle, "rotate-180")} />
      </button>
      <button
        className={twJoin(
          LightColorStyle,
          "dark:text-gray-400 dark:hover:text-gray-300"
        )}
        onClick={() => {
          if (!audioUrl) {
            playAudioUrl(buildVerseMediaSourceUrl(1), 1);
            return;
          }
          if (status === "playing") {
            setAudioStatus("paused");
          } else {
            setAudioStatus("playing");
          }
        }}
      >
        {status === "playing" ? (
          <PauseIcon className="h-6 w-6" />
        ) : (
          <PlayIcon className="h-6 w-6" />
        )}
      </button>
      {/* <button
        className={clsx(
          "h-6 w-6 ring-1 ring-gray-200 rounded-full flex justify-center items-center text-gray-400 hover:text-gray-500 dark:text-black dark:bg-white"
        )}
        onClick={() => {
          if (status === "playing") {
            setAudioStatus("paused");
          } else {
            setAudioStatus("playing");
          }
        }}
      >
        {status === "playing" ? (
          <PauseIcon className="h-3 w-3" />
        ) : (
          <PlayIcon className="h-3 w-3" />
        )}
      </button> */}
      <button onClick={playNextVerse}>
        <ForwardIcon className={twJoin(SkipButtonStyle)} />
      </button>
    </div>
  );
}
