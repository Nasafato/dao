import { twJoin } from "tailwind-merge";
import { BorderStyle, SoftBorderStyle } from "../../../styles";
import { Audio } from "./Audio";
import { AudioController } from "./AudioController";
import { ProgressBar } from "./ProgressBar";
import { Time } from "./Time";
import { useDaoStore } from "../../../state/store";
import { buildVerseMediaSourceUrl } from "../../../utils";
import Link from "next/link";

export function AudioPlayer() {
  const verseId = useDaoStore((state) => state.audioVerseId);
  const playAudioUrl = useDaoStore((state) => state.playAudioUrl);

  return (
    <>
      <Audio />
      <div className="grid grid-rows-2 grid-cols-12">
        <div className="row-span-2 col-span-2 text-xs flex items-center">
          {verseId ? (
            <div
              className={twJoin("border-r pr-4 w-10 text-center", BorderStyle)}
            >
              <a
                href={`#dao${verseId}`}
                className="underline text-gray-800 hover:text-gray-500  dark:hover:text-gray-200 dark:text-gray-400 "
              >
                <h5
                  className={twJoin(
                    "text-center text-lg flex items-center font-semibold capitalize justify-center",
                    SoftBorderStyle
                  )}
                >
                  {verseId}
                </h5>
              </a>
            </div>
          ) : (
            <button
              className="flex items-center gap-x-2 border justify-center px-2 py-2 font-semibold hover:underline"
              onClick={() => {
                const randomVerseId = Math.floor(Math.random() * 80) + 1;
                const mediaSource = buildVerseMediaSourceUrl(randomVerseId);
                playAudioUrl(mediaSource, randomVerseId);
              }}
            >
              random
              <ShuffleIcon className="w-3 h-3" />
            </button>
          )}
        </div>
        <AudioController className="col-span-10" />
        <div className="flex items-center gap-x-2 col-span-10">
          <Time isBeginning>
            {(time) => {
              if (Number.isNaN(time)) time = 0;
              const minutes = Math.floor(time / 60);
              const seconds = Math.floor(time % 60);
              const str = `${minutes}:${seconds.toString().padStart(2, "0")}`;

              return <span className={TimeStyle}>{str}</span>;
            }}
          </Time>
          <ProgressBar />
          <Time>
            {(time) => {
              if (Number.isNaN(time)) time = 0;
              const minutes = Math.floor(time / 60);
              const seconds = Math.floor(time % 60);
              const str = `${minutes}:${seconds.toString().padStart(2, "0")}`;
              return <span className={TimeStyle}>{str}</span>;
            }}
          </Time>
        </div>
      </div>
    </>
  );
}

const TimeStyle = twJoin("text-xs text-gray-500 dark:text-gray-400 font-mono");

const ShuffleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className={twJoin("feather feather-shuffle", className)}
  >
    <polyline points="16 3 21 3 21 8"></polyline>
    <line x1="4" y1="20" x2="21" y2="3"></line>
    <polyline points="21 16 21 21 16 21"></polyline>
    <line x1="15" y1="15" x2="21" y2="21"></line>
    <line x1="4" y1="4" x2="9" y2="9"></line>
  </svg>
);
