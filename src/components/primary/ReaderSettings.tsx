"use client";

import { themeEffect } from "@/app/theme-effect";
import { useDaoStore } from "@/state/store";
import { BackgroundStyle, border } from "@/styles";
import {
  Cog6ToothIcon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { BookOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { twJoin } from "tailwind-merge";

const DICTIONARY_MODE_STORAGE_KEY = "dao.reader.dictionaryMode";
const PINYIN_MODE_STORAGE_KEY = "dao.reader.pinyinMode.v2";

export function ReaderSettings() {
  const [isOpen, setIsOpen] = useState(false);
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

  const setDarkMode = (enabled: boolean) => {
    window.localStorage.setItem("theme", enabled ? "dark" : "light");
    setCurrentTheme(themeEffect() === "dark" ? "dark" : "light");
  };

  const toggleDictionaryMode = () => {
    const nextDictionaryMode = !dictionaryMode;
    setDictionaryMode(nextDictionaryMode);
    if (!nextDictionaryMode) {
      setIsPopoverOpen(false);
      delete document.documentElement.dataset.readerCharacterSelection;
      window.getSelection()?.removeAllRanges();
    }
  };

  return (
    <div
      ref={panelRef}
      className="fixed right-4 top-4 z-30 flex flex-col items-end gap-2"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={
            dictionaryMode ? "Turn dictionary mode off" : "Turn dictionary mode on"
          }
          aria-pressed={dictionaryMode}
          className={twJoin(
            "inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-lg",
            dictionaryMode
              ? "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700 dark:bg-gray-100 dark:text-gray-950 dark:hover:bg-gray-200 dark:active:bg-gray-300"
              : "text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-800 dark:active:bg-gray-700",
            !dictionaryMode && BackgroundStyle,
            border()
          )}
          onClick={toggleDictionaryMode}
        >
          <BookOpen className="h-5 w-5" strokeWidth={2.2} />
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

          <div className="space-y-3">
            <SettingsSwitch
              ariaLabel="Pinyin mode"
              checked={pinyinMode}
              label="Pinyin"
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
