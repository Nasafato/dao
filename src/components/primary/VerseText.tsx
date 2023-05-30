import { punctuation } from "../../consts";
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
    return <VerseChar key={index} char={char} charId={`${verseId}-${index}`} />;
  });

  return <p className="text-xl font-normal text-gray-800">{textNodes}</p>;
}