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

const DICTIONARY_POPOVER_HEIGHT = 176;
const DICTIONARY_POPOVER_MIN_HEIGHT = 120;
const FLOATING_MENU_RESERVED_TOP = 76;
const FLOATING_NAV_RESERVED_BOTTOM = 92;
const POPOVER_PADDING = {
  bottom: FLOATING_NAV_RESERVED_BOTTOM,
  left: 12,
  right: 12,
  top: FLOATING_MENU_RESERVED_TOP,
};

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
      flip({ padding: POPOVER_PADDING }),
      shift({ padding: POPOVER_PADDING }),
      size({
        padding: POPOVER_PADDING,
        apply({ availableHeight, elements }) {
          const height = Math.max(
            DICTIONARY_POPOVER_MIN_HEIGHT,
            Math.min(DICTIONARY_POPOVER_HEIGHT, availableHeight)
          );
          elements.floating.style.height = `${height}px`;
          elements.floating.style.maxHeight = `${height}px`;
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    refs.setReference(popover.anchor as VirtualElement | null);
  }, [popover.anchor, refs]);

  useEffect(() => {
    const handlePointerDownOutside = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      const clickedOnPopover = target.closest("[data-dictionary-popover]");
      const clickedOnFooter = target.closest("#footer");
      const clickedOnCharacter = target.closest(".character");
      const clickedOnReaderText = target.closest("[data-reader-text]");

      if (consumeReaderCharacterLookupPointer()) return;
      if (clickedOnPopover || clickedOnFooter) return;
      if (clickedOnCharacter || clickedOnReaderText) {
        return;
      }
      if (popover.isOpen && popover.anchor) {
        closePopover(popover.anchor);
      }
    };

    document.addEventListener("pointerdown", handlePointerDownOutside);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDownOutside);
    };
  }, [closePopover, popover]);

  useEffect(() => {
    if (!popover.isOpen || !popover.anchor) return;
    const anchor = popover.anchor;

    const handleSelectionChange = () => {
      const activeSelection = window.getSelection();
      if (
        !activeSelection ||
        activeSelection.rangeCount === 0 ||
        activeSelection.isCollapsed ||
        !activeSelection.toString().trim()
      ) {
        return;
      }

      const range = activeSelection.getRangeAt(0);
      if (doesRangeTouchPopover(range)) return;

      closePopover(anchor);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [closePopover, popover.anchor, popover.isOpen]);

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
        className="reader-liquid-glass z-30 w-[min(25rem,calc(100vw-1.5rem))] overflow-hidden rounded-md text-gray-900 focus:outline-none dark:text-gray-50"
        data-dictionary-popover=""
        role="dialog"
        aria-label="Dictionary"
      >
        {popover.content}
      </div>
    </FloatingPortal>
  );
}

function doesRangeTouchPopover(range: Range) {
  const ancestor = range.commonAncestorContainer;
  const element =
    ancestor instanceof Element ? ancestor : ancestor.parentElement;
  return !!element?.closest("[data-dictionary-popover]");
}
