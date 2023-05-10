import { useCallback, useEffect, useState } from "react";

export function DownloadAudioButton({ audioUrl }: { audioUrl: string }) {
  const [isCached, setIsCached] = useState(false);

  const checkCache = useCallback(async () => {
    const isCached = await isAudioCached(audioUrl);
    setIsCached(isCached);
  }, [audioUrl]);

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

    // Send a message to the service worker to cache the audio file
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        action: "cache-audio",
        audioUrl,
      });
    }

    // Wait for the service worker to cache the audio file
    await navigator.serviceWorker.ready;
    await checkCache();
  };

  if (isCached) {
    return <div>Downloaded</div>;
  }

  return (
    <button onClick={onClick} type="button">
      Download
    </button>
  );
}

async function isAudioCached(audioUrl: string) {
  if (!("caches" in window)) {
    return false;
  }

  const cacheName = "cross-origin-dao-audio-assets"; // Replace with the name of the cache you used in the service worker
  const cache = await caches.open(cacheName);
  console.log("cache", cache);
  console.log("keys", await cache.keys());
  const cachedResponse = await cache.match(audioUrl);
  console.log("cachd response", cachedResponse);

  return Boolean(cachedResponse);
}
