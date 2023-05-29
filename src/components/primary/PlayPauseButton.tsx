import { PauseIcon, PlayIcon } from "@heroicons/react/20/solid";
import { useAtom } from "jotai";
import {
  changeMediaSourceAtom,
  mediaSourceAtom,
  isPlayingAtom,
} from "../../state/mediaAtoms";
import clsx from "clsx";

export function PlayPauseButton({
  verseMediaSource,
  className,
}: {
  verseMediaSource: string;
  className?: string;
}) {
  const [, changeMediaSource] = useAtom(changeMediaSourceAtom);
  const [mediaSource, setMediaSource] = useAtom(mediaSourceAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);

  return (
    <button
      className={clsx(
        "h-4 w-4 ring-1 ring-gray-200 rounded-full flex justify-center items-center text-gray-400 hover:bg-gray-300",
        className
      )}
      onClick={() => {
        if (mediaSource !== verseMediaSource) {
          changeMediaSource({
            mediaSource: verseMediaSource,
            mediaType: "audio",
          });
        } else {
          setIsPlaying(!isPlaying);
        }
      }}
    >
      {isPlaying && mediaSource === verseMediaSource ? (
        <PauseIcon className="h-2 w-2" />
      ) : (
        <PlayIcon className="h-2 w-2" />
      )}
    </button>
  );
}
