"use client";

import { punctuation } from "@/consts";
import { buildCharId, CharMap } from "@/lib/charNavigation";
import { markReaderCharacterLookupPointer } from "@/lib/readerCharacterTap";
import {
  clearReaderSelectionHighlight,
  highlightReaderRange,
} from "@/lib/readerSelectionHighlight";
import { Definition } from "./Definition";
import { usePopoverApi, type PopoverAnchor } from "./PopoverProvider";
import { useEffect, useRef, type RefObject } from "react";

type PointerStart = {
  pointerId: number;
  x: number;
  y: number;
  timeStamp: number;
};

type CharacterHit = {
  char: string;
  charIndex: number;
  range: Range;
  verseId: number;
};

const TAP_MOVEMENT_TOLERANCE = 10;
const LONG_PRESS_MS = 500;

export function ReaderCharacterLookup({
  rootRef,
}: {
  rootRef: RefObject<HTMLDivElement | null>;
}) {
  const { renderPopover } = usePopoverApi();
  const pointerStartRef = useRef<PointerStart | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (!isReaderTextTarget(event.target, root)) return;

      clearReaderSelectionHighlight();
      pointerStartRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        timeStamp: event.timeStamp,
      };
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
      if (moved > TAP_MOVEMENT_TOLERANCE) return;

      const selectedText = window.getSelection()?.toString().trim() ?? "";
      const wasLongPress = event.timeStamp - pointerStart.timeStamp > LONG_PRESS_MS;
      if (wasLongPress && selectedText) return;

      const hit = findCharacterAtPoint(event.clientX, event.clientY, root);
      if (!hit) return;

      highlightReaderRange(hit.range);

      if (punctuation.includes(hit.char) || !hit.char.trim()) return;

      const charId = buildCharId({
        verseId: hit.verseId,
        charIndex: hit.charIndex,
        context: "verse",
      });
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

    root.addEventListener("pointerdown", handlePointerDown);
    root.addEventListener("pointerup", handlePointerUp);

    return () => {
      root.removeEventListener("pointerdown", handlePointerDown);
      root.removeEventListener("pointerup", handlePointerUp);
    };
  }, [renderPopover, rootRef]);

  return null;
}

function isReaderTextTarget(target: EventTarget | null, root: HTMLElement) {
  if (!(target instanceof Element)) return false;
  const verseElement = target.closest("[data-reader-verse-id]");
  return !!verseElement && root.contains(verseElement);
}

function findCharacterAtPoint(
  x: number,
  y: number,
  root: HTMLElement
): CharacterHit | null {
  const target = document.elementFromPoint(x, y);
  const verseElement = target?.closest<HTMLElement>("[data-reader-verse-id]");
  if (!verseElement || !root.contains(verseElement)) return null;

  const verseId = Number(verseElement.dataset.readerVerseId);
  const textNode = findTextNode(verseElement);
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
          range,
          verseId,
        };
      }
    }
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
