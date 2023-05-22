import { Dialog } from "@headlessui/react";
import { useMutation } from "@tanstack/react-query";
import {
  INDEXED_DB_NAME,
  INDEXED_DB_VERSION,
  USER_ID,
  reportMemoryTestResult,
} from "../../lib/localDb";
import { VerseMemoryStatus } from "../../lib/localDb/verseMemoryStatus";
import { queryClient, useVerseMemoryStatusQuery } from "../../lib/reactQuery";
import { useDaoStore } from "../../state/store";
import { Countdown } from "../shared/Countdown";
import { Spinner } from "../shared/Spinner";

export function AuxVerseMemoryTestModal() {
  const verse = useDaoStore((state) => state.verseBeingTested);
  const setVerseBeingTested = useDaoStore((state) => state.setVerseBeingTested);
  const verseMemoryStatusQuery = useVerseMemoryStatusQuery({
    verseId: verse?.id ?? 0,
    opts: {
      enabled: !!verse,
      onSuccess: () => {
        queryClient.invalidateQueries([
          "indexedDb",
          INDEXED_DB_NAME,
          INDEXED_DB_VERSION,
          VerseMemoryStatus.tableName,
        ]);
      },
    },
  });

  const reportPassMutation = useMutation(async () => {
    if (!verse?.id) {
      throw new Error("No verse to report result for");
    }
    await reportMemoryTestResult({
      userId: USER_ID,
      verseId: verse.id,
      test: {
        type: "total",
        result: "pass",
      },
    });
  });

  const reportFailMutation = useMutation(async () => {
    if (!verse?.id) {
      throw new Error("No verse to report result for");
    }
    await reportMemoryTestResult({
      userId: USER_ID,
      verseId: verse.id,
      test: {
        type: "total",
        result: "fail",
      },
    });
  });

  const reportResult = (result: "pass" | "fail") => {
    if (!verse) {
      throw new Error("No verse to report result for");
    }
    let mutation = reportFailMutation;
    if (result === "pass") {
      mutation = reportPassMutation;
    }
    mutation.mutate();
  };

  const nextReviewValue =
    verseMemoryStatusQuery.data?.nextReviewDatetime ?? null;
  const nextReview = nextReviewValue ? new Date(nextReviewValue) : null;

  const onClose = () => {
    setVerseBeingTested(null);
  };

  return (
    <Dialog open={!!verse} onClose={onClose} as="div" className="relative z-10">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
            <Dialog.Title className="text-xl mb-2">
              Test Verse {verse?.id ?? ""}
            </Dialog.Title>
            <Dialog.Description className="mb-2">
              Test your memory of the verse
              {verse && `: ${verse.text.slice(0, 4)}...`}
            </Dialog.Description>
            <div>
              <div className="flex justify-between">
                Next review:{" "}
                <div className="font-mono">{nextReview?.toLocaleString()}</div>
              </div>
              <div className="flex justify-between">
                Due in:
                <div>
                  {nextReview ? (
                    <Countdown targetDate={nextReview} />
                  ) : (
                    "Loading..."
                  )}
                </div>
              </div>
            </div>
            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>
            <div className="flex gap-x-2 mt-2">
              <button
                className="flex relative justify-center items-center bg-green-500 px-3 py-2  text-white hover:bg-green-600 w-32"
                onClick={() => {
                  reportResult("pass");
                }}
              >
                {reportPassMutation.isLoading && (
                  <div className="absolute top-1/2 transform -translate-y-1/2 left-3">
                    <Spinner className="h-3 w-3 text-gray-300 fill-gray-400" />
                  </div>
                )}
                Success
              </button>
              <button
                className="flex relative justify-center items-center bg-red-500 text-white px-3 py-2 hover:bg-red-600 w-32"
                onClick={() => {
                  reportResult("fail");
                }}
              >
                {reportFailMutation.isLoading && (
                  <div className="absolute top-1/2 transform -translate-y-1/2 left-3">
                    <Spinner className="h-3 w-3 text-gray-300 fill-gray-400" />
                  </div>
                )}
                Failure
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
