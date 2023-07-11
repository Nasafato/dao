import {
  AudioFile,
  AudioFileInput,
  DenormalizedDictSchema,
  Languages,
  NormalizedDict,
  Translators,
  buildAudioFileName,
} from "types/materials";
import { CDN_URL } from "./consts";
import { DbEntryWithDefinitions } from "./lib/edgeDb";

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function tryParseDaoIndex(i: unknown) {
  const result = Number(i);
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

export function buildAudioFile(input: AudioFileInput): AudioFile {
  const { verseId, translator } = input;
  const audioName = buildAudioFileName(input);
  let title;
  const url = `${CDN_URL}/${audioName}.mp3`;
  if (input.language === "english") {
    if (!translator) {
      throw new Error("English requires a translator.");
    }
    title = `Verse ${verseId}`;
  } else {
    title = `第${verseId}章`;
  }

  return {
    ...input,
    audioName,
    url,
    title,
  };
}

export function audioFilesEqual(a: AudioFile, b: AudioFile) {
  return a.url === b.url;
}

export function buildVerseMediaSourceUrl(
  verseId: number,
  options: {
    type: "human" | "generated";
    language: (typeof Languages)[number];
    translator?: (typeof Translators)[number];
  } = {
    type: "human",
    translator: "gou",
    language: "chinese",
  }
) {
  const type = options.type === "human" ? "human" : "generated";
  if (options.language === "chinese") {
    return `${CDN_URL}/${type}${verseId < 10 ? "0" + verseId : verseId}.mp3`;
  }

  let translator = options.translator ?? "gou";
  if (translator === "gou" && verseId > 3) {
    translator = "goddard";
  }

  return `${CDN_URL}/${type}-${verseId < 10 ? "0" + verseId : verseId}-${
    options.translator
  }-${options.language}`;
}

export function dedupe<T, K>(array: T[], predicate: (item: T) => K): T[] {
  const seen = new Map<K, T>();
  for (const item of array) {
    const key = predicate(item);
    if (seen.has(key)) {
      continue;
    }

    seen.set(key, item);
  }

  return Array.from(seen.values());
}

export function buildPinyinWithTones(pinyin: string) {
  const toneMap = {
    a: ["ā", "á", "ǎ", "à", "a"],
    e: ["ē", "é", "ě", "è", "e"],
    i: ["ī", "í", "ǐ", "ì", "i"],
    o: ["ō", "ó", "ǒ", "ò", "o"],
    u: ["ū", "ú", "ǔ", "ù", "u"],
    v: ["ǖ", "ǘ", "ǚ", "ǜ", "ü"],
  };

  const tone = parseInt(pinyin.slice(-1)) - 1;
  let toneless = pinyin.slice(0, -1);

  if (toneless.indexOf("iu") !== -1) {
    toneless = toneless.replace("u", toneMap["u"][tone]);
  } else {
    for (let vowel of ["a", "o", "e", "i", "u", "v"] as const) {
      if (toneless.indexOf(vowel) !== -1) {
        toneless = toneless.replace(vowel, toneMap[vowel][tone]);
        break;
      }
    }
  }

  return toneless;
}

export function replaceNumericalPinyin(str: string) {
  const toneRegex = /(\w+\d)/g;

  return str.replace(toneRegex, function (match) {
    return buildPinyinWithTones(match);
  });
}

// console.log(replaceNumericalPinyin("CL:塊|块[kuai4]")); // Outputs: CL:塊|块[kuài]

export function parseQueryParam(query: string) {
  const params = new URLSearchParams(query.slice(1));
  return params.get("query");
}

export function sortEntriesByRelevancy(entries: Array<DbEntryWithDefinitions>) {
  return entries
    .sort((a, b) => {
      return b.relevancy - a.relevancy;
    })
    .map((entry) => {
      return {
        ...entry,
        definitions: entry.definitions.sort((a, b) => {
          return b.relevancy - a.relevancy;
        }),
      };
    });
}

export function findMatchingEntries(dict: NormalizedDict, char: string) {
  const entries = [];
  for (let i = 0; i < dict.length; i++) {
    const entry = dict[i];
    if (entry.simplified === char || entry.traditional === char) {
      entries.push(entry);
    }
  }
  return entries;
}

export function normalizeDict(dict: DenormalizedDictSchema) {
  const entries: Record<string, DbEntryWithDefinitions> = {};
  for (let i = 0; i < dict.id.length; i++) {
    const entryId = dict.id[i];
    entries[entryId] = {
      id: entryId,
      relevancy: dict.relevancy[i],
      simplified: dict.simplified[i],
      traditional: dict.traditional[i],
      pronunciation: dict.pronunciation[i],
      definitions: [],
    };
  }
  for (let i = 0; i < dict.definitions.entryId.length; i++) {
    const entryId = dict.definitions.entryId[i];
    const id = dict.definitions.id[i];
    const definition = dict.definitions.definition[i];
    const relevancy = dict.definitions.relevancy[i];
    entries[entryId].definitions.push({
      id,
      entryId,
      definition,
      relevancy,
    });
  }

  return Object.values(entries);
}

export const LanguageDisplayMap: Readonly<
  Record<(typeof Languages)[number], string>
> = {
  chinese: "中文",
  english: "English",
} as const;

export function getNestedValue(obj: any, str: string) {
  const parts = str.split(".");

  const getValue = (obj: any, path: string[]): unknown => {
    if (path.length === 0) {
      return obj;
    }

    return getValue(obj[path[0]], path.slice(1));
  };

  return getValue(obj, parts);
}

export function computeUniqueChars(text: string) {
  const map: Record<string, boolean> = {};
  for (const char of text) {
    map[char] = true;
  }
  const uniqueChars = Object.keys(map).join("");
  return uniqueChars;
}

export function convertNumberToChinese(number: number) {
  // Support 1 through 99
  const numbers = [
    "零",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
    "十",
  ] as const;
  if (number < 11) {
    return numbers[number];
  }
  const tens = Math.floor(number / 10);
  const remainder = number % 10;
  return `${tens === 1 ? "" : numbers[tens]}十${
    remainder === 0 ? "" : numbers[remainder]
  }`;
}

export function padVerseId(verseId: string | number) {
  let verseIdNumber;
  if (typeof verseId === "string") {
    verseIdNumber = Number(verseId);
  } else {
    verseIdNumber = verseId;
  }

  return `${verseIdNumber < 10 ? "0" : ""}${verseIdNumber}`;
}
