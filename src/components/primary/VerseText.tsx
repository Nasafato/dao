"use client";

import { registerReaderVerseText } from "@/lib/charNavigation";
import { useDaoStore } from "@/state/store";
import type { VersePinyin } from "@/types";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

export function VerseText({
  pinyin,
  verseId,
  text,
}: {
  pinyin?: VersePinyin;
  verseId: number;
  text: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const pinyinMode = useDaoStore((state) => state.pinyinMode);

  useEffect(() => {
    if (!ref.current) return;
    return registerReaderVerseText(verseId, ref.current);
  }, [text, verseId]);

  return (
    <p
      ref={ref}
      data-reader-verse-id={verseId}
      className="relative select-text text-[2rem]/[1.7] font-normal tracking-normal text-gray-900 selection:bg-amber-200 selection:text-gray-950 dark:text-gray-50 dark:selection:bg-amber-300/30 dark:selection:text-amber-50 sm:text-[2.25rem]/[1.65]"
    >
      {text}
      {pinyinMode && pinyin && (
        <PinyinOverlay pinyin={pinyin} text={text} textRef={ref} />
      )}
    </p>
  );
}

type PinyinLabel = {
  fontSize: number;
  index: number;
  left: number;
  pinyin: string;
  top: number;
  width: number;
};

function PinyinOverlay({
  pinyin,
  text,
  textRef,
}: {
  pinyin: VersePinyin;
  text: string;
  textRef: RefObject<HTMLParagraphElement | null>;
}) {
  const [labels, setLabels] = useState<PinyinLabel[]>([]);

  const measureLabels = useCallback(() => {
    const element = textRef.current;
    const textNode = element ? findTextNode(element) : null;
    if (!element || !textNode) {
      setLabels([]);
      return;
    }

    const containerRect = element.getBoundingClientRect();
    const nextLabels: PinyinLabel[] = [];

    for (let index = 0; index < text.length; index++) {
      const label = pinyin[index];
      if (!label) continue;

      const range = document.createRange();
      range.setStart(textNode, index);
      range.setEnd(textNode, index + 1);
      const rect = Array.from(range.getClientRects()).find(
        (rect) => rect.width > 0 && rect.height > 0
      );

      if (!rect) continue;

      nextLabels.push({
        fontSize: getPinyinFontSize(label, rect.width),
        index,
        left: rect.left - containerRect.left,
        pinyin: label,
        top: rect.bottom - containerRect.top + 1,
        width: rect.width,
      });
    }

    setLabels(nextLabels);
  }, [pinyin, text, textRef]);

  useLayoutEffect(() => {
    let frame: number | null = null;
    let cancelled = false;

    const scheduleMeasure = () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = null;
        if (!cancelled) measureLabels();
      });
    };

    scheduleMeasure();

    const element = textRef.current;
    const resizeObserver =
      element && "ResizeObserver" in window
        ? new ResizeObserver(scheduleMeasure)
        : null;
    if (element) resizeObserver?.observe(element);

    window.addEventListener("resize", scheduleMeasure);
    document.fonts?.ready.then(scheduleMeasure);

    return () => {
      cancelled = true;
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", scheduleMeasure);
      resizeObserver?.disconnect();
    };
  }, [measureLabels, textRef]);

  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      {labels.map((label) => (
        <span
          key={label.index}
          className="absolute select-none whitespace-nowrap text-right font-sans tracking-normal text-gray-500 dark:text-gray-400"
          style={{
            fontSize: label.fontSize,
            left: label.left,
            lineHeight: `${label.fontSize}px`,
            top: label.top,
            width: label.width,
          }}
        >
          {label.pinyin}
        </span>
      ))}
    </span>
  );
}

function getPinyinFontSize(pinyin: string, characterWidth: number) {
  const estimatedWidthPerEm = 0.58;
  const maxFontSize = 8;
  const minFontSize = 6.5;
  const fittedSize = characterWidth / (pinyin.length * estimatedWidthPerEm);
  return Math.max(minFontSize, Math.min(maxFontSize, fittedSize));
}

function findTextNode(element: HTMLElement) {
  for (const child of element.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      return child as Text;
    }
  }
  return null;
}
