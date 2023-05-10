import {
  ArrowDownTrayIcon,
  //   CheckCircleIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useCallback, useEffect, useState } from "react";
import { DAO_CDN_MP3_CACHE } from "../consts";
import { Spinner } from "./Spinner";
import clsx from "clsx";

export function DownloadAudioButton({ audioUrl }: { audioUrl: string }) {
  const [isCached, setIsCached] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const checkCache = useCallback(async () => {
    const isCached = await checkAudioCached(audioUrl);
    setIsCached(isCached);
  }, [audioUrl]);

  useEffect(() => {
    checkCache();
  }, [checkCache]);

  // useEffect(() => {
  //   function handleMessage(event: MessageEvent) {
  //     if (event.data === "audio-cached") {
  //       checkCache();
  //     }
  //   }

  //   navigator.serviceWorker.addEventListener("message", handleMessage);

  //   return () => {
  //     navigator.serviceWorker.removeEventListener("message", handleMessage);
  //   };
  // }, [checkCache]);

  const onClick = async () => {
    const isCached = await checkAudioCached(audioUrl);
    if (isCached) {
      setIsCached(true);
      return;
    }

    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
    }, 10000);
    await fetch(audioUrl);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await checkCache();
    setIsDownloading(false);
    // await fetch(audioUrl);

    // await checkCache();
    // Send a message to the service worker to cache the audio file
    // if (navigator.serviceWorker.controller) {
    //   navigator.serviceWorker.controller.postMessage({
    //     action: "cache-audio",
    //     audioUrl,
    //   });
    // }

    // Wait for the service worker to cache the audio file
    // await navigator.serviceWorker.ready;
    // await checkCache();
  };

  const onClearDownloadClick = async () => {
    const cache = await caches.open(DAO_CDN_MP3_CACHE);
    await cache.delete(audioUrl);
    await checkCache();
  };

  if (isCached) {
    return (
      <button onClick={onClearDownloadClick} className="group">
        <CheckIcon className="text-green-500 w-4 h-4 group-hover:hidden" />
        <XMarkIcon className="text-red-500 w-4 h-4 hidden group-hover:block" />
      </button>
    );
  }

  if (isDownloading) {
    return (
      <button className="group">
        <Spinner
          className={clsx(
            "w-5 h-5 mr-2 text-gray-200 dark:text-gray-600 fill-gray-800"
          )}
        />
      </button>
    );
  }

  return (
    <button onClick={onClick} type="button">
      <ArrowDownTrayIcon className="w-5 h-5 text-gray-800 hover:text-gray-600" />
    </button>
  );
}

async function checkAudioCached(audioUrl: string) {
  if (!("caches" in window)) {
    return false;
  }

  const cache = await caches.open(DAO_CDN_MP3_CACHE);
  const cachedResponse = await cache.match(audioUrl);

  return Boolean(cachedResponse);
}
