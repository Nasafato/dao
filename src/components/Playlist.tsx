"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useDaoStore } from "../state/store";
import { twJoin } from "tailwind-merge";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { button } from "../styles";

export function Playlist() {
  const isOpen = useDaoStore((state) => state.isPlaylistOpen);
  const setIsPlaylistOpen = useDaoStore((state) => state.setIsPlaylistOpen);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={twJoin(
          "relative z-10"
          // "border border-red-500"
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
              "absolute inset-0 overflow-hidden"
              // "border-orange-600 border-2"
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
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Panel title
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
                      {/* Your content */}
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
