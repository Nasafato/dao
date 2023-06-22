"use client";
import { twJoin } from "tailwind-merge";
import { useDaoStore } from "../../state/store";
import { BackgroundStyle, BorderStyle, LayoutPaddingStyle } from "../../styles";
import { DefinitionNavigation } from "../DefinitionNavigation";
import { AudioPlayer } from "./AudioPlayer";

export function Footer() {
  // const isFooterOpen = useDaoStore(
  //   (state) => state.isPopoverOpen || state.audioStatus === "playing"
  // );
  const isPopoverOpen = useDaoStore((state) => state.isPopoverOpen);

  return (
    <footer
      id="footer"
      className={twJoin(
        "fixed bottom-0 w-full border-t z-20",
        BackgroundStyle,
        BorderStyle,
        LayoutPaddingStyle
      )}
    >
      <AudioPlayer />
      {isPopoverOpen && <DefinitionNavigation />}
    </footer>
  );
}
