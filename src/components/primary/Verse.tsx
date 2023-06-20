import {
  ArrowRightIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
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
import { SecondaryButtonStyle, SecondaryDarkModeTextStyle } from "../../styles";
import { DaoVerse } from "../../types";
import { buildVerseMediaSourceUrl } from "../../utils";
import { AuxVerseHeaderLearning } from "../auxiliary/AuxVerseHeaderLearning";
import { AuxVerseLearningMenu } from "../auxiliary/AuxVerseLearningMenu";
import { Spinner } from "../shared/Spinner";
import { PlayPauseButton } from "./PlayPauseButton";
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
  const verseMediaSource = buildVerseMediaSourceUrl(verseId);

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
        <PlayPauseButton verseMediaSource={verseMediaSource} className="ml-2" />
        <AuxVerseHeaderLearning verse={verse} verseStatus={verseStatus} />

        <div className="grid items-center justify-self-end flex-1">
          <div className="items-center flex gap-x-2 justify-end">
            <AuxVerseLearningMenu
              verse={verse}
              verseStatus={verseStatus}
              updateStatusMutation={updateStatusMutation}
            />
            <button
              className="text-xs flex items-center hover:underline text-gray-600 dark:text-gray-50"
              onClick={() => {
                setShowDescription(!showDescription);
              }}
            >
              Expand
              <span className="group hover:bg-gray-200 rounded-full py-1 dark:hover:bg-gray-800">
                {moreQuery.isLoading && moreQuery.fetchStatus !== "idle" ? (
                  <Spinner className="h-3 w-3 text-gray-200 fill-gray-500" />
                ) : showDescription ? (
                  <XMarkIcon className={SecondaryButtonStyle} />
                ) : (
                  <ChevronUpDownIcon className={SecondaryButtonStyle} />
                )}
              </span>
            </button>
            <Link
              href={`/verses/${verse.id}#dao${verse.id}`}
              className={twMerge(
                SecondaryDarkModeTextStyle,
                "text-xs flex items-center hover:underline gap-x-1"
              )}
            >
              Go{" "}
              <ArrowRightIcon
                className={twMerge("h-2 w-2", SecondaryDarkModeTextStyle)}
              />
            </Link>
          </div>
        </div>
      </div>
      <VerseText text={verse.text} verseId={verse.id} />

      {showDescription && moreQuery.data && (
        <div className="pl-8">
          <div className="text-gray-400 mt-6">简介</div>
          {/* @ts-ignore */}
          <VerseDescription verseId={verse.id} data={moreQuery.data} />
        </div>
      )}
    </div>
  );
}
