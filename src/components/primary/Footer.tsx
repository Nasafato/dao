"use client";
import { twJoin } from "tailwind-merge";
import { useDaoStore } from "../../state/store";
import {
  BackgroundStyle,
  BorderStyle,
  FooterHeight,
  LayoutPaddingStyle,
  MainLayoutHorizontalPaddingStyle,
  SoftBorderStyle,
} from "../../styles";
import { DefinitionNavigation } from "../DefinitionNavigation";

import styles from "./Footer.module.css";
import { Audio } from "./AudioPlayer/Audio";
import { AudioController } from "./AudioPlayer/AudioController";
import { AudioTimeController } from "./AudioPlayer/AudioTimeController";
import { AudioTitle } from "./AudioPlayer/AudioTitle";
import { Container } from "../shared/PageLayout";
import { PlaylistButton } from "../Playlist";

export function Footer() {
  // const isFooterOpen = useDaoStore(
  //   (state) => state.isPopoverOpen || state.audioStatus === "playing"
  // );
  const isPopoverOpen = useDaoStore((state) => state.isPopoverOpen);

  return (
    <>
      <Audio />
      <footer
        id="footer"
        className={twJoin(
          "fixed bottom-0 w-full z-20"
          // BackgroundStyle
          // BorderStyle,
          // LayoutPaddingStyle,
          // styles.footer
        )}
      >
        {isPopoverOpen && (
          <div className="relative">
            <div
              className={twJoin(
                "-top-9 right-2 absolute rounded-full w-60 border",
                BackgroundStyle,
                SoftBorderStyle
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
            BorderStyle
          )}
        >
          <Container className="flex py-2">
            <AudioTitle className="flex-initial" />
            <div className="flex-1">
              <AudioController />
              <AudioTimeController />
            </div>
            <PlaylistButton />
          </Container>
        </div>
      </footer>
    </>
  );
}
