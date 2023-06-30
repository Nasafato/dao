import { PauseIcon, PlayIcon } from "@heroicons/react/20/solid";
import * as Tooltip from "@radix-ui/react-tooltip";
import { twJoin } from "tailwind-merge";
import { AudioFile } from "../../../../types/materials";
import { useDaoStore } from "../../../state/store";
import { TooltipStyle, button } from "../../../styles";
import { checkForAudio } from "../DownloadAudioButton";

export function PlayPauseButton({
  className,
  audioFile,
}: {
  className?: string;
  audioFile: AudioFile;
}) {
  const audioUrl = useDaoStore((state) => state.audioFile?.url);
  const status = useDaoStore((state) => state.audioStatus);
  const setAudioStatus = useDaoStore((state) => state.setAudioStatus);
  const playAudio = useDaoStore((state) => state.playAudio);

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button
          className={button({
            color: "secondary",
            size: "sm",
            ring: true,
            rounded: "full",
            class: `${className}`,
          })}
          // className={clsx(
          //   "h-4 w-4 ring-1 ring-gray-200 rounded-full flex justify-center items-center text-gray-400 hover:bg-gray-200",
          //   className
          // )}
          onClick={() => {
            if (audioUrl === audioFile.url) {
              if (status === "playing") {
                setAudioStatus("paused");
              } else {
                setAudioStatus("playing");
              }
            } else {
              playAudio(audioFile);
              checkForAudio(audioFile.url);
            }
          }}
        >
          {status === "playing" && audioUrl === audioFile.url ? (
            <PauseIcon className="h-2 w-2" />
          ) : (
            <PlayIcon className="h-2 w-2" />
          )}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          sideOffset={3}
          side={audioFile.verseId === 1 ? "bottom" : "top"}
          className={twJoin(TooltipStyle().content())}
        >
          Play recording
          <Tooltip.Arrow className={TooltipStyle().arrow()} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
