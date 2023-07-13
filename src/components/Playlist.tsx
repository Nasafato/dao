"use client";
import { Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useTransition } from "react";
import { twJoin } from "tailwind-merge";
import { useDaoStore } from "@/state/store";
import { background, border, ButtonStyle } from "@/styles";
import { buildAudioFile } from "@/utils";
import { PlayPauseButton } from "./primary/AudioPlayer/PlayPauseButton";
import { DownloadAudioButton } from "./primary/DownloadAudioButton";
import { PlaylistChinese } from "./PlaylistChinese";
import { PlaylistEnglish } from "./PlaylistEnglish";
import { useIntl, useTranslation } from "@/components/IntlProvider";

export function Playlist() {
  const audioFile = useDaoStore((state) => state.audioFile);
  const isOpen = useDaoStore((state) => state.isPlaylistOpen);
  const setIsPlaylistOpen = useDaoStore((state) => state.setIsPlaylistOpen);
  const language = useDaoStore((state) => state.playlistLanguage);
  const setPlaylistLanguage = useDaoStore((state) => state.setPlaylistLanguage);
  const { t } = useTranslation();

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <div
        className={twJoin(
          "absolute bottom-[3.5rem] right-0 w-[300px] shadow-xl",
          "border",
          border(),
          background()
        )}
      >
        <div className={twJoin("h-[400px] flex flex-col")}>
          <section
            className={
              "flex-1 flex items-center justify-between border-b py-2 px-3 " +
              border()
            }
          >
            <h3 className="text-sm font-semibold leading-6">
              {t("Playlist.title")}
            </h3>
            <button
              type="button"
              className={ButtonStyle({
                color: "icon",
                size: "lg",
              })}
              onClick={() => setIsPlaylistOpen(false)}
            >
              <span className="sr-only">Close panel</span>
              <XMarkIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </section>
          <section
            className={
              "flex-1 flex items-center justify-start border-b py-2 px-3 gap-x-2 " +
              border()
            }
          >
            {(
              [
                { language: t("Playlist.choices.chinese"), id: "Chinese" },
                { language: t("Playlist.choices.english"), id: "English" },
              ] as const
            ).map((choice) => (
              <button
                className={`${ButtonStyle()} px-2 py-1 ${
                  choice.id === language && "bg-gray-200"
                }`}
                onClick={() => {
                  setPlaylistLanguage(choice.id);
                }}
                key={choice.id}
              >
                {choice.language}
              </button>
            ))}
          </section>
          <section
            className={twJoin(
              "flex-0 h-full overflow-scroll overscroll-contain"
            )}
          >
            {language === "Chinese" ? (
              <PlaylistChinese currentlyPlayingAudioFile={audioFile} />
            ) : (
              <PlaylistEnglish currentlyPlayingAudioFile={audioFile} />
            )}
          </section>
        </div>
        {/* <div>
          <div
            className={
              "flex-1 flex items-center justify-between border-t py-2 px-3 " +
              border()
            }
          >
            <h3 className="text-base font-semibold leading-6">Controls</h3>
            <div className="flex flex-1 items-center justify-end">
              <Link
                href={language === "Chinese" ? "/verses/english" : "/"}
                className={button({ class: "block", size: "none" })}
              >
                Switch to {language === "English" ? "Chinese" : "English"}
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </Transition.Root>
  );
}

export const PlaylistButton = (Playlist.Button = function PlaylistButton() {
  const setIsPlaylistOpen = useDaoStore((state) => state.setIsPlaylistOpen);
  const isOpen = useDaoStore((state) => state.isPlaylistOpen);

  return (
    <button
      onClick={() => setIsPlaylistOpen(!isOpen)}
      className={ButtonStyle({
        size: "lg",
        class: "ml-3",
        color: "icon",
      })}
    >
      {isOpen ? (
        <>
          <span className="sr-only">Open playlist</span>
          <XMarkIcon className="w-4 h-4" />
        </>
      ) : (
        <>
          <span className="sr-only">Open playlist</span>
          <Bars3Icon className="w-4 h-4" />
        </>
      )}
    </button>
  );
});
