import { create } from "zustand";
import { DaoVerse } from "../types";
import { getQueryKey } from "@trpc/react-query";
import { queryClient } from "../utils/reactQuery";
import { api } from "../utils/trpc";
import { VerseToUser } from "@prisma/client";

interface DaoStore {
  verseBeingTested: null | DaoVerse;
  setVerseBeingTested: (verse: DaoVerse | null) => void;
}
export const useDaoStore = create<DaoStore>((set) => ({
  verseBeingTested: null,
  setVerseBeingTested: (verse: DaoVerse | null) => {
    if (verse) {
      const statuses =
        queryClient.getQueryData<VerseToUser[]>(
          getQueryKey(api.verseStatus.findMany, undefined, "query")
        ) ?? [];
      let status;
      for (const verseStatus of statuses) {
        if (verseStatus.verseId === verse.id) {
          status = verseStatus;
          queryClient.setQueryData(
            getQueryKey(
              api.verseStatus.findOne,
              { verseId: verse.id },
              "query"
            ),
            status
          );
          break;
        }
      }
    }
    return set({ verseBeingTested: verse });
  },
}));
