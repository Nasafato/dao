import { PauseIcon, PlayIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useDaoStore } from "../../../state/store";
import { buildVerseMediaSourceUrl } from "../../../utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { TooltipStyle, button } from "../../../styles";
import { checkForAudio } from "../DownloadAudioButton";
import { twJoin } from "tailwind-merge";

export function PlayPauseButton({
  verseId,
  className,
}: {
  verseId: number;
  className?: string;
}) {
  const audioUrl = useDaoStore((state) => state.audioUrl);
  const status = useDaoStore((state) => state.audioStatus);
  const setAudioStatus = useDaoStore((state) => state.setAudioStatus);
  const playAudioUrl = useDaoStore((state) => state.playAudioUrl);
  const verseMediaSource = buildVerseMediaSourceUrl(verseId);

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
            if (audioUrl === verseMediaSource) {
              if (status === "playing") {
                setAudioStatus("paused");
              } else {
                setAudioStatus("playing");
              }
            } else {
              playAudioUrl(verseMediaSource, verseId);
              checkForAudio(verseMediaSource);
            }
          }}
        >
          {status === "playing" && audioUrl === verseMediaSource ? (
            <PauseIcon className="h-2 w-2" />
          ) : (
            <PlayIcon className="h-2 w-2" />
          )}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          sideOffset={3}
          side={verseId === 1 ? "bottom" : "top"}
          className={twJoin(TooltipStyle().content())}
        >
          Play recording
          <Tooltip.Arrow className={TooltipStyle().arrow()} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
