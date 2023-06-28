import { twJoin } from "tailwind-merge";
import { punctuation } from "../../consts";
import { buildCharId } from "../../lib/charNavigation";
import ReactMarkdown from "react-markdown";
import { HeadingStyle } from "../../styles";
import { capitalize } from "../../utils";
import { VerseChar } from "./VerseChar";
import { VerseCombined } from "../../../types/materials";

const TRANSLATORS = ["gou", "legge", "goddard", "susuki"] as const;

export function VerseDescription({
  verseId,
  data,
}: {
  verseId: number;
  data: VerseCombined;
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
        charId={buildCharId({
          verseId,
          charIndex: index,
          context: "description",
        })}
      />
    );
  });

  return (
    <div className="text-[0.95rem]/[22px] space-y-4 mt-4">
      <section>
        <div className={twJoin(HeadingStyle())}>简介</div>
        <p className="text-lg">{descriptionText}</p>
      </section>
      {data.explanation && (
        <section>
          <h3 className={twJoin(HeadingStyle(), "mb-2")}>Explanation</h3>
          <ReactMarkdown>{data.explanation}</ReactMarkdown>
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
