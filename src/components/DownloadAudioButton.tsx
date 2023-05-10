import {
  ArrowDownTrayIcon,
  //   CheckCircleIcon,
  CheckIcon,
} from "@heroicons/react/20/solid";
import { useCallback, useEffect, useState } from "react";
import { DAO_CDN_MP3_CACHE } from "../consts";

export function DownloadAudioButton({ audioUrl }: { audioUrl: string }) {
  const [isCached, setIsCached] = useState(false);

  const checkCache = useCallback(async () => {
    const isCached = await isAudioCached(audioUrl);
    setIsCached(isCached);
  }, [audioUrl]);

  useEffect(() => {
    checkCache();
  }, [checkCache]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data === "audio-cached") {
        checkCache();
      }
    }

    navigator.serviceWorker.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, [checkCache]);

  const onClick = async () => {
    // await fetch(audioUrl);

    await checkCache();
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

  if (isCached) {
    return (
      <div>
        <CheckIcon className="text-green-500 w-4 h-4" />
      </div>
    );
  }

  return (
    <button onClick={onClick} type="button">
      <ArrowDownTrayIcon className="w-5 h-5 text-gray-800 hover:text-gray-600" />
    </button>
  );
}

async function isAudioCached(audioUrl: string) {
  if (!("caches" in window)) {
    return false;
  }

  const cache = await caches.open(DAO_CDN_MP3_CACHE);
  const cachedResponse = await cache.match(audioUrl);

  return Boolean(cachedResponse);
}