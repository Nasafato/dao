import { create } from "zustand";
import { DaoVerse } from "../types";

interface DaoStore {
  verseBeingTested: null | DaoVerse;
  setVerseBeingTested: (verse: DaoVerse | null) => void;
}
export const useDaoStore = create<DaoStore>((set) => ({
  verseBeingTested: null,
  setVerseBeingTested: (verse: DaoVerse | null) =>
    set({ verseBeingTested: verse }),
}));
