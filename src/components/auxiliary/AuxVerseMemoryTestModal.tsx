import { Dialog } from "@headlessui/react";
import { DaoVerse } from "../../types";
import {
  CheckCircleIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { api } from "../../utils/trpc";
import { useDaoStore } from "../../state/store";
import { Spinner } from "../shared/Spinner";
import { Countdown } from "../shared/Countdown";

export function AuxVerseMemoryTestModal() {
  const verse = useDaoStore((state) => state.verseBeingTested);
  const setVerseBeingTested = useDaoStore((state) => state.setVerseBeingTested);
  const utils = api.useContext();
  const reportFailureMutation = api.verseLearning.recordTest.useMutation();
  const reportSuccessMutation = api.verseLearning.recordTest.useMutation();
  const reportResult = (result: "success" | "failure") => {
    if (!verse) {
      throw new Error("No verse to report result for");
    }

    let mutation = reportFailureMutation;
    if (result === "success") {
      mutation = reportSuccessMutation;
    }

    mutation.mutate(
      {
        verseId: verse.id,
        result,
        time: Date.now(),
      },
      {
        onSuccess: (verseStatus) => {
          utils.verseStatus.findOne.setData(
            {
              verseId: verseStatus.verseId,
            },
            {
              ...verseStatus,
            }
          );
          utils.verseStatus.findMany.setData(undefined, (old) => {
            if (!old) {
              return [verseStatus];
            }
            const newData = [...old];
            for (let i = 0; i < newData.length; i++) {
              if (newData[i].verseId === verseStatus.verseId) {
                newData[i] = verseStatus;
                break;
              }
            }
            return newData;
          });
          utils.verseStatus.findOne.invalidate({ verseId: verse?.id });
          utils.verseStatus.findMany.invalidate();
        },
      }
    );
  };

  const verseStatusQuery = api.verseStatus.findOne.useQuery(
    {
      verseId: verse?.id ?? 0,
    },
    {
      enabled: !!verse,
    }
  );
  const nextReview = verseStatusQuery.data?.nextReview;

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
                  reportResult("success");
                }}
              >
                {reportSuccessMutation.isLoading && (
                  <div className="absolute top-1/2 transform -translate-y-1/2 left-3">
                    <Spinner className="h-3 w-3 text-gray-300 fill-gray-400" />
                  </div>
                )}
                Success
              </button>
              <button
                className="flex relative justify-center items-center bg-red-500 text-white px-3 py-2 hover:bg-red-600 w-32"
                onClick={() => {
                  reportResult("failure");
                }}
              >
                {reportFailureMutation.isLoading && (
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
