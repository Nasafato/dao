"use client";

import { useDaoStore } from "@/state/store";
import { BackgroundStyle, border } from "@/styles";
import { Cog6ToothIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import { twJoin } from "tailwind-merge";

const PINYIN_MODE_STORAGE_KEY = "dao.reader.pinyinMode";

export function ReaderSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasLoadedPreference, setHasLoadedPreference] = useState(false);
  const pinyinMode = useDaoStore((state) => state.pinyinMode);
  const setPinyinMode = useDaoStore((state) => state.setPinyinMode);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedPreference = window.localStorage.getItem(
      PINYIN_MODE_STORAGE_KEY
    );
    if (storedPreference !== null) {
      setPinyinMode(storedPreference === "true");
    }
    setHasLoadedPreference(true);
  }, [setPinyinMode]);

  useEffect(() => {
    if (!hasLoadedPreference) return;
    window.localStorage.setItem(PINYIN_MODE_STORAGE_KEY, String(pinyinMode));
  }, [hasLoadedPreference, pinyinMode]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (panelRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={panelRef}
      className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2"
    >
      {isOpen && (
        <div
          role="dialog"
          aria-label="Reader settings"
          className={twJoin(
            "w-64 max-w-[calc(100vw-2rem)] rounded-md border p-3 shadow-xl",
            BackgroundStyle,
            border()
          )}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-50">
              Reader
            </div>
            <button
              type="button"
              aria-label="Close reader settings"
              className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => setIsOpen(false)}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-700 dark:text-gray-200">
              Pinyin
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={pinyinMode}
              aria-label="Pinyin mode"
              className={twJoin(
                "relative h-6 w-11 rounded-full transition",
                pinyinMode
                  ? "bg-gray-900 dark:bg-gray-100"
                  : "bg-gray-300 dark:bg-gray-700"
              )}
              onClick={() => setPinyinMode(!pinyinMode)}
            >
              <span
                className={twJoin(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition dark:bg-gray-950",
                  pinyinMode ? "left-5" : "left-0.5"
                )}
              />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label="Open reader settings"
        aria-expanded={isOpen}
        className={twJoin(
          "inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-lg",
          "text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-800 dark:active:bg-gray-700",
          BackgroundStyle,
          border()
        )}
        onClick={() => setIsOpen((current) => !current)}
      >
        <Cog6ToothIcon className="h-6 w-6" />
      </button>
    </div>
  );
}
