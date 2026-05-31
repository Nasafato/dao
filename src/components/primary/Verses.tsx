import { VerseMemoryStatusType } from "@/lib/localDb/verseMemoryStatus";
import { useVerseMemoryStatusesQuery } from "@/lib/reactQuery";
import { DaoVerse } from "@/types";
import { useRef } from "react";
import { CommandPalette } from "./CommandPalette";
import { TextSelectionToolbar } from "./TextSelectionToolbar";
import { Verse } from "./Verse";

interface VerseProps {
  verses: DaoVerse[];
}

export function Verses({ verses }: VerseProps) {
  const verseMemoryStatusesQuery = useVerseMemoryStatusesQuery();
  const readerRef = useRef<HTMLDivElement>(null);
  const statusMap: Record<string, VerseMemoryStatusType> = {};
  for (const status of verseMemoryStatusesQuery.data ?? []) {
    statusMap[status.verseId] = status;
  }

  return (
    <>
      <div ref={readerRef} className="space-y-5">
        {verses.map((verse) => {
          return (
            <Verse
              key={verse.id}
              verse={verse}
              verseStatus={statusMap[verse.id]}
            />
          );
        })}
      </div>
      <TextSelectionToolbar rootRef={readerRef} />
      <CommandPalette />
    </>
  );
}
