"use client";

import { themeEffect } from "@/app/theme-effect";
import { clearReaderSelectionHighlight } from "@/lib/readerSelectionHighlight";
import { useDaoStore } from "@/state/store";
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
const LiquidControlStyle =
  "reader-liquid-glass inline-flex h-11 items-center justify-center outline-none transition hover:brightness-[0.98] focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:scale-[0.98] dark:hover:brightness-110";
const LiquidPanelStyle =
  "reader-liquid-glass text-gray-900 outline-none dark:text-gray-50";
type OpenReaderMenu = "contents" | "settings" | null;

export function ReaderSettings({
  verses = [],
}: {
  verses?: Pick<DaoVerse, "id" | "text">[];
}) {
  const [openMenu, setOpenMenu] = useState<OpenReaderMenu>(null);
  const [hasLoadedPreference, setHasLoadedPreference] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("light");
  const dictionaryMode = useDaoStore((state) => state.dictionaryMode);
  const setDictionaryMode = useDaoStore((state) => state.setDictionaryMode);
  const setIsPopoverOpen = useDaoStore((state) => state.setIsPopoverOpen);
  const pinyinMode = useDaoStore((state) => state.pinyinMode);
  const setPinyinMode = useDaoStore((state) => state.setPinyinMode);
  const panelRef = useRef<HTMLDivElement>(null);
  const isContentsOpen = openMenu === "contents";
  const isOpen = openMenu === "settings";

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
    if (!openMenu) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (panelRef.current?.contains(target)) return;
      setOpenMenu(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenu]);

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
      className="fixed right-4 top-4 z-50 flex flex-col items-end gap-2"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={
            dictionaryMode
              ? "Current mode: Dictionary. Switch to reading mode"
              : "Current mode: Reading. Switch to dictionary mode"
          }
          aria-pressed={dictionaryMode}
          className={twJoin(
            LiquidControlStyle,
            "gap-2 whitespace-nowrap rounded-full px-3.5 text-sm font-medium",
            "text-gray-800 dark:text-gray-100"
          )}
          onClick={toggleDictionaryMode}
        >
          <ReaderModeIcon className="h-5 w-5 shrink-0" strokeWidth={2.2} />
          <span>{readerModeLabel}</span>
        </button>
        <button
          type="button"
          aria-label="Open table of contents"
          aria-expanded={isContentsOpen}
          className={twJoin(
            LiquidControlStyle,
            "w-11 rounded-full",
            "text-gray-800 dark:text-gray-100"
          )}
          onClick={() => {
            setOpenMenu((current) =>
              current === "contents" ? null : "contents"
            );
          }}
        >
          {isContentsOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <TableOfContents className="h-5 w-5" strokeWidth={2.2} />
          )}
        </button>
        <button
          type="button"
          aria-label="Open reader settings"
          aria-expanded={isOpen}
          className={twJoin(
            LiquidControlStyle,
            "w-11 rounded-full",
            "text-gray-800 dark:text-gray-100"
          )}
          onClick={() => {
            setOpenMenu((current) =>
              current === "settings" ? null : "settings"
            );
          }}
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Cog6ToothIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {isContentsOpen && (
        <div
          role="dialog"
          aria-label="Table of contents"
          className={twJoin(
            "max-h-[70vh] w-80 max-w-[calc(100vw-2rem)] overflow-auto rounded-md p-3 sm:w-[30rem]",
            LiquidPanelStyle
          )}
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-50">
              Contents
            </div>
          </div>
          <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-9">
            {(hasVerses ? verses : buildFallbackVerses()).map((verse) => (
              <a
                key={verse.id}
                href={`#dao${verse.id}`}
                aria-label={`Go to chapter ${verse.id}`}
                title={verse.text}
                className="reader-liquid-glass-item flex h-11 w-11 items-center justify-center rounded border text-sm font-medium text-gray-900 transition hover:brightness-95 active:scale-[0.98] dark:text-gray-50 dark:hover:brightness-110"
                onClick={() => setOpenMenu(null)}
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
            "w-64 max-w-[calc(100vw-2rem)] rounded-md p-3",
            LiquidPanelStyle
          )}
        >
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
          "inline-flex h-7 w-12 shrink-0 items-center rounded-full border p-0.5 transition shadow-inner",
          checked
            ? "border-emerald-500/50 bg-emerald-500 dark:border-emerald-300/50 dark:bg-emerald-400"
            : "reader-liquid-glass-item border-gray-950/10 bg-white/45 dark:border-white/10 dark:bg-white/10"
        )}
        onClick={() => onChange(!checked)}
      >
        <span
          className={twJoin(
            "block h-6 w-6 rounded-full shadow transition-transform",
            checked
              ? "bg-white dark:bg-gray-950"
              : "bg-white/95 dark:bg-gray-950/95",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
