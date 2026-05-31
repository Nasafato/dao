"use client";
import { useEffect } from "react";
import { CharMetaSchema, useCharNavigation } from "@/lib/charNavigation";
import { consumeReaderCharacterLookupPointer } from "@/lib/readerCharacterTap";
import { usePopoverApi, usePopoverData } from "./PopoverProvider";

export function Popover() {
  const popover = usePopoverData();
  const { closePopover } = usePopoverApi();
  const { extendPrevChar, extendNextChar, renderPrevChar, renderNextChar } =
    useCharNavigation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const clickedOnFooter = target.closest("#footer");
      const clickedOnCharacter = target.closest(".character");

      if (consumeReaderCharacterLookupPointer()) return;
      if (clickedOnFooter) return;
      if (clickedOnCharacter) {
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

  return null;
}
