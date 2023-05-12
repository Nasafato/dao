import { PauseIcon, PlayIcon } from "@heroicons/react/20/solid";
import { useAtom } from "jotai";
import {
  changeMediaSourceAtom,
  mediaSourceAtom,
  isPlayingAtom,
} from "../state/mediaAtoms";
import { DownloadAudioButton } from "./DownloadAudioButton";
import { VerseStatus } from "./VerseStatus";
import { VerseLearningMenu } from "./VerseLearningMenu";
import { api } from "../utils/trpc";

export function VerseHeader({
  verseId,
  verseMediaSource,
  verseStatus,
}: {
  verseId: number;
  verseMediaSource: string;
  verseStatus: string | null;
}) {
  const utils = api.useContext();

  const updateStatusMutation = api.verseStatus.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.verseStatus.findMany.invalidate();
    },
  });
  return (
    <div className="flex items-center py-1 justify-between">
      <div className="flex items-center gap-x-2">
        <a
          id={`dao${verseId}`}
          href={`#dao${verseId}`}
          className="text-gray-400 dark:text-gray-200 text-base whitespace-nowrap"
        >
          第{verseId}章
        </a>
        <PlayPauseButton verseMediaSource={verseMediaSource} />
        <DownloadAudioButton audioUrl={verseMediaSource} />
      </div>
      <div className="flex items-center gap-x-2">
        <VerseStatus
          verseStatus={verseStatus}
          verseId={verseId}
          updateStatusMutation={updateStatusMutation}
        />
        <VerseLearningMenu
          verseId={verseId}
          verseStatus={verseStatus}
          updateStatusMutation={updateStatusMutation}
        />
      </div>
    </div>
  );
}

function PlayPauseButton({ verseMediaSource }: { verseMediaSource: string }) {
  const [, changeMediaSource] = useAtom(changeMediaSourceAtom);
  const [mediaSource, setMediaSource] = useAtom(mediaSourceAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);

  return (
    <button
      className="h-5 w-5 bg-gray-200 rounded-full flex justify-center items-center text-gray-500 hover:bg-gray-300"
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
        <PauseIcon className="h-3 w-3 " />
      ) : (
        <PlayIcon className="h-3 w-3" />
      )}
    </button>
  );
}
