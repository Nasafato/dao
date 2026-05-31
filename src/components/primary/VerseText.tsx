export function VerseText({
  verseId,
  text,
}: {
  verseId: number;
  text: string;
}) {
  return (
    <p
      data-reader-verse-id={verseId}
      className="select-text text-[2rem]/[1.7] font-normal tracking-normal text-gray-900 selection:bg-amber-200 selection:text-gray-950 dark:text-gray-50 dark:selection:bg-amber-300/30 dark:selection:text-amber-50 sm:text-[2.25rem]/[1.65]"
    >
      {text}
    </p>
  );
}
