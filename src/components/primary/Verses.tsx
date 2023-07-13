import { VerseMemoryStatusType } from "@/lib/localDb/verseMemoryStatus";
import { useVerseMemoryStatusesQuery } from "@/lib/reactQuery";
import { DaoVerse } from "@/types";
import { CommandPalette } from "./CommandPalette";
import { Verse } from "./Verse";

interface VerseProps {
  verses: DaoVerse[];
}

export function Verses({ verses }: VerseProps) {
  const verseMemoryStatusesQuery = useVerseMemoryStatusesQuery();
  const statusMap: Record<string, VerseMemoryStatusType> = {};
  for (const status of verseMemoryStatusesQuery.data ?? []) {
    statusMap[status.verseId] = status;
  }

  return (
    <>
      <div className="space-y-5">
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
      <CommandPalette />
    </>
  );
}
