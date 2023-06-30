import { twJoin } from "tailwind-merge";
import { background } from "../styles";
import { buildAudioFile } from "../utils";
import { PlayPauseButton } from "./primary/AudioPlayer/PlayPauseButton";
import { DownloadAudioButton } from "./primary/DownloadAudioButton";
import { AudioFile } from "../../types/materials";
import { availableAudioFiles } from "../lib/materials";

const verses: Array<{ id: number; title: string }> = [];
for (let i = 0; i < 81; i++) {
  verses.push({
    id: i + 1,
    title: `第${i + 1}章`,
  });
}

export function PlaylistEnglish({
  currentlyPlayingAudioFile,
}: {
  currentlyPlayingAudioFile: AudioFile | null;
}) {
  const files = verses
    .map((v) =>
      buildAudioFile({
        verseId: v.id,
        translator: "gou",
        speaker: "generated",
        language: "english",
      })
    )
    .filter((f) => {
      return availableAudioFiles.includes(`${f.audioName}.mp3`);
    });

  return (
    <div className="">
      <ul>
        {files.map((f) => {
          currentlyPlayingAudioFile?.verseId === f.verseId;
          return (
            <li
              key={f.audioName}
              className={twJoin(
                currentlyPlayingAudioFile?.url === f.url && "inverse"
              )}
            >
              <div
                className={twJoin(
                  "py-2 px-3 flex items-center gap-x-2",
                  background()
                )}
              >
                <DownloadAudioButton audioFile={f} />
                <PlayPauseButton audioFile={f} />
                <h5>{f.title}</h5>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
