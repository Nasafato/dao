import { VerseToUser } from "@prisma/client";
import { DaoVerse } from "../../types";
import { api } from "../../utils/trpc";
import { AuxVerseLearningMenu } from "./AuxVerseLearningMenu";
import { AuxVerseStatus as AuxVerseStatus } from "./AuxVerseStatus";
import {
  MEMORY_STATUS,
  VerseMemoryStatus,
  VerseMemoryStatusType,
} from "../../lib/localSchema";
import { useMutation } from "@tanstack/react-query";
import {
  INDEXED_DB_NAME,
  INDEXED_DB_VERSION,
  USER_ID,
  setVerseMemoryStatus,
  updateStatus,
} from "../../lib/localDb";
import { queryClient } from "../../lib/reactQuery";

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
      const memoryStatus = await updateStatus(USER_ID, verse.id, status);
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
      <AuxVerseLearningMenu
        verse={verse}
        verseStatus={verseStatus}
        updateStatusMutation={updateStatusMutation}
      />
    </div>
  );
}
