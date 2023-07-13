import { VerseMemoryStatusType } from "@/lib/localDb/verseMemoryStatus";
import { useDaoStore } from "@/state/store";
import { DaoVerse } from "@/types";
import { AuxVerseHeaderLearning } from "@/components/auxiliary/AuxVerseHeaderLearning";

export const VerseHeaderStyle =
  "text-gray-400 dark:text-gray-200 text-base whitespace-nowrap";

export function VerseHeader({
  verse,
  verseStatus,
  hasAnchor = false,
}: {
  verse: DaoVerse;
  verseStatus: VerseMemoryStatusType | null;
  hasAnchor?: boolean;
}) {
  const verseId = verse.id;
  const readerMode = useDaoStore((state) => state.readerMode);

  return (
    <div className="flex items-center py-1 justify-between">
      <div className="flex items-center gap-x-2">
        <div>
          {hasAnchor ? (
            <a
              id={`dao${verseId}`}
              href={`#dao${verseId}`}
              className={VerseHeaderStyle}
            >
              第{verseId}章
            </a>
          ) : (
            <h4>第{verseId}章</h4>
          )}
        </div>
      </div>
      {!readerMode && (
        <AuxVerseHeaderLearning verse={verse} verseStatus={verseStatus} />
      )}
    </div>
  );
}
