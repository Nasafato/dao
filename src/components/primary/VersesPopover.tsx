"use client";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  size,
  useFloating,
  type VirtualElement,
} from "@floating-ui/react";
import { useEffect } from "react";
import { CharMetaSchema, useCharNavigation } from "@/lib/charNavigation";
import { consumeReaderCharacterLookupPointer } from "@/lib/readerCharacterTap";
import { usePopoverApi, usePopoverData } from "./PopoverProvider";

export function Popover() {
  const popover = usePopoverData();
  const { closePopover } = usePopoverApi();
  const { extendPrevChar, extendNextChar, renderPrevChar, renderNextChar } =
    useCharNavigation();
  const { refs, floatingStyles } = useFloating<VirtualElement>({
    open: popover.isOpen,
    placement: "bottom",
    strategy: "fixed",
    middleware: [
      offset(10),
      flip({ padding: 12 }),
      shift({ padding: 12 }),
      size({
        padding: 12,
        apply({ availableHeight, elements }) {
          elements.floating.style.maxHeight = `${Math.max(
            160,
            Math.min(320, availableHeight)
          )}px`;
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    refs.setReference(popover.anchor as VirtualElement | null);
  }, [popover.anchor, refs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const clickedOnPopover = target.closest("[data-dictionary-popover]");
      const clickedOnFooter = target.closest("#footer");
      const clickedOnCharacter = target.closest(".character");
      const clickedOnReaderText = target.closest("[data-reader-verse-id]");

      if (consumeReaderCharacterLookupPointer()) return;
      if (clickedOnPopover || clickedOnFooter) return;
      if (clickedOnCharacter || clickedOnReaderText) {
        return;
      }
      if (popover.isOpen && popover.anchor) {
        closePopover(popover.anchor);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closePopover, popover]);

  useEffect(() => {
    if (popover.isOpen) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          if (popover.anchor) {
            closePopover(popover.anchor);
          }
        }

        if (event.key === "Tab") {
          event.preventDefault();
          if (popover.anchor) {
            closePopover(popover.anchor);
          }
        }

        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          const charMeta = CharMetaSchema.safeParse(popover.meta);
          if (!charMeta.success) return;
          const { charId } = charMeta.data;
          event.preventDefault();
          if (event.shiftKey && event.key === "ArrowRight") {
            extendNextChar(charMeta.data);
            return;
          }

          if (event.shiftKey && event.key === "ArrowLeft") {
            extendPrevChar(charMeta.data);
            return;
          }

          if (event.key === "ArrowRight") {
            renderNextChar(charId);
          } else {
            renderPrevChar(charId);
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [
    extendNextChar,
    extendPrevChar,
    renderNextChar,
    renderPrevChar,
    popover.isOpen,
    closePopover,
    popover.anchor,
    popover.meta,
  ]);

  if (!popover.isOpen || !popover.anchor || !popover.content) {
    return null;
  }

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className="z-40 w-[min(25rem,calc(100vw-1.5rem))] overflow-auto focus:outline-none"
        data-dictionary-popover=""
        role="dialog"
        aria-label="Dictionary"
      >
        {popover.content}
      </div>
    </FloatingPortal>
  );
}
