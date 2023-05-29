import { CDN_URL } from "./consts";

export function tryParseDaoIndex(i: unknown) {
  const result = Number.parseInt(i as string, 10);
  if (Number.isNaN(result)) {
    return null;
  }

  if (result > 81 || result < 1) {
    return null;
  }

  return result;
}

export function forceQueryParamString(param: string | string[] | undefined) {
  if (Array.isArray(param)) {
    return param.join(",");
  }

  return param;
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function buildVerseMediaSourceUrl(
  verseId: number,
  options: { type: "human" | "generated" } = { type: "human" }
) {
  const type = options.type === "human" ? "human" : "generated";
  return `${CDN_URL}/${type}${verseId < 10 ? "0" + verseId : verseId}.mp3`;
}
