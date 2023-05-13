import { AcademicCapIcon } from "@heroicons/react/20/solid";
import { VerseToUser } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useDaoStore } from "../state/store";
import { api } from "../utils/trpc";
import { Countdown } from "./Countdown";
import { Spinner } from "./Spinner";
import { DaoVerse } from "../types";

export function VerseStatus({
  verse,
  updateStatusMutation,
  verseStatus,
}: {
  verse: DaoVerse;
  verseStatus: VerseToUser | null;
  updateStatusMutation: ReturnType<
    typeof api.verseStatus.updateStatus.useMutation
  >;
}) {
  const session = useSession();
  const setVerseBeingTested = useDaoStore((state) => state.setVerseBeingTested);
  if (!(session?.status === "authenticated")) return null;
  if (!verseStatus || verseStatus.status === "not-learning")
    return updateStatusMutation.isLoading ? (
      <div className="text-xs ring-1 ring-gray-950/5 rounded-full px-3 py-1">
        <div className="flex w-full gap-x-1 items-center">
          <Spinner className="mr-1 h-3 w-3 text-gray-200 fill-gray-800" />
          Learning
        </div>
      </div>
    ) : null;

  if (verseStatus.status === "learning") {
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
            targetDate={verseStatus.nextReview}
            render={(timeLeft) => {
              let display = "";

              if (timeLeft.hours > 0) {
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

  if (verseStatus.status === "reviewing") {
    return <button className="text-sm">Unreview</button>;
  }

  return <div className="text-sm">Unrecognized state</div>;
}
