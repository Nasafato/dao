"use client";
import { twJoin } from "tailwind-merge";
import { useDaoStore } from "@/state/store";
import { DefinitionNavigation } from "@/components/DefinitionNavigation";

export function Footer() {
  const isPopoverOpen = useDaoStore((state) => state.isPopoverOpen);

  return (
    <footer
      id="footer"
      className={twJoin(
        "pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center px-4 pb-[env(safe-area-inset-bottom)]"
      )}
    >
      {isPopoverOpen && (
        <div
          style={{ width: "min(21rem, calc(100vw - 2rem))" }}
          className={twJoin(
            "reader-liquid-glass pointer-events-auto rounded-full text-gray-900 dark:text-gray-50"
          )}
        >
          <DefinitionNavigation />
        </div>
      )}
    </footer>
  );
}
