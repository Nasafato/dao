"use client";

import { themeEffect } from "@/app/theme-effect";
import { clearReaderSelectionHighlight } from "@/lib/readerSelectionHighlight";
import { useDaoStore } from "@/state/store";
import { BackgroundStyle, border } from "@/styles";
import type { DaoVerse } from "@/types";
import {
  Cog6ToothIcon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { BookOpenText, BookSearch, TableOfContents } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { twJoin } from "tailwind-merge";

const DICTIONARY_MODE_STORAGE_KEY = "dao.reader.dictionaryMode";
const PINYIN_MODE_STORAGE_KEY = "dao.reader.pinyinMode.v2";

export function ReaderSettings({
  verses = [],
}: {
  verses?: Pick<DaoVerse, "id" | "text">[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isContentsOpen, setIsContentsOpen] = useState(false);
  const [hasLoadedPreference, setHasLoadedPreference] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("light");
  const dictionaryMode = useDaoStore((state) => state.dictionaryMode);
  const setDictionaryMode = useDaoStore((state) => state.setDictionaryMode);
  const setIsPopoverOpen = useDaoStore((state) => state.setIsPopoverOpen);
  const pinyinMode = useDaoStore((state) => state.pinyinMode);
  const setPinyinMode = useDaoStore((state) => state.setPinyinMode);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedDictionaryPreference = window.localStorage.getItem(
      DICTIONARY_MODE_STORAGE_KEY
    );
    const storedPreference = window.localStorage.getItem(
      PINYIN_MODE_STORAGE_KEY
    );
    if (storedDictionaryPreference !== null) {
      setDictionaryMode(storedDictionaryPreference === "true");
    }
    if (storedPreference !== null) {
      setPinyinMode(storedPreference === "true");
    }
    setHasLoadedPreference(true);
  }, [setDictionaryMode, setPinyinMode]);

  useEffect(() => {
    const syncTheme = () => {
      setCurrentTheme(themeEffect() === "dark" ? "dark" : "light");
    };
    syncTheme();

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "theme") syncTheme();
    };

    media.addEventListener("change", syncTheme);
    window.addEventListener("storage", handleStorage);
    return () => {
      media.removeEventListener("change", syncTheme);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedPreference) return;
    window.localStorage.setItem(PINYIN_MODE_STORAGE_KEY, String(pinyinMode));
  }, [hasLoadedPreference, pinyinMode]);

  useEffect(() => {
    if (!hasLoadedPreference) return;
    window.localStorage.setItem(
      DICTIONARY_MODE_STORAGE_KEY,
      String(dictionaryMode)
    );
  }, [dictionaryMode, hasLoadedPreference]);

  useEffect(() => {
    if (!isOpen && !isContentsOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (panelRef.current?.contains(target)) return;
      setIsOpen(false);
      setIsContentsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsContentsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isContentsOpen, isOpen]);

  const setDarkMode = (enabled: boolean) => {
    window.localStorage.setItem("theme", enabled ? "dark" : "light");
    setCurrentTheme(themeEffect() === "dark" ? "dark" : "light");
  };

  const toggleDictionaryMode = () => {
    const nextDictionaryMode = !dictionaryMode;
    setDictionaryMode(nextDictionaryMode);
    if (!nextDictionaryMode) {
      setIsPopoverOpen(false);
      clearReaderSelectionHighlight();
    }
  };
  const ReaderModeIcon = dictionaryMode ? BookSearch : BookOpenText;
  const readerModeLabel = dictionaryMode ? "Dictionary" : "Reading";
  const hasVerses = verses.length > 0;

  return (
    <div
      ref={panelRef}
      className="fixed right-4 top-4 z-30 flex flex-col items-end gap-2"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Open table of contents"
          aria-expanded={isContentsOpen}
          className={twJoin(
            "inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-lg",
            isContentsOpen
              ? "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700 dark:bg-gray-100 dark:text-gray-950 dark:hover:bg-gray-200 dark:active:bg-gray-300"
              : "text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-800 dark:active:bg-gray-700",
            !isContentsOpen && BackgroundStyle,
            border()
          )}
          onClick={() => {
            setIsContentsOpen((current) => !current);
            setIsOpen(false);
          }}
        >
          <TableOfContents className="h-5 w-5" strokeWidth={2.2} />
        </button>
        <button
          type="button"
          aria-label={
            dictionaryMode
              ? "Current mode: Dictionary. Switch to reading mode"
              : "Current mode: Reading. Switch to dictionary mode"
          }
          aria-pressed={dictionaryMode}
          className={twJoin(
            "inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full border px-3.5 text-sm font-medium shadow-lg",
            dictionaryMode
              ? "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700 dark:bg-gray-100 dark:text-gray-950 dark:hover:bg-gray-200 dark:active:bg-gray-300"
              : "text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-800 dark:active:bg-gray-700",
            !dictionaryMode && BackgroundStyle,
            border()
          )}
          onClick={toggleDictionaryMode}
        >
          <ReaderModeIcon className="h-5 w-5 shrink-0" strokeWidth={2.2} />
          <span>{readerModeLabel}</span>
        </button>
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

      {isContentsOpen && (
        <div
          role="dialog"
          aria-label="Table of contents"
          className={twJoin(
            "max-h-[70vh] w-80 max-w-[calc(100vw-2rem)] overflow-auto rounded-md border p-3 shadow-xl sm:w-[30rem]",
            BackgroundStyle,
            border()
          )}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-50">
              Contents
            </div>
            <button
              type="button"
              aria-label="Close table of contents"
              className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => setIsContentsOpen(false)}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-9">
            {(hasVerses ? verses : buildFallbackVerses()).map((verse) => (
              <a
                key={verse.id}
                href={`#dao${verse.id}`}
                aria-label={`Go to chapter ${verse.id}`}
                title={verse.text}
                className="flex h-11 w-11 items-center justify-center rounded border border-gray-200 text-sm font-medium text-gray-800 hover:bg-gray-100 active:bg-gray-200 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800 dark:active:bg-gray-700"
                onClick={() => setIsContentsOpen(false)}
              >
                {verse.id}
              </a>
            ))}
          </div>
        </div>
      )}

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
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              aria-label="Close reader settings"
              className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => setIsOpen(false)}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            <SettingsSwitch
              ariaLabel="Pinyin mode"
              checked={pinyinMode}
              label="Show pinyin"
              onChange={setPinyinMode}
            />
            <SettingsSwitch
              ariaLabel="Dark mode"
              checked={currentTheme === "dark"}
              label={
                <span className="inline-flex items-center gap-1.5">
                  <SunIcon className="h-4 w-4 dark:hidden" />
                  <MoonIcon className="hidden h-4 w-4 dark:block" />
                  Dark
                </span>
              }
              onChange={setDarkMode}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function buildFallbackVerses() {
  return Array.from({ length: 81 }, (_, index) => ({
    id: index + 1,
    text: `第${index + 1}章`,
  }));
}

function SettingsSwitch({
  ariaLabel,
  checked,
  label,
  onChange,
}: {
  ariaLabel: string;
  checked: boolean;
  label: React.ReactNode;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        className={twJoin(
          "relative h-6 w-11 rounded-full transition",
          checked
            ? "bg-gray-900 dark:bg-gray-100"
            : "bg-gray-300 dark:bg-gray-700"
        )}
        onClick={() => onChange(!checked)}
      >
        <span
          className={twJoin(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition dark:bg-gray-950",
            checked ? "left-5" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}
