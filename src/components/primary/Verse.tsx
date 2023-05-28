import { ArrowDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useState } from "react";
import { CDN_URL, punctuation } from "../../consts";
import { VerseMemoryStatusType } from "../../lib/localDb/verseMemoryStatus";
import { DaoVerse } from "../../types";
import { api } from "../../utils/trpc";
import { Spinner } from "../shared/Spinner";
import { VerseChar } from "./VerseChar";
import { VerseDescription } from "./VerseDescription";
import { VerseHeader } from "./VerseHeader";
import { VerseText } from "./VerseText";

function fetchVerseMediaSource(
  verseId: number,
  options: { type: "human" | "generated" } = { type: "human" }
) {
  const type = options.type === "human" ? "human" : "generated";
  return `${CDN_URL}/${type}${verseId < 10 ? "0" + verseId : verseId}.mp3`;
}

export function Verse({
  verse,
  verseStatus,
}: {
  verse: DaoVerse;
  verseStatus: VerseMemoryStatusType | null;
}) {
  const [showDescription, setShowDescription] = useState(false);

  const moreQuery = api.verse.findDescription.useQuery(verse.id, {
    enabled: showDescription,
  });

  return (
    <div>
      <VerseHeader verse={verse} verseStatus={verseStatus} />
      <VerseText text={verse.text} verseId={verse.id} />
      <div className="items-center flex mb-2 mt-4 gap-x-6">
        <button
          className="text-xs px-2 py-1 border-gray-200 border hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center gap-x-1"
          onClick={() => {
            setShowDescription(!showDescription);
          }}
        >
          Description
          {moreQuery.isLoading && moreQuery.fetchStatus !== "idle" ? (
            <Spinner className="h-2 w-2 text-gray-200 fill-gray-400" />
          ) : showDescription ? (
            <XMarkIcon className="h-2 w-2" />
          ) : (
            <ArrowDownIcon className="h-2 w-2" />
          )}
        </button>
        <Link href={`/verse/${verse.id}`} className="text-xs hover:underline">
          Go to
        </Link>
      </div>
      {showDescription && moreQuery.data && (
        <VerseDescription verseId={verse.id} data={moreQuery.data} />
      )}
    </div>
  );
}
