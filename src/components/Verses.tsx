import { clsx } from "clsx";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { punctuation } from "../consts";
import { dictionaryEntrySchema } from "../types";
import { useQuery } from "@tanstack/react-query";

type Dao = {
  id: number;
  text: string;
};

interface VerseProps {
  verses: Dao[];
}

export function Verses({ verses }: VerseProps) {
  return (
    <div className="space-y-4">
      {verses.map((verse) => {
        return <Verse key={verse.id} verse={verse} />;
      })}
    </div>
  );
}

function Verse({ verse }: { verse: Dao }) {
  const chars = verse.text.split("");
  const text = chars.map((char, index) => {
    if (punctuation.includes(char)) {
      return char;
    }
    return <Char key={index} char={char} />;
  });
  return (
    <div className="text-xl">
      <h2 className="text-gray-400 text-base">第{verse.id}章</h2>
      <div>{text}</div>
    </div>
  );
}

function Char({ char }: { char: string }) {
  // const [isHovering, setIsHovering] = useState(char === "不" ? true : false);
  const [isHovering, setIsHovering] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <span
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={clsx("relative", {
        "text-green-600": isHovering,
      })}
    >
      {char}
      {isHovering && <DefinitionPopover char={char} />}
    </span>
  );
}

function DefinitionPopover({ char }: { char: string }) {
  const { data } = useQuery({
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
      style={{ left: "100%", top: "1.5rem" }}
      className={clsx(
        "absolute bg-white z-10  border-gray-500 border px-3 py-2 rounded-md shadow-md w-52 text-gray-800 overflow-scroll hyphens-auto"
      )}
    >
      <h3>{char}</h3>
      <div className="text-sm">{data?.pinyin.join(" ")}</div>
      <div className="h-[1px] bg-gray-800 w-12 my-1" />
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
