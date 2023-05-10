import { useCallback, useEffect, useState } from "react";

export function DownloadAudioButton({ audioUrl }: { audioUrl: string }) {
  const [isCached, setIsCached] = useState(false);
  const checkCache = useCallback(async () => {
    const isCached = await isAudioCached(audioUrl);
    setIsCached(isCached);
  }, [audioUrl]);

  useEffect(() => {
    checkCache();
  }, [checkCache]);

  const onClick = async () => {
    await fetch(audioUrl);
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

  const cacheName = "cross-origin"; // Replace with the name of the cache you used in the service worker
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(audioUrl);

  return Boolean(cachedResponse);
}
