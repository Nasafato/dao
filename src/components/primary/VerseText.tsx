import { punctuation } from "@/consts";
import { buildCharId } from "@/lib/charNavigation";
import { VerseChar } from "./VerseChar";

export function VerseText({
  verseId,
  text,
}: {
  verseId: number;
  text: string;
}) {
  const chars = text.split("");
  const textNodes = chars.map((char, index) => {
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
          context: "verse",
        })}
      />
    );
  });

  return (
    <p className="text-xl font-normal text-gray-800 dark:text-gray-50">
      {textNodes}
    </p>
  );
}
