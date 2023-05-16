import { VerseToUser } from "@prisma/client";
import { DaoVerse } from "../../types";
import { api } from "../../utils/trpc";
import { AuxVerseLearningMenu } from "./AuxVerseLearningMenu";
import { AuxVerseStatus as AuxVerseStatus } from "./AuxVerseStatus";

interface AuxVerseHeaderLearningProps {
  verse: DaoVerse;
  verseStatus: VerseToUser;
}

export function AuxVerseHeaderLearning({
  verse,
  verseStatus,
}: AuxVerseHeaderLearningProps) {
  const utils = api.useContext();
  const updateStatusMutation = api.verseStatus.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.verseStatus.findMany.invalidate();
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
