import { useEffect, useState } from "react";

export function DownloadAudioButton({ src }: { src: string }) {
  const [isCached, setIsCached] = useState(false);
  useEffect(() => {
    const checkCache = async () => {
      const isCached = await isAudioCached(src);
      setIsCached(isCached);
    };
    checkCache();
  }, [src]);

  if (isCached) {
    return <div>Downloaded</div>;
  }

  const onClick = () => {
    fetch(src);
  };

  return <button onClick={onClick}>Download</button>;
}

async function isAudioCached(audioUrl: string) {
  if (!("caches" in window)) {
    return false;
  }

  const cacheName = "static-audio-assets"; // Replace with the name of the cache you used in the service worker
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(audioUrl);

  return Boolean(cachedResponse);
}
