import { useEffect, useRef } from "react";
import { CharMap, addToRefMap, useCharNavigation } from "@/lib/charNavigation";
import { twMerge } from "tailwind-merge";

export function VerseChar({
  char,
  charId,
  canDefine = true,
}: {
  char: string;
  charId: string;
  canDefine?: boolean;
}) {
  const { renderCharId } = useCharNavigation();
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (!canDefine) return;

    addToRefMap(charId, ref.current);
    CharMap.set(charId, char);
  }, [charId, char, canDefine]);

  return (
    <span
      id={charId}
      ref={ref}
      className={twMerge(
        "character inline-flex min-h-[1.38em] min-w-[1.28em] items-center justify-center rounded-md align-middle transition-colors",
        "cursor-pointer select-text",
        canDefine
          ? "hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700"
          : "text-gray-500 dark:text-gray-400"
      )}
      onClick={() => {
        if (!canDefine) return;
        if (!ref.current) return;

        renderCharId(charId);
      }}
    >
      {char}
    </span>
  );
}
