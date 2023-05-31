import { create } from "zustand";
import { DaoVerse } from "../types";
import { getQueryKey } from "@trpc/react-query";
import { queryClient } from "../lib/reactQuery";
import { api } from "../utils/trpc";

interface DaoStore {
  verseBeingTested: null | DaoVerse;
  setVerseBeingTested: (verse: DaoVerse | null) => void;
  cachedAudio: Record<string, boolean>;
  setAudioCached: (audioUrl: string, status: boolean) => void;
  readerMode: boolean;
  setReaderMode: (status: boolean) => void;
}
export const useDaoStore = create<DaoStore>((set) => ({
  verseBeingTested: null,
  setVerseBeingTested: (verse: DaoVerse | null) => {
    // if (verse) {
    //   const statuses =
    //     queryClient.getQueryData<VerseToUser[]>(
    //       getQueryKey(api.verseStatus.findMany, undefined, "query")
    //     ) ?? [];
    //   let status;
    //   for (const verseStatus of statuses) {
    //     if (verseStatus.verseId === verse.id) {
    //       status = verseStatus;
    //       queryClient.setQueryData(
    //         getQueryKey(
    //           api.verseStatus.findOne,
    //           { verseId: verse.id },
    //           "query"
    //         ),
    //         status
    //       );
    //       break;
    //     }
    //   }
    // }
    return set({ verseBeingTested: verse });
  },
  cachedAudio: {},
  setAudioCached: (audioUrl: string, status: boolean) => {
    return set((state) => {
      const newState = {
        cachedAudio: {
          ...state.cachedAudio,
          [audioUrl]: status,
        },
      };

      return newState;
    });
  },
  readerMode: false,
  setReaderMode: (status: boolean) => set({ readerMode: status }),
}));
