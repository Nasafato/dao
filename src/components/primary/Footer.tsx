"use client";
import { twJoin } from "tailwind-merge";
import { BackgroundStyle, BorderStyle, LayoutPaddingStyle } from "../../styles";
import { useDaoStore } from "../../state/store";
import { DefinitionNavigation } from "./Definition";
import { useRenderNextOrPrevChar } from "../../lib/charNavigation";

export function Footer() {
  const isFooterOpen = useDaoStore((state) => state.isFooterOpen);
  if (!isFooterOpen) return null;

  return (
    <footer
      id="footer"
      className={twJoin(
        "fixed bottom-0 h-12 w-full border-t z-20 flex justify-center",
        BackgroundStyle,
        BorderStyle,
        LayoutPaddingStyle
      )}
    >
      <DefinitionNavigation />
    </footer>
  );
}
