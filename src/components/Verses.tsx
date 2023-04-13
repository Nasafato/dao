import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../setup";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import { clsx } from "clsx";
import { useEffect, useRef } from "react";
import { CDN_URL, punctuation } from "../consts";
import { dictionaryEntrySchema } from "../types";
import { Popover, PopoverContextProvider, usePopover } from "./VersesPopover";
import * as z from "zod";
import {
  MediaWindow,
  isPlayingAtom,
  mediaSourceAtom,
  durationAtom,
  currentTimeAtom,
  mediaTypeAtom,
  volumeAtom,
  DebugAtom,
  mediaAtom,
  changeMediaSourceAtom,
} from "./MediaWindow";
import { useAtom } from "jotai";

const DictionarySchema = z.record(dictionaryEntrySchema);

type DictionarySchemaType = z.infer<typeof DictionarySchema>;

type DaoVerse = {
  id: number;
  text: string;
};

interface VerseProps {
  verses: DaoVerse[];
}

export function Verses({ verses }: VerseProps) {
  useQuery({
    queryKey: ["dictionary"],
    queryFn: async () => {
      const result = await fetch("/api/dictionary");
      const json = await result.json();
      const validated = DictionarySchema.parse(json);
      return validated;
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    cacheTime: Infinity,
  });

  return (
    <PopoverContextProvider>
      {/* <DebugAtom atom={mediaAtom} /> */}
      <div className="space-y-4">
        {verses.map((verse) => {
          return <Verse key={verse.id} verse={verse} />;
        })}
        <Popover />
      </div>
      <MediaWindow />
    </PopoverContextProvider>
  );
}

function PlayPauseButton({ verseMediaSource }: { verseMediaSource: string }) {
  const [, changeMediaSource] = useAtom(changeMediaSourceAtom);
  const [mediaSource, setMediaSource] = useAtom(mediaSourceAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);

  return (
    <button
      className="h-5 w-5 bg-gray-200 rounded-full flex justify-center items-center text-gray-500 hover:bg-gray-300"
      onClick={() => {
        if (mediaSource !== verseMediaSource) {
          changeMediaSource({
            mediaSource: verseMediaSource,
            mediaType: "audio",
          });
        } else {
          setIsPlaying(!isPlaying);
        }
      }}
    >
      {isPlaying && mediaSource === verseMediaSource ? (
        <PauseIcon className="h-3 w-3 " />
      ) : (
        <PlayIcon className="h-3 w-3" />
      )}
    </button>
  );
}

function Verse({ verse }: { verse: DaoVerse }) {
  const chars = verse.text.split("");
  const text = chars.map((char, index) => {
    if (punctuation.includes(char)) {
      return char;
    }
    return <Char key={index} char={char} charId={`${verse.id}-${index}`} />;
  });

  const verseMediaSource = `${CDN_URL}/dao${
    verse.id < 10 ? "0" + verse.id : verse.id
  }.mp3`;

  return (
    <div className="text-xl">
      <div className="flex items-center justify-between py-1 w-[80px]">
        <a
          id={`dao${verse.id}`}
          href={`#dao${verse.id}`}
          className="text-gray-400 text-base"
        >
          第{verse.id}章
        </a>
        <PlayPauseButton verseMediaSource={verseMediaSource} />
      </div>
      <div>{text}</div>
    </div>
  );
}

function Char({ char, charId }: { char: string; charId: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { renderPopover, popover } = usePopover();
  useEffect(() => {
    if (charId !== popover.currentCharId || !ref.current || !popover.isOpen) {
      return;
    }

    // Handle resize
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

    // Add event listener
    window.addEventListener("resize", handleResize);

    return () => {
      // Remove event listener on cleanup
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
      return dictionaryEntrySchema.parse(result);
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled: !!char,
  });

  return (
    <div
      className={clsx(
        "bg-white border-gray-500 border px-3 py-2 rounded-md shadow-md text-gray-800 overflow-scroll hyphens-auto h-full"
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
