import { PauseIcon, PlayIcon } from "@heroicons/react/20/solid";
import { useAtom } from "jotai";
import {
  changeMediaSourceAtom,
  mediaSourceAtom,
  isPlayingAtom,
} from "../state/mediaAtoms";
import { DownloadAudioButton } from "./DownloadAudioButton";
import { useSession } from "next-auth/react";
import { queryClient } from "../setup";

export function VerseHeader({
  verseId,
  verseMediaSource,
  verseStatus,
}: {
  verseId: number;
  verseMediaSource: string;
  verseStatus: string | null;
}) {
  const onLearnClick = () => {
    console.log("learning verse", verseId);
    fetch("/api/verse", {
      method: "POST",
      body: JSON.stringify({
        status: "learning",
        verseId,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Failed to mark verse as 'learning'");
      })
      .then((json) => {
        console.log("json", json);
        queryClient.invalidateQueries(["verseStatuses"]);
      });
  };

  const onUnlearnClick = () => {
    console.log("unlearning verse", verseId);
    fetch("/api/verse", {
      method: "POST",
      body: JSON.stringify({
        status: "not-learning",
        verseId,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Failed to mark verse as 'learning'");
      })
      .then((json) => {
        console.log("json", json);
        queryClient.invalidateQueries(["verseStatuses"]);
      });
  };

  const session = useSession();
  const renderVerseStatus = () => {
    if (!(session?.status === "authenticated")) return null;
    if (!verseStatus || verseStatus === "not-learning")
      return (
        <button type="button" onClick={onLearnClick} className="text-sm">
          Learn
        </button>
      );

    if (verseStatus === "learning") {
      return (
        <div className="group text-sm">
          <div className="group-hover:hidden">Learning</div>
          <button className="hidden group-hover:block" onClick={onUnlearnClick}>
            Unlearn
          </button>
        </div>
      );
    }

    if (verseStatus === "reviewing") {
      return <button className="text-sm">Unreview</button>;
    }

    return <div className="text-sm">Unrecognized state</div>;
  };
  return (
    <div className="flex items-center py-1 gap-x-2">
      <a
        id={`dao${verseId}`}
        href={`#dao${verseId}`}
        className="text-gray-400 dark:text-gray-200 text-base whitespace-nowrap"
      >
        第{verseId}章
      </a>
      <PlayPauseButton verseMediaSource={verseMediaSource} />
      <DownloadAudioButton audioUrl={verseMediaSource} />
      {renderVerseStatus()}
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
