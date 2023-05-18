import { AcademicCapIcon } from "@heroicons/react/20/solid";
import { UseMutationResult } from "@tanstack/react-query";
import { MEMORY_STATUS, VerseMemoryStatusType } from "../../lib/localSchema";
import { useDaoStore } from "../../state/store";
import { DaoVerse } from "../../types";
import { Spinner } from "../shared/Spinner";
import { Countdown } from "../shared/Countdown";

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
    return updateStatusMutation.isLoading ? (
      <div className="text-xs ring-1 ring-gray-950/5 rounded-full px-3 py-1">
        <div className="flex w-full gap-x-1 items-center">
          <Spinner className="mr-1 h-3 w-3 text-gray-200 fill-gray-800" />
          Learning
        </div>
      </div>
    ) : null;

  if (verseStatus.status === MEMORY_STATUS.LEARNING) {
    return (
      <div className="text-xs">
        <button
          className="flex items-center gap-x-1 ring-1 ring-gray-950/5 rounded-full px-3 py-1"
          onClick={() => {
            setVerseBeingTested(verse);
          }}
        >
          {updateStatusMutation.isLoading ? (
            <Spinner className="h-3 w-3 text-gray-200 fill-gray-800" />
          ) : (
            <AcademicCapIcon className="h-3 w-3 text-gray-600" />
          )}
          Learning:
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
                display = "Now";
              }

              return <div className="font-mono">{display}</div>;
            }}
          />
        </button>
      </div>
    );
  }

  // if (verseStatus.status === "reviewing") {
  //   return <button className="text-sm">Unreview</button>;
  // }

  return <div className="text-sm">Unrecognized state</div>;
}
