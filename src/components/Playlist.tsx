"use client";
import { Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { twJoin } from "tailwind-merge";
import { useDaoStore } from "../state/store";
import { background, border, button } from "../styles";
import { buildAudioFile } from "../utils";
import { PlayPauseButton } from "./primary/AudioPlayer/PlayPauseButton";
import { DownloadAudioButton } from "./primary/DownloadAudioButton";

const verses: Array<{ id: number; title: string }> = [];
for (let i = 0; i < 81; i++) {
  verses.push({
    id: i + 1,
    title: `第${i + 1}章`,
  });
}

export function Playlist() {
  const audioVerseId = useDaoStore((state) => state.audioFile?.verseId);
  const isOpen = useDaoStore((state) => state.isPlaylistOpen);
  const setIsPlaylistOpen = useDaoStore((state) => state.setIsPlaylistOpen);
  const language = useDaoStore((state) => state.playlistLanguage);
  const setPlaylistLanguage = useDaoStore((state) => state.setPlaylistLanguage);

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
              "flex-1 flex items-center justify-between border-b py-1 px-2 " +
              border()
            }
          >
            <h3 className="text-sm font-semibold leading-6">Playlist</h3>
            <button
              type="button"
              className={button({
                color: "icon",
                size: "md",
              })}
              onClick={() => setIsPlaylistOpen(false)}
            >
              <span className="sr-only">Close panel</span>
              <XMarkIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </section>
          <section
            className={
              "flex-1 flex items-center justify-start border-b py-1 px-2 gap-x-2 " +
              border()
            }
          >
            {([{ language: "Chinese" }, { language: "English" }] as const).map(
              (choice) => (
                <button
                  className={`${button()} px-1 ${
                    choice.language === language && "bg-gray-200"
                  }`}
                  onClick={() => {
                    setPlaylistLanguage(choice.language);
                  }}
                  key={choice.language}
                >
                  {choice.language}
                </button>
              )
            )}
          </section>
          <section className={twJoin("flex-0 h-full overflow-scroll")}>
            <div className="">
              <ul>
                {verses.map((v) => (
                  <li
                    key={v.id}
                    className={twJoin(audioVerseId === v.id && "inverse")}
                  >
                    <div
                      className={twJoin(
                        "py-2 px-3 flex items-center gap-x-2",
                        background()
                      )}
                    >
                      <DownloadAudioButton verseId={v.id} />
                      <PlayPauseButton
                        audioFile={buildAudioFile({
                          verseId: v.id,
                          translator: "gou",
                          speaker: "human",
                          language: "chinese",
                        })}
                      />
                      <h5>{v.title}</h5>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
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
      className={button({
        size: "md",
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
