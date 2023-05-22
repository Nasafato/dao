import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { UseMutationResult } from "@tanstack/react-query";
import { Fragment } from "react";
import { MEMORY_STATUS } from "../../lib/localDb/verseMemoryStatus/schema";
import { VerseMemoryStatusType } from "../../lib/localDb/verseMemoryStatus";
import { useDaoStore } from "../../state/store";
import { DaoVerse } from "../../types";
import { Spinner } from "../shared/Spinner";

export function AuxVerseLearningMenu({
  verse,
  verseStatus,
  updateStatusMutation,
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
  const onUnlearnClick = () => {
    updateStatusMutation.mutate({ status: MEMORY_STATUS.NOT_LEARNING });
  };

  const onLearnClick = () => {
    updateStatusMutation.mutate({ status: MEMORY_STATUS.LEARNING });
  };

  const setVerseBeingTested = useDaoStore((state) => state.setVerseBeingTested);
  const onTestClick = () => {
    setVerseBeingTested(verse);
  };

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div className="flex items-center">
          <Menu.Button className="inline-flex w-full items-center justify-center ring-1 ring-gray-950/5 rounded-full px-2 py-1 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 hover:text-gray-500">
            Options
            <ChevronDownIcon
              className="ml-1 -mr-1 h-4 w-4 text-gray-300 hover:text-gray-200"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-gray-950 dark:ring-gray-200/20 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
            <div className="px-1 py-1 text-xs">
              <Menu.Item>
                {({ active }) => {
                  if (
                    !verseStatus ||
                    verseStatus.status === MEMORY_STATUS.NOT_LEARNING
                  ) {
                    return (
                      <button
                        onClick={onLearnClick}
                        // disabled={!verseStatus}
                        className={`${
                          active
                            ? "bg-green-500 text-white disabled:bg-gray-200"
                            : "text-gray-900 dark:text-gray-200"
                        } group flex w-full items-center rounded-md px-2 py-1 disabled:line-through`}
                      >
                        <PlusCircleIcon className="mr-2 h-3 w-3 text-green-500" />
                        Learn
                      </button>
                    );
                  } else if (verseStatus.status === MEMORY_STATUS.LEARNING) {
                    return (
                      <div className="text-xs">
                        <button
                          className={`${
                            active
                              ? "bg-green-500 text-white"
                              : "text-gray-900 dark:text-gray-200"
                          } group flex w-full items-center rounded-md px-2 py-1`}
                          onClick={onUnlearnClick}
                        >
                          {updateStatusMutation.isLoading ? (
                            <Spinner className="mr-2 h-3 w-3 text-gray-200 fill-gray-800" />
                          ) : (
                            <XMarkIcon className="mr-2 h-3 w-3 text-red-500" />
                          )}
                          Unlearn
                        </button>
                      </div>
                    );
                  } else if (verseStatus.status === "reviewing") {
                    return <button className="text-sm">Unreview</button>;
                  }
                  return <div className="text-sm">Unrecognized state</div>;
                }}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => {
                  return (
                    <button
                      className={`${
                        active
                          ? "bg-green-500 text-white"
                          : "text-gray-900 dark:text-gray-200"
                      } group flex w-full items-center rounded-md px-2 py-1`}
                      onClick={onTestClick}
                    >
                      Test
                    </button>
                  );
                }}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}
