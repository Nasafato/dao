import { PauseIcon, PlayIcon } from "@heroicons/react/20/solid";
import { VerseToUser } from "@prisma/client";
import { useAtom } from "jotai";
import {
  changeMediaSourceAtom,
  isPlayingAtom,
  mediaSourceAtom,
} from "../../state/mediaAtoms";
import { DaoVerse } from "../../types";
import { DownloadAudioButton } from "./DownloadAudioButton";
import { AuxVerseHeaderLearning } from "../auxiliary/AuxVerseHeaderLearning";
import { VerseMemoryStatusType } from "../../lib/localDb/verseMemoryStatus";
import { CDN_URL } from "../../consts";

const HeaderStyle =
  "text-gray-400 dark:text-gray-200 text-base whitespace-nowrap";

export function VerseHeader({
  verse,
  verseStatus,
  hasAnchor = false,
}: {
  verse: DaoVerse;
  verseStatus: VerseMemoryStatusType | null;
  hasAnchor?: boolean;
}) {
  const verseId = verse.id;
  const verseMediaSource = buildVerseMediaSourceUrl(verseId);

  return (
    <div className="flex items-center py-1 justify-between">
      <div className="flex items-center gap-x-2">
        <div>
          {hasAnchor ? (
            <a
              id={`dao${verseId}`}
              href={`#dao${verseId}`}
              className={HeaderStyle}
            >
              第{verseId}章
            </a>
          ) : (
            <h4 className={HeaderStyle}>第{verseId}章</h4>
          )}
        </div>
        <PlayPauseButton verseMediaSource={verseMediaSource} />
        <DownloadAudioButton audioUrl={verseMediaSource} />
      </div>
      <AuxVerseHeaderLearning verse={verse} verseStatus={verseStatus} />
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

function buildVerseMediaSourceUrl(
  verseId: number,
  options: { type: "human" | "generated" } = { type: "human" }
) {
  const type = options.type === "human" ? "human" : "generated";
  return `${CDN_URL}/${type}${verseId < 10 ? "0" + verseId : verseId}.mp3`;
}
