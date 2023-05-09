import { useEffect, useState } from "react";

export function DownloadAudioButton({ src }: { src: string }) {
  const [isCached, setIsCached] = useState(false);
  const fileName = src.split("/").pop() || "";
  useEffect(() => {
    const checkCache = async () => {
      const isCached = await isAudioCached(fileName);
      setIsCached(isCached);
    };
    checkCache();
  }, [fileName]);

  const onClick = () => {
    fetch(src);
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
