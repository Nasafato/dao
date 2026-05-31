"use client";
import { twJoin } from "tailwind-merge";
import { useDaoStore } from "@/state/store";
import { BackgroundStyle, border } from "@/styles";
import { DefinitionNavigation } from "@/components/DefinitionNavigation";

export function Footer() {
  const isPopoverOpen = useDaoStore((state) => state.isPopoverOpen);

  return (
    <footer id="footer" className={twJoin("fixed bottom-0 w-full z-20")}>
      {isPopoverOpen && (
        <div className="relative">
          <div
            style={{ width: "min(21rem, calc(100vw - 2rem))" }}
            className={twJoin(
              "-top-32 left-1/2 absolute -translate-x-1/2 rounded-full border shadow-lg",
              BackgroundStyle,
              border()
            )}
          >
            <DefinitionNavigation />
          </div>
        </div>
      )}
    </footer>
  );
}
