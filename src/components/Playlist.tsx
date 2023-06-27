"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useDaoStore } from "../state/store";
import { twJoin } from "tailwind-merge";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { background, border, button, verticalSpacing } from "../styles";
import { convertNumberToChinese } from "../serverUtils";
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
          "absolute bottom-[3.5rem] right-0 w-[300px] h-[400px] shadow-xl flex flex-col",
          "border",
          border(),
          background()
        )}
      >
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
    </Transition.Root>
  );
}

export function AdfasdfPlaylist() {
  const isOpen = useDaoStore((state) => state.isPlaylistOpen);
  const setIsPlaylistOpen = useDaoStore((state) => state.setIsPlaylistOpen);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={twJoin(
          "relative z-10",
          // "border border-red-500",
          ""
        )}
        onClose={setIsPlaylistOpen}
      >
        <div
          className={twJoin(
            "fixed inset-0 top-10",
            // "border-purple-500 border-2",
            "bottom-14 top-12"
          )}
        />
        <div
          className={twJoin(
            "fixed inset-0 overflow-hidden",
            // "border-blue-500 border-2",
            "bottom-14 top-12"
          )}
        >
          <div
            className={twJoin(
              "absolute inset-0 overflow-hidden",
              // "border-orange-600 border-2",
              ""
            )}
          >
            <div
              className={twJoin(
                "pointer-events-none fixed right-0 flex max-w-full pl-10",
                // "border-green-600 border-2",
                "bottom-14 top-12"
              )}
            >
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-[16rem]">
                  <div
                    className={twJoin(
                      "flex h-full flex-col overflow-y-scroll bg-white py-4 shadow-xl border-l",
                      border()
                    )}
                  >
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Playlist
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className={button({
                              color: "icon",
                              size: "md",
                            })}
                            // className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setIsPlaylistOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <ul>
                        {verses.map((v) => (
                          <li
                            key={v.id}
                            className="py-1 flex items-center gap-x-2"
                          >
                            <div>
                              <PlayPauseButton verseId={v.id} />
                            </div>
                            <h5>{v.title}</h5>
                            <div>
                              <DownloadAudioButton verseId={v.id} />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
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
