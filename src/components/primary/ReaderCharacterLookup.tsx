"use client";

import { punctuation } from "@/consts";
import {
  buildCharId,
  CharMap,
  type ReaderTextContext,
} from "@/lib/charNavigation";
import { markReaderCharacterLookupPointer } from "@/lib/readerCharacterTap";
import {
  clearReaderSelectionHighlight,
  highlightReaderRange,
} from "@/lib/readerSelectionHighlight";
import { Definition } from "./Definition";
import {
  usePopoverApi,
  usePopoverData,
  type PopoverAnchor,
} from "./PopoverProvider";
import { useEffect, useRef, type RefObject } from "react";

type PointerStart = {
  pointerId: number;
  x: number;
  y: number;
  hasClosedPopover: boolean;
  timeStamp: number;
};

type CharacterHit = {
  char: string;
  charIndex: number;
  context: ReaderTextContext;
  range: Range;
  verseId: number;
};

type SuppressedTap = {
  charId: string;
  expiresAt: number;
};

const TAP_MOVEMENT_TOLERANCE = 10;
const CHARACTER_HIT_SLOP = 24;
const SAME_CHARACTER_REOPEN_SUPPRESSION_MS = 500;
const READER_TEXT_SELECTOR = "[data-reader-text]";

export function ReaderCharacterLookup({
  rootRef,
}: {
  rootRef: RefObject<HTMLDivElement | null>;
}) {
  const { closePopover, renderPopover } = usePopoverApi();
  const popover = usePopoverData();
  const pointerStartRef = useRef<PointerStart | null>(null);
  const suppressedTapRef = useRef<SuppressedTap | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const closeOpenPopover = () => {
      if (!popover.isOpen || !popover.anchor) return;
      closePopover(popover.anchor);
      clearReaderSelectionHighlight();
    };

    const suppressImmediateReopen = (charId: string, timeStamp: number) => {
      suppressedTapRef.current = {
        charId,
        expiresAt: timeStamp + SAME_CHARACTER_REOPEN_SUPPRESSION_MS,
      };
    };

    const isImmediateReopenSuppressed = (
      charId: string,
      timeStamp: number
    ) => {
      const suppressedTap = suppressedTapRef.current;
      if (!suppressedTap) return false;
      if (timeStamp > suppressedTap.expiresAt) {
        suppressedTapRef.current = null;
        return false;
      }
      return suppressedTap.charId === charId;
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (!isReaderTextTarget(event.target, root)) return;

      clearReaderSelectionHighlight();
      pointerStartRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        hasClosedPopover: false,
        timeStamp: event.timeStamp,
      };
    };

    const handlePointerMove = (event: PointerEvent) => {
      const pointerStart = pointerStartRef.current;
      if (!pointerStart || pointerStart.pointerId !== event.pointerId) return;
      if (pointerStart.hasClosedPopover) return;

      const moved = Math.hypot(
        event.clientX - pointerStart.x,
        event.clientY - pointerStart.y
      );
      if (moved <= TAP_MOVEMENT_TOLERANCE) return;

      pointerStart.hasClosedPopover = true;
      closeOpenPopover();
    };

    const handlePointerUp = (event: PointerEvent) => {
      const pointerStart = pointerStartRef.current;
      pointerStartRef.current = null;

      if (!pointerStart || pointerStart.pointerId !== event.pointerId) return;
      if (!isReaderTextTarget(event.target, root)) return;

      const moved = Math.hypot(
        event.clientX - pointerStart.x,
        event.clientY - pointerStart.y
      );
      if (moved > TAP_MOVEMENT_TOLERANCE) {
        closeOpenPopover();
        return;
      }

      const selectedText = window.getSelection()?.toString().trim() ?? "";
      if (selectedText) {
        closeOpenPopover();
        return;
      }

      const hit = findCharacterAtPoint(event.clientX, event.clientY, root);
      if (!hit || punctuation.includes(hit.char) || !hit.char.trim()) {
        closeOpenPopover();
        return;
      }


      const charId = buildCharId({
        verseId: hit.verseId,
        charIndex: hit.charIndex,
        context: hit.context,
      });
      if (isImmediateReopenSuppressed(charId, event.timeStamp)) {
        closeOpenPopover();
        return;
      }

      if (
        popover.isOpen &&
        popover.anchor &&
        popover.meta?.charId === charId
      ) {
        suppressImmediateReopen(charId, event.timeStamp);
        closeOpenPopover();
        return;
      }

      highlightReaderRange(hit.range);
      CharMap.set(charId, hit.char);
      markReaderCharacterLookupPointer();

      renderPopover({
        anchor: createVirtualAnchor(hit.range),
        content: (
          <Definition.Wrapper>
            <Definition char={hit.char} />
          </Definition.Wrapper>
        ),
        meta: { charId },
      });
    };

    const handlePointerCancel = () => {
      pointerStartRef.current = null;
      closeOpenPopover();
    };

    const handleDoubleClick = (event: MouseEvent) => {
      if (!isReaderTextTarget(event.target, root)) return;
      event.preventDefault();
      pointerStartRef.current = null;
      const hit = findCharacterAtPoint(event.clientX, event.clientY, root);
      if (hit) {
        suppressImmediateReopen(
          buildCharId({
            verseId: hit.verseId,
            charIndex: hit.charIndex,
            context: hit.context,
          }),
          event.timeStamp
        );
      }
      closeOpenPopover();
    };

    root.addEventListener("pointerdown", handlePointerDown);
    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerup", handlePointerUp);
    root.addEventListener("pointercancel", handlePointerCancel);
    root.addEventListener("dblclick", handleDoubleClick);

    return () => {
      root.removeEventListener("pointerdown", handlePointerDown);
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerup", handlePointerUp);
      root.removeEventListener("pointercancel", handlePointerCancel);
      root.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [
    closePopover,
    popover.anchor,
    popover.isOpen,
    popover.meta?.charId,
    renderPopover,
    rootRef,
  ]);

  return null;
}

function isReaderTextTarget(target: EventTarget | null, root: HTMLElement) {
  if (!(target instanceof Element)) return false;
  const readerTextElement = target.closest(READER_TEXT_SELECTOR);
  return !!readerTextElement && root.contains(readerTextElement);
}

function findCharacterAtPoint(
  x: number,
  y: number,
  root: HTMLElement
): CharacterHit | null {
  const target = document.elementFromPoint(x, y);
  const readerTextElement = target?.closest<HTMLElement>(READER_TEXT_SELECTOR);
  if (!readerTextElement || !root.contains(readerTextElement)) return null;

  const verseId = Number(readerTextElement.dataset.readerVerseId);
  const context =
    readerTextElement.dataset.readerTextContext === "description"
      ? "description"
      : "verse";
  const textNode = findTextNode(readerTextElement);
  const text = textNode?.nodeValue ?? "";
  if (!textNode || !text || Number.isNaN(verseId)) return null;

  let bestHit: CharacterHit | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < text.length; index++) {
    const range = document.createRange();
    range.setStart(textNode, index);
    range.setEnd(textNode, index + 1);

    const rects = Array.from(range.getClientRects()).filter(
      (rect) => rect.width > 0 && rect.height > 0
    );

    for (const rect of rects) {
      if (y < rect.top - 8 || y > rect.bottom + 8) continue;

      const dx =
        x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0;
      const dy =
        y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0;
      const distance = dx * dx + dy * dy;

      if (distance < bestDistance) {
        bestDistance = distance;
        bestHit = {
          char: text[index],
          charIndex: index,
          context,
          range,
          verseId,
        };
      }
    }
  }

  if (!bestHit || bestDistance > CHARACTER_HIT_SLOP * CHARACTER_HIT_SLOP) {
    return null;
  }

  return bestHit;
}

function findTextNode(element: HTMLElement) {
  for (const child of element.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      return child;
    }
  }
  return null;
}

function createVirtualAnchor(range: Range): PopoverAnchor {
  const fallbackRect = cloneRect(range.getBoundingClientRect());

  return {
    getBoundingClientRect: () => {
      const rect = range.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return rect;
      }
      return fallbackRect;
    },
  };
}

function cloneRect(rect: DOMRect) {
  return DOMRect.fromRect({
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  });
}
