import {
  ArrowDownIcon,
  ArrowRightIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { useState } from "react";
import { CDN_URL, punctuation } from "../../consts";
import {
  VerseMemoryStatus,
  VerseMemoryStatusType,
} from "../../lib/localDb/verseMemoryStatus";
import { DaoVerse } from "../../types";
import { api } from "../../utils/trpc";
import { Spinner } from "../shared/Spinner";
import { VerseChar } from "./VerseChar";
import { VerseDescription } from "./VerseDescription";
import { VerseHeader, VerseHeaderStyle } from "./VerseHeader";
import { VerseText } from "./VerseText";
import { PlayPauseButton } from "./PlayPauseButton";
import { buildVerseMediaSourceUrl } from "../../utils";
import { useDaoStore } from "../../state/store";
import { AuxVerseHeaderLearning } from "../auxiliary/AuxVerseHeaderLearning";
import { AuxVerseLearningMenu } from "../auxiliary/AuxVerseLearningMenu";
import { useMutation } from "@tanstack/react-query";
import {
  USER_ID,
  INDEXED_DB_NAME,
  INDEXED_DB_VERSION,
} from "../../lib/localDb";
import { MEMORY_STATUS } from "../../lib/localDb/verseMemoryStatus/schema";
import { queryClient } from "../../lib/reactQuery";

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
  const readerMode = useDaoStore((state) => state.readerMode);

  const moreQuery = api.verse.findDescription.useQuery(verse.id, {
    enabled: showDescription,
  });

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
        {!readerMode && (
          <AuxVerseHeaderLearning verse={verse} verseStatus={verseStatus} />
        )}

        <div className="grid items-center justify-self-end flex-1">
          <div className="items-center flex gap-x-2 justify-end">
            <AuxVerseLearningMenu
              verse={verse}
              verseStatus={verseStatus}
              updateStatusMutation={updateStatusMutation}
            />
            <button
              className="text-xs flex items-center hover:underline text-gray-600"
              onClick={() => {
                setShowDescription(!showDescription);
              }}
            >
              {/* Expand */}
              <span className="group hover:bg-gray-200 rounded-full py-1">
                {moreQuery.isLoading && moreQuery.fetchStatus !== "idle" ? (
                  <Spinner className="h-3 w-3 text-gray-200 fill-gray-500" />
                ) : showDescription ? (
                  <XMarkIcon className="h-3 w-3 text-gray-500 group-hover:text-gray-400" />
                ) : (
                  <ChevronUpDownIcon className="h-3 w-3 text-gray-500 group-hover:text-gray-400" />
                )}
              </span>
            </button>
            <Link
              href={`/verse/${verse.id}#dao${verse.id}`}
              className="text-xs hover:underline text-gray-600 flex items-center gap-x-1"
            >
              Go{" "}
              <ArrowRightIcon className="h-2 w-2 text-gray-500 hover:text-gray-400" />
            </Link>
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
