import {
  ArrowRightIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { twMerge as twJoin } from "tailwind-merge";
import { useMoreQuery } from "../../hooks";
import {
  INDEXED_DB_NAME,
  INDEXED_DB_VERSION,
  USER_ID,
} from "../../lib/localDb";
import {
  VerseMemoryStatus,
  VerseMemoryStatusType,
} from "../../lib/localDb/verseMemoryStatus";
import { MEMORY_STATUS } from "../../lib/localDb/verseMemoryStatus/schema";
import { queryClient } from "../../lib/reactQuery";
import {
  SecondaryButtonStyle,
  SecondaryDarkModeTextStyle,
  TooltipStyle,
  background,
} from "../../styles";
import { DaoVerse } from "../../types";
import { buildVerseMediaSourceUrl } from "../../utils";
import { AuxVerseHeaderLearning } from "../auxiliary/AuxVerseHeaderLearning";
import { AuxVerseLearningMenu } from "../auxiliary/AuxVerseLearningMenu";
import { Spinner } from "../shared/Spinner";
import { PlayPauseButton } from "./AudioPlayer/PlayPauseButton";
import { VerseDescription } from "./VerseDescription";
import { VerseHeaderStyle } from "./VerseHeader";
import { VerseText } from "./VerseText";

export function Verse({
  verse,
  verseStatus,
}: {
  verse: DaoVerse;
  verseStatus: VerseMemoryStatusType | null;
}) {
  const [showDescription, setShowDescription] = useState(false);
  const verseId = verse.id;

  const moreQuery = useMoreQuery(verseId, { enabled: showDescription });

  const updateStatusMutation = useMutation({
    mutationFn: async (args: { status: keyof typeof MEMORY_STATUS }) => {
      const { status } = args;
      const memoryStatus = await VerseMemoryStatus.update({
        userId_verseId: [USER_ID, verse.id],
        data: { status },
      });
      return memoryStatus;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["indexedDb", INDEXED_DB_NAME]);
      queryClient.invalidateQueries([
        "indexedDb",
        INDEXED_DB_NAME,
        INDEXED_DB_VERSION,
        VerseMemoryStatus.tableName,
        verse.id,
      ]);
    },
  });

  return (
    <div>
      <div className="flex items-center">
        <div>
          <a
            id={`dao${verseId}`}
            href={`#dao${verseId}`}
            className={VerseHeaderStyle}
          >
            第{verseId}章
          </a>
        </div>
        <PlayPauseButton className="ml-2" verseId={verse.id} />
        <AuxVerseHeaderLearning verse={verse} verseStatus={verseStatus} />

        <div className="grid items-center justify-self-end flex-1">
          <div className="items-center flex gap-x-1 justify-end">
            <AuxVerseLearningMenu
              verse={verse}
              verseStatus={verseStatus}
              updateStatusMutation={updateStatusMutation}
            />
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  className="flex items-center hover:underline text-gray-600 dark:text-gray-50"
                  onClick={() => {
                    setShowDescription(!showDescription);
                  }}
                >
                  <span
                    className={twJoin(
                      "group hover:bg-gray-200 rounded-full py-1 dark:hover:bg-gray-800",
                      "px-1"
                    )}
                  >
                    {moreQuery.isLoading && moreQuery.fetchStatus !== "idle" ? (
                      <Spinner className="h-4 w-4 text-gray-200 fill-gray-500" />
                    ) : showDescription ? (
                      <XMarkIcon
                        className={twJoin(
                          SecondaryButtonStyle,
                          // SecondaryButtonPadding,
                          "border-1 border-blue-500"
                        )}
                      />
                    ) : (
                      <ChevronUpDownIcon
                        className={twJoin(
                          SecondaryButtonStyle
                          // SecondaryButtonPadding,
                        )}
                      />
                    )}
                  </span>
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  sideOffset={3}
                  side={verseId === 1 ? "bottom" : "top"}
                  className={twJoin(TooltipStyle().content())}
                >
                  Show more
                  <Tooltip.Arrow className={TooltipStyle().arrow()} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Link
                  href={{
                    pathname: `/verses/${verse.id}`,
                    hash: `#dao${verse.id}`,
                  }}
                  className={twJoin(
                    SecondaryDarkModeTextStyle,
                    "text-sm flex items-center hover:underline gap-x-1 px-1"
                  )}
                >
                  Go{" "}
                  <ArrowRightIcon
                    className={twJoin("h-3 w-3", SecondaryDarkModeTextStyle)}
                  />
                </Link>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  sideOffset={3}
                  side={verseId === 1 ? "bottom" : "top"}
                  className={twJoin(TooltipStyle().content())}
                >
                  Go to verse page
                  <Tooltip.Arrow className={TooltipStyle().arrow()} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
        </div>
      </div>
      <VerseText text={verse.text} verseId={verse.id} />

      {showDescription && moreQuery.data && (
        <div className="pl-8">
          <div className="text-gray-400 mt-6">简介</div>
          <VerseDescription verseId={verse.id} data={moreQuery.data} />
        </div>
      )}
    </div>
  );
}
