import { create } from "zustand";
import { DaoVerse } from "@/types";
import { AudioFile, Languages, Translators } from "types/materials";

interface DaoStore {
  /* Language. */
  language: "English" | "Chinese";
  setLanguage: (language: "English" | "Chinese") => void;

  verseBeingTested: null | DaoVerse;
  setVerseBeingTested: (verse: DaoVerse | null) => void;
  cachedAudio: Record<string, boolean>;
  setAudioCached: (audioUrl: string, status: boolean) => void;
  readerMode: boolean;
  setReaderMode: (status: boolean) => void;
  isFooterOpen: boolean;
  setFooterOpen: (status: boolean) => void;

  /* Audio. */

  audioFile: AudioFile | null;
  audioStatus: "playing" | "paused";
  setAudioStatus: (status: "playing" | "paused") => void;
  setAudio(file: AudioFile): void;
  playAudio(file: AudioFile): void;
  audioProgress: number;
  audioDuration: number;
  visualProgress: number;
  setAudioProgress: (value: number) => void;
  setVisualProgress: (value: number) => void;
  setAudioDuration: (value: number) => void;
  isDragging: boolean;
  setIsDragging: (status: boolean) => void;

  /* Playlist. */
  isPlaylistOpen: boolean;
  setIsPlaylistOpen: (status: boolean) => void;
  playlistLanguage: "English" | "Chinese";
  setPlaylistLanguage: (language: "English" | "Chinese") => void;

  /* Popover. */
  isPopoverOpen: boolean;
  setIsPopoverOpen: (status: boolean) => void;
}
export const useDaoStore = create<DaoStore>((set) => ({
  language: "Chinese",
  setLanguage: (language: "English" | "Chinese") => set({ language }),

  isPlaylistOpen: false,
  setIsPlaylistOpen: (status: boolean) => set({ isPlaylistOpen: status }),
  playlistLanguage: "Chinese",
  setPlaylistLanguage: (language: "English" | "Chinese") =>
    set({ playlistLanguage: language }),

  isPopoverOpen: false,
  setIsPopoverOpen: (status: boolean) => set({ isPopoverOpen: status }),

  audioFile: null,
  audioDuration: 0.0,
  audioProgress: 0.0,
  visualProgress: 0.0,
  isDragging: false,
  setIsDragging: (status: boolean) => set({ isDragging: status }),
  setAudioDuration: (value: number) => set({ audioDuration: value }),
  setAudioProgress: (value: number) =>
    set({ audioProgress: value, visualProgress: value }),
  setVisualProgress: (value: number) => set({ visualProgress: value }),
  audioUrl: null,
  audioStatus: "paused",
  setAudioStatus: (status: "playing" | "paused") =>
    set({ audioStatus: status }),
  setAudio: (metadata) => {
    set({ audioFile: metadata });
  },
  playAudio: (file: AudioFile) =>
    set({
      audioFile: file,
      audioStatus: "playing",
      audioProgress: 0.0,
    }),
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
  isFooterOpen: false,
  setFooterOpen: (status: boolean) => set({ isFooterOpen: status }),
}));
