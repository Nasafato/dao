import {
  ArrowDownIcon,
  PauseIcon,
  PlayIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { CDN_URL, punctuation } from "../consts";
import {
  changeMediaSourceAtom,
  isPlayingAtom,
  mediaSourceAtom,
} from "../state/mediaAtoms";
import {
  DaoVerse,
  DictionaryEntrySchema,
  DictionarySchemaType,
} from "../types";
import { DownloadAudioButton } from "./DownloadAudioButton";
import { usePopover } from "./VersesPopover";
import { VerseHeader } from "./VerseHeader";

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
  verseStatus: string | null;
}) {
  const [showDescription, setShowDescription] = useState(false);
  const chars = verse.text.split("");
  const text = chars.map((char, index) => {
    if (punctuation.includes(char)) {
      return char;
    }
    return <Char key={index} char={char} charId={`${verse.id}-${index}`} />;
  });

  const verseMediaSource = fetchVerseMediaSource(verse.id);

  return (
    <div className="text-xl">
      <VerseHeader
        verseId={verse.id}
        verseMediaSource={verseMediaSource}
        verseStatus={verseStatus}
      />
      <div>{text}</div>
      {/* <hr className="mt-2" /> */}
      <button
        className="mb-2 mt-4 text-xs px-2 py-1 border-gray-200 border hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center gap-x-1"
        onClick={() => {
          setShowDescription(!showDescription);
        }}
      >
        Description{" "}
        {showDescription ? (
          <XMarkIcon className="h-2 w-2" />
        ) : (
          <ArrowDownIcon className="h-2 w-2" />
        )}
      </button>
      {showDescription && <Description verseId={verse.id} />}
    </div>
  );
}

function Description({ verseId }: { verseId: number }) {
  const { data } = useQuery({
    queryKey: ["description", verseId],
    queryFn: async () => {
      const res = await fetch(`/api/description?verseId=${verseId}`);
      const json = await res.json();
      return json as string;
    },
    networkMode: "always",
  });

  if (!data) {
    return null;
  }
  const chars = data.split("");
  const text = chars.map((char, index) => {
    if (punctuation.includes(char)) {
      return char;
    }
    return (
      <Char
        key={index}
        char={char}
        charId={`${verseId}-description-${index}`}
      />
    );
  });

  return <div>{text}</div>;
}

function Char({ char, charId }: { char: string; charId: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { renderPopover, popover } = usePopover();
  useEffect(() => {
    if (charId !== popover.currentCharId || !ref.current || !popover.isOpen) {
      return;
    }

    const handleResize = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      renderPopover({
        content: <Definition char={char} />,
        currentCharId: charId,
        element: ref.current,
        rect,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [charId, popover.currentCharId, char, renderPopover, popover.isOpen]);

  return (
    <span
      id={charId}
      ref={ref}
      onClick={() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        renderPopover({
          content: <Definition char={char} />,
          currentCharId: charId,
          element: ref.current,
          rect,
        });
      }}
      className={clsx("relative", {
        "text-green-600": popover.currentCharId === charId && popover.isOpen,
      })}
    >
      {char}
    </span>
  );
}

function Definition({ char }: { char: string }) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["definition", char],
    queryFn: async () => {
      const dictionary = queryClient.getQueryData<DictionarySchemaType>([
        "dictionary",
      ]);
      if (dictionary) {
        const entry = dictionary[char];
        return entry;
      }
      if (!char) return;
      const r = await fetch(`/api/definition?char=${char}`);
      const result = await r.json();
      return DictionaryEntrySchema.parse(result);
    },
    networkMode: "always",
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // staleTime: Infinity,
    enabled: !!char,
  });

  return (
    <div
      className={clsx(
        "bg-white dark:bg-gray-950 border-gray-500 dark:border-gray-200 dark:text-gray-100 border px-3 py-2 rounded-md shadow-md text-gray-800 overflow-scroll hyphens-auto h-full"
      )}
    >
      <h3>{char}</h3>
      <div className="text-sm">{data?.pinyin.join(" ")}</div>
      {isLoading && <div>Loading...</div>}
      <ul className="list-decimal list-inside">
        {data &&
          data.definitions.english.map((def, index) => (
            <li className="text-xs" key={index}>
              {def}
            </li>
          ))}
      </ul>
      <ul>
        {data &&
          data.definitions.chinese?.map((def, index) => (
            <li className="text-xs" key={index}>
              {def}
            </li>
          ))}
      </ul>
    </div>
  );
}
