import {
  ArrowDownTrayIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useCallback, useEffect, useState } from "react";
import { DAO_CDN_MP3_CACHE } from "../../consts";
import { Spinner } from "../shared/Spinner";
import clsx from "clsx";
import { useDaoStore } from "../../state/store";
import { useMutation } from "@tanstack/react-query";

export function DownloadAudioButton({ audioUrl }: { audioUrl: string }) {
  const cachedAudio = useDaoStore((state) => state.cachedAudio);
  const setAudioCached = useDaoStore((state) => state.setAudioCached);
  const isCached = !!cachedAudio[audioUrl];

  const checkCache = useCallback(async () => {
    const isCached = await checkAudioCached(audioUrl);
    setAudioCached(audioUrl, isCached);
  }, [audioUrl, setAudioCached]);

  useEffect(() => {
    checkCache();
  }, [checkCache]);

  const fetchAudioMutation = useMutation(
    async () => {
      const isCached = await checkAudioCached(audioUrl);
      if (isCached) {
        setAudioCached(audioUrl, true);
        return;
      }
      await fetch(audioUrl);
    },
    {
      onSuccess: () => {
        setAudioCached(audioUrl, true);
      },
      onError: (err) => {
        console.error(err);
      },
    }
  );

  const onClick = () => {
    fetchAudioMutation.mutate();
  };

  const onClearDownloadClick = async () => {
    const cache = await caches.open(DAO_CDN_MP3_CACHE);
    await cache.delete(audioUrl);
    setAudioCached(audioUrl, false);
  };

  if (isCached) {
    return (
      <button onClick={onClearDownloadClick} className="group">
        <CheckIcon className="text-green-500 w-4 h-4 group-hover:hidden" />
        <XMarkIcon className="text-red-500 w-4 h-4 hidden group-hover:block" />
      </button>
    );
  }

  if (fetchAudioMutation.isLoading) {
    return (
      <button className="group">
        <Spinner
          className={clsx(
            "w-5 h-5 mr-2 text-gray-200 dark:text-gray-400 fill-gray-800 dark:fill-gray-600"
          )}
        />
      </button>
    );
  }

  return (
    <button onClick={onClick} type="button">
      <ArrowDownTrayIcon className="w-5 h-5 text-gray-600 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200" />
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
