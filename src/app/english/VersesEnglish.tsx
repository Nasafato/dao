"use client";

import { useState } from "react";
import { Container } from "../../components/shared/PageLayout";
import { DAO_COMBINED } from "../../lib/daoText";
import { VerseStyle, HeadingStyle, button } from "../../styles";
import { RadioGroup } from "@headlessui/react";
import { tv } from "tailwind-variants";

const TranslationOptions = [
  { value: "gou", label: "Gou" },
  { value: "goddard", label: "Goddard" },
  { value: "legge", label: "Legge" },
  { value: "susuki", label: "Susuki" },
];

export function VersesEnglish() {
  const [translation, setTranslation] = useState("gou");
  return (
    <div>
      <section>
        <RadioGroup value={translation} onChange={setTranslation}>
          <RadioGroup.Label>Translation</RadioGroup.Label>
          <div className="flex items-center gap-x-2">
            {TranslationOptions.map((option) => (
              <RadioGroup.Option
                key={option.value}
                value={option.value}
                as="button"
                className={`${button()}`}
              >
                {({ checked }) => (
                  <span className={checked ? "underline" : ""}>
                    {option.label}
                  </span>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </section>
      <section className="space-y-5">
        {DAO_COMBINED.map((verse, index) => {
          const verseId = index + 1;
          return (
            <div
              key={verseId}
              className={VerseStyle({
                size: "large",
              })}
            >
              <a
                className={HeadingStyle()}
                href={`#dao${verseId}`}
                id={`dao${verseId}`}
              >
                <h2>Verse {verseId}</h2>
              </a>
              {verse.translations.gou ?? verse.translations.goddard}
            </div>
          );
        })}
      </section>
    </div>
  );
}
