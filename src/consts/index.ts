export const punctuation = `　。、「」【】：，？﹖； () ﹕ ！ ﹗ （ ）`;

export const descriptiveVideos = {
  "1": ["https://www.youtube.com/watch?v=Qn7DrXcqOGI"],
  "15": ["https://www.youtube.com/watch?v=GNZKZBdgdQ8"],
};

// export const CDN_URL = "https://daodejing.b-cdn.net";
export const CDN_URL = "https://dao-worker.daodejing.workers.dev";

export const DAO_CDN_MP3_CACHE = "dao-cdn-mp3";

export const DATE_CONSTS = {
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
  ONE_MONTH: 30 * 24 * 60 * 60 * 1000,
  ONE_YEAR: 365 * 24 * 60 * 60 * 1000,
} as const;
