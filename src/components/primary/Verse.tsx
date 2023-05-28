import { ArrowDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { CDN_URL, punctuation } from "../../consts";
import {
  DaoVerse,
  DictionaryEntrySchema,
  DictionarySchemaType,
} from "../../types";
import { VerseHeader } from "./VerseHeader";
import { usePopover } from "./VersesPopover";
import { VerseMemoryStatusType } from "../../lib/localDb/verseMemoryStatus";
import { api } from "../../utils/trpc";
import { DescriptionOutput } from "../../server/routers/_app";
import { VerseDescription } from "./VerseDescription";
import { VerseChar } from "./VerseChar";
import { Spinner } from "../shared/Spinner";

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
  const chars = verse.text.split("");
  const text = chars.map((char, index) => {
    if (punctuation.includes(char)) {
      return char;
    }
    return (
      <VerseChar key={index} char={char} charId={`${verse.id}-${index}`} />
    );
  });

  const verseMediaSource = fetchVerseMediaSource(verse.id);
  const moreQuery = api.verse.findDescription.useQuery(verse.id, {
    enabled: showDescription,
  });

  return (
    <div className="text-xl">
      <VerseHeader
        verse={verse}
        verseMediaSource={verseMediaSource}
        verseStatus={verseStatus}
      />
      <div>{text}</div>
      <button
        className="mb-2 mt-4 text-xs px-2 py-1 border-gray-200 border hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center gap-x-1"
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
      {showDescription && moreQuery.data && (
        <VerseDescription verseId={verse.id} data={moreQuery.data} />
      )}
    </div>
  );
}
