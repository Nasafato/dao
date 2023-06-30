import {
  ArrowDownTrayIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useCallback, useEffect, useState } from "react";
import { DAO_CDN_MP3_CACHE } from "../../consts";
import { Spinner } from "../shared/Spinner";
import { useDaoStore } from "../../state/store";
import { useMutation } from "@tanstack/react-query";
import { buildVerseMediaSourceUrl } from "../../utils";
import { button } from "../../styles";
import { AudioFile } from "../../../types/materials";

export function DownloadAudioButton({ audioFile }: { audioFile: AudioFile }) {
  const audioUrl = audioFile.url;
  const cachedAudio = useDaoStore((state) => state.cachedAudio);
  const setAudioCached = useDaoStore((state) => state.setAudioCached);
  const isAudioCached = useDaoStore((state) => state.cachedAudio[audioUrl]);
  const isCached = !!cachedAudio[audioUrl];

  const checkCache = useCallback(async () => {
    const isCached = await checkAudioCached(audioUrl);
    setAudioCached(audioUrl, isCached);
  }, [audioUrl, setAudioCached]);

  useEffect(() => {
    checkCache();
  }, [checkCache, isAudioCached]);

  const fetchAudioMutation = useMutation(
    async () => {
      const isCached = await checkAudioCached(audioUrl);
      if (isCached) {
        setAudioCached(audioUrl, true);
        return;
      }
      await fetch(audioUrl, {
        mode: "no-cors",
      });
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
        <CheckIcon
          className={button({
            size: "md",
            color: "green",
            class: "group-hover:hidden",
          })}
        />
        <XMarkIcon
          className={button({
            size: "md",
            color: "red",
            class: "hidden group-hover:block",
          })}
        />
      </button>
    );
  }

  if (fetchAudioMutation.isLoading) {
    return (
      <button className="group">
        <Spinner
          className={button({
            size: "md",
            color: "secondary",
            class: "fill-gray-800",
          })}
        />
      </button>
    );
  }

  return (
    <button onClick={onClick} type="button">
      <ArrowDownTrayIcon
        className={button({ color: "secondary", size: "md" })}
        // className="w-5 h-5 text-gray-600 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200" />
      />
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

let audioCacheCheckInterval: number;
export const audioBeingCached = new Map<
  string,
  {
    checking: boolean;
    timesChecked: number;
  }
>();

export function checkForAudio(audioUrl: string) {
  audioBeingCached.set(audioUrl, {
    checking: true,
    timesChecked: 0,
  });

  audioCacheCheckInterval = window.setInterval(async () => {
    if (audioBeingCached.size === 0) {
      clearInterval(audioCacheCheckInterval);
      return;
    }
    for (const [audioUrl, cacheInfo] of audioBeingCached.entries()) {
      if (cacheInfo.timesChecked > 10) {
        audioBeingCached.delete(audioUrl);
        continue;
      }
      const isCached = await checkAudioCached(audioUrl);
      if (isCached) {
        audioBeingCached.delete(audioUrl);
        useDaoStore.setState((state) => ({
          cachedAudio: {
            ...state.cachedAudio,
            [audioUrl]: true,
          },
        }));
      }
    }
    await checkAudioCached(audioUrl);
  }, 500);
}
