import { twJoin } from "tailwind-merge";
import { ProgressBar } from "./ProgressBar";
import { Time } from "./Time";

export function AudioTimeController() {
  return (
    <div className="flex items-center gap-x-2 col-span-10 justify-end">
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
  );
}

const TimeStyle = twJoin("text-xs text-gray-500 dark:text-gray-400 font-mono");
