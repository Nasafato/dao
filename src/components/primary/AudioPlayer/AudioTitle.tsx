import { twJoin } from "tailwind-merge";
import { BorderStyle, SoftBorderStyle } from "@/styles";
import { buildVerseMediaSourceUrl } from "@/utils";
import { useDaoStore } from "@/state/store";

export function AudioTitle({ className }: { className?: string }) {
  const verseId = useDaoStore((state) => state.audioVerseId);
  const playAudioUrl = useDaoStore((state) => state.playAudioUrl);
  return (
    <div
      className={twJoin(
        "text-xs flex items-center mr-4 w-20 justify-center",
        BorderStyle,
        className
      )}
    >
      {verseId ? (
        <div className={twJoin("pr-4 w-10 text-center")}>
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
          className="flex items-center gap-x-2 justify-center px-2 py-2 font-semibold hover:underline"
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
  );
}

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
