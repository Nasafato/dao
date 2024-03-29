import { useMutation } from "@tanstack/react-query";
import { INDEXED_DB_NAME, INDEXED_DB_VERSION, USER_ID } from "@/lib/localDb/db";
import {
  VerseMemoryStatus,
  VerseMemoryStatusType,
} from "@/lib/localDb/verseMemoryStatus";
import { MEMORY_STATUS } from "@/lib/localDb/verseMemoryStatus/schema";
import { queryClient } from "@/lib/reactQuery";
import { DaoVerse } from "@/types";
import { AuxVerseStatus } from "./AuxVerseStatus";

interface AuxVerseHeaderLearningProps {
  verse: DaoVerse;
  verseStatus: VerseMemoryStatusType | null;
}

export function AuxVerseHeaderLearning({
  verse,
  verseStatus,
}: AuxVerseHeaderLearningProps) {
  const updateStatusMutation = useMutation({
    mutationFn: async (args: { status: keyof typeof MEMORY_STATUS }) => {
      const { status } = args;
      const memoryStatus = await VerseMemoryStatus.update({
        userId_verseId: [USER_ID, verse.id],
        data: { status },
      });
      return memoryStatus;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["indexedDb", INDEXED_DB_NAME]);
      queryClient.invalidateQueries([
        "indexedDb",
        INDEXED_DB_NAME,
        INDEXED_DB_VERSION,
        VerseMemoryStatus.tableName,
        verse.id,
      ]);
    },
  });

  return (
    <div className="flex items-center gap-x-2">
      <AuxVerseStatus
        verse={verse}
        verseStatus={verseStatus}
        updateStatusMutation={updateStatusMutation}
      />
    </div>
  );
}
