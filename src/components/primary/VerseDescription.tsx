"use client";

import { registerReaderVerseText } from "@/lib/charNavigation";
import { HeadingStyle } from "@/styles";
import { capitalize } from "@/utils";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { twJoin } from "tailwind-merge";
import { VerseCombined } from "types/materials";

const TRANSLATORS = ["gou", "legge", "goddard", "susuki"] as const;

export function VerseDescription({
  verseId,
  data,
}: {
  verseId: number;
  data: VerseCombined;
}) {
  const { description, translations } = data;

  return (
    <div className="text-[0.95rem]/[22px] space-y-4 mt-4">
      <section>
        <div className={twJoin(HeadingStyle())}>简介</div>
        <ReaderDescriptionText text={description} verseId={verseId} />
      </section>
      {data.explanation && (
        <section>
          <h3 className={twJoin(HeadingStyle(), "mb-2")}>Explanation</h3>
          <div className="[&_p]:mb-2">
            <ReactMarkdown>{data.explanation}</ReactMarkdown>
          </div>
        </section>
      )}
      <section>
        <h3 className={twJoin(HeadingStyle(), "mb-2")}>Translations</h3>
        <div className={"space-y-4"}>
          {Object.entries(translations)
            .filter((f) =>
              TRANSLATORS.includes(f[0] as (typeof TRANSLATORS)[number])
            )
            .map(([translator, text]) => {
              return (
                <div key={translator}>
                  <h5 className={TranslationHeaderStyle}>
                    {capitalize(translator)}
                  </h5>
                  <p>{text}</p>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}

const TranslationHeaderStyle = "text-gray-400 text-xs";

function ReaderDescriptionText({
  text,
  verseId,
}: {
  text: string;
  verseId: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return registerReaderVerseText(verseId, ref.current, "description");
  }, [text, verseId]);

  return (
    <p
      ref={ref}
      data-reader-text=""
      data-reader-text-context="description"
      data-reader-verse-id={verseId}
      className="select-text text-lg selection:bg-amber-200 selection:text-gray-950 dark:selection:bg-amber-300/30 dark:selection:text-amber-50"
    >
      {text}
    </p>
  );
}
