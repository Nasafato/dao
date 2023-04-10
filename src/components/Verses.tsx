import { useQuery } from "@tanstack/react-query";
import { clsx } from "clsx";
import { useEffect, useRef } from "react";
import { punctuation } from "../consts";
import { dictionaryEntrySchema } from "../types";
import AudioPlayer from "./AudioPlayer";
import { Popover, PopoverContextProvider, usePopover } from "./VersesPopover";

type DaoVerse = {
  id: number;
  text: string;
  audio?: string | undefined;
};

interface VerseProps {
  verses: DaoVerse[];
}

export function Verses({ verses }: VerseProps) {
  return (
    <PopoverContextProvider>
      <div className="space-y-4">
        {verses.map((verse) => {
          return <Verse key={verse.id} verse={verse} />;
        })}
        <Popover />
      </div>
    </PopoverContextProvider>
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
  return (
    <div className="text-xl">
      <h2 className="text-gray-400 text-base">第{verse.id}章</h2>
      {verse.audio && <AudioPlayer src={`/audio/${verse.audio}`} />}
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
