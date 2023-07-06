import { useDaoStore } from "@/state/store";
import { BorderStyle, SoftBorderStyle } from "@/styles";
import { twJoin } from "tailwind-merge";
import { LanguageDisplayMap, capitalize } from "@/utils";

export function AudioTitle({ className }: { className?: string }) {
  const audioFile = useDaoStore((state) => state.audioFile);
  const verseId = useDaoStore((state) => state.audioFile?.verseId);

  return (
    <div
      className={twJoin(
        "text-xs flex items-center mr-4 w-20 justify-start",
        BorderStyle,
        className
      )}
    >
      {audioFile ? (
        <div className={twJoin("pr-4")}>
          <a
            href={`#dao${verseId}`}
            className="block mb-1 underline underline-offset-4 text-gray-800 hover:text-gray-500  dark:hover:text-gray-200 dark:text-gray-400 "
          >
            <h5
              className={twJoin(
                "text-center text-lg flex items-center font-semibold capitalize",
                SoftBorderStyle
              )}
            >
              {audioFile.title}
            </h5>
          </a>
          <div className="text-xs">
            {LanguageDisplayMap[audioFile.language]}
          </div>
          <div className="text-xs">
            {audioFile.translator ? capitalize(audioFile.translator) : null}
          </div>
        </div>
      ) : (
        <div>Not playing</div>
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
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={twJoin("feather feather-shuffle", className)}
  >
    <polyline points="16 3 21 3 21 8"></polyline>
    <line x1="4" y1="20" x2="21" y2="3"></line>
    <polyline points="21 16 21 21 16 21"></polyline>
    <line x1="15" y1="15" x2="21" y2="21"></line>
    <line x1="4" y1="4" x2="9" y2="9"></line>
  </svg>
);
