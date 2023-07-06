import { twJoin } from "tailwind-merge";
import { background } from "@/styles";
import { buildAudioFile } from "@/utils";
import { PlayPauseButton } from "./primary/AudioPlayer/PlayPauseButton";
import { DownloadAudioButton } from "./primary/DownloadAudioButton";
import { AudioFile } from "types/materials";

const verses: Array<{ id: number; title: string }> = [];
for (let i = 0; i < 81; i++) {
  verses.push({
    id: i + 1,
    title: `第${i + 1}章`,
  });
}

export function PlaylistChinese({
  currentlyPlayingAudioFile,
}: {
  currentlyPlayingAudioFile: AudioFile | null;
}) {
  return (
    <div className="">
      <ul>
        {verses.map((v) => {
          const audioFile = buildAudioFile({
            verseId: v.id,
            speaker: "human",
            language: "chinese",
          });
          currentlyPlayingAudioFile?.verseId === v.id;
          return (
            <li
              key={v.id}
              className={twJoin(
                currentlyPlayingAudioFile?.url === audioFile.url && "inverse"
              )}
            >
              <div
                className={twJoin(
                  "py-2 px-3 flex items-center gap-x-2",
                  background()
                )}
              >
                <DownloadAudioButton audioFile={audioFile} />
                <PlayPauseButton audioFile={audioFile} />
                <h5>{v.title}</h5>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
