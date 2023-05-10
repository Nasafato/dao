import { atom, useAtom } from "jotai";

export const mediaAtom = atom<{
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  mediaType: string;
  mediaSource: string | null;
}>({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.5,
  mediaType: "audio",
  mediaSource: null,
});

export function DebugAtom({ atom }: { atom: any }) {
  const [value] = useAtom(atom);
  return <pre>{JSON.stringify(value, null, 2)}</pre>;
}

export const isPlayingAtom = atom(
  (get) => get(mediaAtom).isPlaying,
  (get, set, isPlaying: boolean) =>
    set(mediaAtom, { ...get(mediaAtom), isPlaying })
);
export const currentTimeAtom = atom((get) => get(mediaAtom).currentTime);
export const durationAtom = atom((get) => get(mediaAtom).duration);
export const volumeAtom = atom((get) => get(mediaAtom).volume);
export const mediaTypeAtom = atom((get) => get(mediaAtom).mediaType);
export const mediaSourceAtom = atom(
  (get) => get(mediaAtom).mediaSource,
  (get, set, mediaSource: string) => {
    set(mediaAtom, { ...get(mediaAtom), mediaSource });
  }
);

export const changeMediaSourceAtom = atom(
  null,
  (
    get,
    set,
    {
      mediaSource,
      mediaType = "audio",
      startPlaying = true,
    }: { mediaSource: string; mediaType?: string; startPlaying?: boolean }
  ) => {
    const currentMediaSource = get(mediaSourceAtom);
    if (currentMediaSource === mediaSource) {
      return;
    }
    set(mediaAtom, {
      ...get(mediaAtom),
      mediaSource,
      mediaType,
      currentTime: 0,
      isPlaying: startPlaying,
    });
  }
);
