import { punctuation } from "../../consts";
import { capitalize } from "../../utils";
import { VerseChar } from "./VerseChar";

export function VerseDescription({
  verseId,
  data,
}: {
  verseId: number;
  data: { description: string; translations: Record<string, string> };
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

  return (
    <div>
      <div className="text-[0.95rem]/[22px] space-y-4">
        <p className="text-lg">{descriptionText}</p>
        {Object.entries(translations).map(([translator, text]) => {
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
    </div>
  );
}

const TranslationHeaderStyle = "text-gray-400 text-xs";
