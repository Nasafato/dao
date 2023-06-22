"use client";
import { twJoin } from "tailwind-merge";
import { BackgroundStyle, BorderStyle, LayoutPaddingStyle } from "../../styles";
import { useDaoStore } from "../../state/store";
import { DefinitionNavigation } from "./Definition";
import { useRenderNextOrPrevChar } from "../../lib/charNavigation";
import { ProgressBar } from "./AudioPlayer/ProgressBar";
import { Audio } from "./AudioPlayer/Audio";
import { Time, TimeRemaining } from "./AudioPlayer/Time";

const TimeStyle = twJoin("text-xs text-gray-500 font-mono");

export function Footer() {
  const isFooterOpen = useDaoStore(
    (state) => state.isPopoverOpen || state.audioStatus === "playing"
  );
  // if (!isFooterOpen) return null;

  const audioProgress = useDaoStore((state) => state.audioProgress);
  const visualProgress = useDaoStore((state) => state.visualProgress);
  return (
    <footer
      id="footer"
      className={twJoin(
        "fixed bottom-0 w-full border-t z-20 flex justify-center",
        BackgroundStyle,
        BorderStyle,
        LayoutPaddingStyle
      )}
    >
      <div>
        <div className="flex items-center justify-center py-3">
          <Audio />
          <div>
            <div className="flex items-center gap-x-2">
              <Time isBeginning>
                {(time) => {
                  if (Number.isNaN(time)) time = 0;
                  const minutes = Math.floor(time / 60);
                  const seconds = Math.floor(time % 60);
                  const str = `${minutes}:${seconds
                    .toString()
                    .padStart(2, "0")}`;

                  return <span className={TimeStyle}>{str}</span>;
                }}
              </Time>
              <ProgressBar />
              <Time>
                {(time) => {
                  if (Number.isNaN(time)) time = 0;
                  const minutes = Math.floor(time / 60);
                  const seconds = Math.floor(time % 60);
                  const str = `${minutes}:${seconds
                    .toString()
                    .padStart(2, "0")}`;
                  return <span className={TimeStyle}>{str}</span>;
                }}
              </Time>
            </div>
          </div>
          {/* <div>
            <div className="text-blue-500">Audio: {audioProgress}</div>
            <div className="text-red-500">Visual: {visualProgress}</div>
          </div> */}
        </div>
        <DefinitionNavigation />
      </div>
    </footer>
  );
}
