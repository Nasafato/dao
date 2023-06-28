"use client";
import { Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { twJoin } from "tailwind-merge";
import { useDaoStore } from "../state/store";
import { background, border, button } from "../styles";
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
  const audioVerseId = useDaoStore((state) => state.audioVerseId);
  const isOpen = useDaoStore((state) => state.isPlaylistOpen);
  const setIsPlaylistOpen = useDaoStore((state) => state.setIsPlaylistOpen);

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
          <div
            className={
              "flex-1 flex items-start justify-between border-b py-2 px-3 " +
              border()
            }
          >
            <h3 className="text-base font-semibold leading-6">Playlist</h3>
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
          </div>
          <div className={twJoin("flex-0 h-full overflow-scroll")}>
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
                      <PlayPauseButton verseId={v.id} />
                      <h5>{v.title}</h5>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
