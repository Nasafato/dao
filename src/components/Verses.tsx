import useSWR from "swr";
import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import { punctuation } from "../consts";
import { dictionaryEntrySchema } from "../types";

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
      <span>第{verse.id}章:</span> <span>{text}</span>
    </div>
  );
}

function Char({ char }: { char: string }) {
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

const fetcher = async (url: string) => {
  const r = await fetch(url);
  const result = await r.json();
  return dictionaryEntrySchema.parse(result);
};

function DefinitionPopover({ char }: { char: string }) {
  const [shouldFetch, setShouldFetch] = useState(false);
  useEffect(() => {
    if (char) {
      setShouldFetch(true);
    } else {
      setShouldFetch(false);
    }
  }, [char]);
  const fetchString = shouldFetch ? `/api/definition?word=${char}` : null;
  const { data, error, isLoading } = useSWR(fetchString, () =>
    fetcher(fetchString ?? "")
  );
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="absolute top-6 left-4 bg-white z-10 border-gray-500 border px-3 py-2 rounded-md shadow-md w-40 text-gray-800 overflow-scroll"
    >
      <h3>{char}</h3>
      <div className="text-sm">{data?.pinyin.join(" ")}</div>
      <div className="h-[1px] bg-gray-800 w-12 my-1" />
      {data &&
        data.definitions.english.map((def, index) => (
          <p className="text-xs" key={index}>
            {def}
          </p>
        ))}
      {data &&
        data.definitions.chinese?.map((def, index) => (
          <p className="text-xs" key={index}>
            {def}
          </p>
        ))}
    </div>
  );
}
