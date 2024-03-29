import { Menu, Transition } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import * as Tooltip from "@radix-ui/react-tooltip";
import { UseMutationResult } from "@tanstack/react-query";
import { Fragment } from "react";
import { twJoin } from "tailwind-merge";
import { VerseMemoryStatusType } from "@/lib/localDb/verseMemoryStatus";
import { MEMORY_STATUS } from "@/lib/localDb/verseMemoryStatus/schema";
import { useDaoStore } from "@/state/store";
import { SecondaryButtonStyle, TooltipStyle } from "@/styles";
import { DaoVerse } from "@/types";
import { Spinner } from "@/components/shared/Spinner";

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

  const shouldShowTestButton = verseStatus?.status === MEMORY_STATUS.LEARNING;

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div className="flex items-center">
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Menu.Button className="inline-flex w-full px-1 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 text-gray-600 hover:text-gray-500 py-1 underline-offset-2 hover:underline group hover:bg-gray-200 dark:hover:bg-gray-800">
                <EllipsisVerticalIcon
                  className={twJoin(SecondaryButtonStyle)}
                />
              </Menu.Button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                sideOffset={3}
                side={verse.id === 1 ? "bottom" : "top"}
                className={twJoin(TooltipStyle().content())}
              >
                Menu
                <Tooltip.Arrow className={TooltipStyle().arrow()} />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
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
          <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-gray-950 dark:ring-gray-200/20 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
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
              {shouldShowTestButton && (
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
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}
