import { useQueryClient, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useRef, useEffect } from "react";
import { punctuation } from "../../consts";
import { DescriptionOutput } from "../../server/routers/_app";
import { DictionarySchemaType, DictionaryEntrySchema } from "../../types";
import { usePopover } from "./VersesPopover";
import { VerseChar } from "./VerseChar";

export function VerseDescription({
  verseId,
  data,
}: {
  verseId: number;
  data: DescriptionOutput;
}) {
  const { description, translations } = data;

  const descriptionChars = description.split("");
  const descriptionText = descriptionChars.map((char, index) => {
    if (punctuation.includes(char)) {
      return char;
    }
    return (
      <VerseChar
        key={index}
        char={char}
        charId={`${verseId}-description-${index}`}
      />
    );
  });

  const { legge, goddard, susuki } = translations;

  return (
    <div>
      <div className="text-[0.95rem]/[22px] space-y-4">
        <p className="text-xl">{descriptionText}</p>
        <div>
          <h5 className={TranslationHeaderStyle}>Legge</h5>
          <p>{legge}</p>
        </div>
        <div>
          <h5 className={TranslationHeaderStyle}>Goddard</h5>
          <p>{goddard}</p>
        </div>
        <div>
          <h5 className={TranslationHeaderStyle}>Susuki</h5>
          <p>{susuki}</p>
        </div>
      </div>
    </div>
  );
}

const TranslationHeaderStyle = "text-gray-400 text-xs";
