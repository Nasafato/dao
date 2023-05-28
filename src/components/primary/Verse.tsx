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
      <VerseHeader verse={verse} verseStatus={verseStatus} hasAnchor />
      <VerseText text={verse.text} verseId={verse.id} />
      <div className="items-center flex mt-1 gap-x-6 justify-end">
        <button
          className="text-xs flex items-center gap-x-1 hover:underline"
          onClick={() => {
            setShowDescription(!showDescription);
          }}
        >
          Expand
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
        <div className="pl-8">
          <div className="text-gray-400 mt-6">简介</div>
          <VerseDescription verseId={verse.id} data={moreQuery.data} />
        </div>
      )}
    </div>
  );
}
