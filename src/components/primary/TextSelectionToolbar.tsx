"use client";

import {
  CheckIcon,
  ClipboardDocumentIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { twJoin } from "tailwind-merge";

type ToolbarSelection = {
  text: string;
  left: number;
  top: number;
  copied: boolean;
};

export function TextSelectionToolbar({
  rootRef,
}: {
  rootRef: RefObject<HTMLDivElement | null>;
}) {
  const [selection, setSelection] = useState<ToolbarSelection | null>(null);
  const frameRef = useRef<number | null>(null);
  const copiedTimeoutRef = useRef<number | null>(null);

  const readSelection = useCallback(() => {
    const root = rootRef.current;
    const activeSelection = window.getSelection();
    if (!root || !activeSelection || activeSelection.rangeCount === 0) {
      setSelection(null);
      return;
    }

    const range = activeSelection.getRangeAt(0);
    const selectedText = activeSelection.toString();
    if (activeSelection.isCollapsed || !selectedText.trim()) {
      setSelection(null);
      return;
    }

    if (!doesRangeTouchReaderText(range, root)) {
      setSelection(null);
      return;
    }

    const rect = getVisibleSelectionRect(range);
    if (!rect) {
      setSelection(null);
      return;
    }

    setSelection((previous) => ({
      text: selectedText,
      left: clamp(rect.left + rect.width / 2, 48, window.innerWidth - 48),
      top: clamp(rect.bottom + 8, 8, window.innerHeight - 56),
      copied: previous?.text === selectedText ? previous.copied : false,
    }));
  }, [rootRef]);

  const scheduleSelectionRead = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      readSelection();
    });
  }, [readSelection]);

  useEffect(() => {
    document.addEventListener("selectionchange", scheduleSelectionRead);
    document.addEventListener("pointerup", scheduleSelectionRead);
    document.addEventListener("keyup", scheduleSelectionRead);

    return () => {
      document.removeEventListener("selectionchange", scheduleSelectionRead);
      document.removeEventListener("pointerup", scheduleSelectionRead);
      document.removeEventListener("keyup", scheduleSelectionRead);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      if (copiedTimeoutRef.current !== null) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, [scheduleSelectionRead]);

  const copySelection = useCallback(async () => {
    if (!selection) return;

    try {
      await navigator.clipboard.writeText(selection.text);
    } catch {
      fallbackCopy(selection.text);
    }

    setSelection((current) =>
      current ? { ...current, copied: true } : current
    );

    if (copiedTimeoutRef.current !== null) {
      window.clearTimeout(copiedTimeoutRef.current);
    }
    copiedTimeoutRef.current = window.setTimeout(() => {
      setSelection((current) =>
        current ? { ...current, copied: false } : current
      );
    }, 1200);
  }, [selection]);

  const clearSelection = useCallback(() => {
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  }, []);

  if (!selection) return null;

  return (
    <div
      className="fixed z-50 flex -translate-x-1/2 items-center gap-1 rounded-md border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-950"
      style={{ left: selection.left, top: selection.top }}
      role="toolbar"
      aria-label="Text selection"
    >
      <button
        type="button"
        className={toolbarButtonClass}
        onClick={copySelection}
        title={selection.copied ? "Copied" : "Copy selection"}
        aria-label={selection.copied ? "Copied" : "Copy selection"}
      >
        {selection.copied ? (
          <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
        ) : (
          <ClipboardDocumentIcon className="h-5 w-5" />
        )}
      </button>
      <button
        type="button"
        className={toolbarButtonClass}
        onClick={clearSelection}
        title="Clear selection"
        aria-label="Clear selection"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

const toolbarButtonClass = twJoin(
  "inline-flex h-9 w-9 items-center justify-center rounded text-gray-700",
  "hover:bg-gray-100 active:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-800 dark:active:bg-gray-700"
);

function getVisibleSelectionRect(range: Range) {
  const rects = Array.from(range.getClientRects()).filter(
    (rect) => rect.width > 0 && rect.height > 0
  );
  return rects.at(-1) ?? null;
}

function doesRangeTouchReaderText(range: Range, root: HTMLElement) {
  const verseTexts = root.querySelectorAll("[data-reader-verse-id]");
  for (const verseText of verseTexts) {
    try {
      if (range.intersectsNode(verseText)) return true;
    } catch {
      continue;
    }
  }
  return false;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function fallbackCopy(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
}
