"use client";
import { twJoin } from "tailwind-merge";
import { useDaoStore } from "@/state/store";
import {
  BackgroundStyle,
  FooterHeight,
  MainLayoutHorizontalPaddingStyle,
  border,
} from "@/styles";
import { DefinitionNavigation } from "@/components/DefinitionNavigation";

import { Playlist, PlaylistButton } from "@/components/Playlist";
import { Container } from "@/components/shared/PageLayout";
import { Audio } from "./AudioPlayer/Audio";
import { AudioController } from "./AudioPlayer/AudioController";
import { AudioTimeController } from "./AudioPlayer/AudioTimeController";
import { AudioTitle } from "./AudioPlayer/AudioTitle";

export function Footer() {
  const isPopoverOpen = useDaoStore((state) => state.isPopoverOpen);

  return (
    <>
      <Audio />
      <footer id="footer" className={twJoin("fixed bottom-0 w-full z-20")}>
        {isPopoverOpen && (
          <div className="relative">
            <div
              className={twJoin(
                "-top-12 left-1/2 absolute w-60 -translate-x-1/2 rounded-full border shadow-lg",
                BackgroundStyle,
                border()
              )}
            >
              <DefinitionNavigation />
            </div>
          </div>
        )}

        <div
          className={twJoin(
            "border-t",
            FooterHeight,
            MainLayoutHorizontalPaddingStyle,
            BackgroundStyle,
            border()
          )}
        >
          <Container className="flex py-2 items-center h-full">
            <AudioTitle className="flex-initial" />
            <div className="flex-1 space-y-1">
              <AudioController />
              <AudioTimeController />
            </div>
            <div className="relative">
              <PlaylistButton />
              <Playlist />
            </div>
          </Container>
        </div>
      </footer>
    </>
  );
}
