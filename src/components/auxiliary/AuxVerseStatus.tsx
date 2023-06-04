import { AcademicCapIcon } from "@heroicons/react/20/solid";
import { UseMutationResult } from "@tanstack/react-query";
import { MEMORY_STATUS } from "../../lib/localDb/verseMemoryStatus/schema";
import { useDaoStore } from "../../state/store";
import { DaoVerse } from "../../types";
import { Spinner } from "../shared/Spinner";
import { Countdown } from "../shared/Countdown";
import { VerseMemoryStatusType } from "../../lib/localDb/verseMemoryStatus";
import { SecondaryButtonStyles, SecondaryDarkModeText } from "../../styles";
import { twMerge } from "tailwind-merge";

export function AuxVerseStatus({
  verse,
  updateStatusMutation,
  verseStatus,
}: {
  verse: DaoVerse;
  verseStatus: VerseMemoryStatusType | null;
  updateStatusMutation: UseMutationResult<
    {
      id: string;
      verseId: number;
      status: "LEARNING" | "NOT_LEARNING";
      nextReviewDatetime: number;
    },
    unknown,
    {
      status: keyof typeof MEMORY_STATUS;
    },
    unknown
  >;
}) {
  const setVerseBeingTested = useDaoStore((state) => state.setVerseBeingTested);
  if (!verseStatus || verseStatus.status === MEMORY_STATUS.NOT_LEARNING)
    return null;
  // return updateStatusMutation.isLoading ? (
  //   <div className="text-xs ring-1 ring-gray-950/5 rounded-full px-3 py-1">
  //     <div className="flex w-full gap-x-1 items-center">
  //       <Spinner className="mr-1 h-3 w-3 text-gray-200 fill-gray-800" />
  //       Learning
  //     </div>
  //   </div>
  // ) : null;

  if (verseStatus.status === MEMORY_STATUS.LEARNING) {
    return (
      <div className="text-xs ml-1">
        <div
          className="h-4 flex items-center gap-x-1 ring-1 ring-gray-200 rounded-full px-3"
          // onClick={() => {
          // setVerseBeingTested(verse);
          // }}
        >
          <AcademicCapIcon className={SecondaryButtonStyles} />
          <span
            className={twMerge(
              "font-mono text-[0.6rem] text-gray-500",
              SecondaryDarkModeText
            )}
          >
            Learning:
          </span>
          <Countdown
            targetDate={new Date(verseStatus.nextReviewDatetime)}
            render={(timeLeft) => {
              let display = "";

              if (timeLeft.years > 0) {
                const years = timeLeft.years.toString().padStart(2, "0");
                display = `${years}y`;
              } else if (timeLeft.months > 0) {
                const months = timeLeft.months.toString().padStart(2, "0");
                display = `${months}mo`;
              } else if (timeLeft.days > 0) {
                const days = timeLeft.days.toString().padStart(2, "0");
                display = `${days}d`;
              } else if (timeLeft.hours > 0) {
                const hours = timeLeft.hours.toString().padStart(2, "0");
                display = `${hours}h`;
              } else if (timeLeft.minutes > 0) {
                const minutes = timeLeft.minutes.toString().padStart(2, "0");
                display = `${minutes}m`;
              } else if (timeLeft.seconds > 0) {
                const seconds = timeLeft.seconds.toString().padStart(2, "0");
                display = `${seconds}s`;
              } else {
                display = `0s`;
              }

              return (
                <div
                  className={twMerge(
                    "font-mono text-gray-500 text-[0.6rem]",
                    SecondaryDarkModeText
                  )}
                >
                  {display}
                </div>
              );
            }}
          />
        </div>
      </div>
    );
  }

  // if (verseStatus.status === "reviewing") {
  //   return <button className="text-sm">Unreview</button>;
  // }

  return <div className="text-sm">Unrecognized state</div>;
}
