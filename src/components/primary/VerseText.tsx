"use client";

import { registerReaderVerseText } from "@/lib/charNavigation";
import { useEffect, useRef } from "react";

export function VerseText({
  verseId,
  text,
}: {
  verseId: number;
  text: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return registerReaderVerseText(verseId, ref.current);
  }, [text, verseId]);

  return (
    <p
      ref={ref}
      data-reader-verse-id={verseId}
      className="select-text text-[2rem]/[1.7] font-normal tracking-normal text-gray-900 selection:bg-amber-200 selection:text-gray-950 dark:text-gray-50 dark:selection:bg-amber-300/30 dark:selection:text-amber-50 sm:text-[2.25rem]/[1.65]"
    >
      {text}
    </p>
  );
}
