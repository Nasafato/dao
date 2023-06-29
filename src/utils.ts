import { Definition, Entry } from "@prisma/client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AudioFile,
  AudioFileInput,
  DenormalizedDictSchema,
  Languages,
  NormalizedDict,
  Translators,
} from "../types/materials";
import { CDN_URL } from "./consts";

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

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function buildAudioFile(input: AudioFileInput): AudioFile {
  const { verseId, speaker, translator, language } = input;
  const verseIdStr = verseId < 10 ? "0" + verseId : verseId;
  let url;
  let title;
  if (input.language === "english") {
    if (!translator) {
      throw new Error("English requires a translator.");
    }
    url = `${CDN_URL}/${speaker}-${verseIdStr}-${language}-${translator}`;
    title = `Verse ${verseId} [English - ${capitalize(translator)}]`;
  } else {
    url = `${CDN_URL}/${speaker}-${verseIdStr}-${language}.mp3`;
    title = `第${verseId}章`;
  }

  return {
    ...input,
    url,
    title,
  };
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

function compareInputs<T>(
  inputKeys: string[],
  oldInputs: Record<string, T>,
  newInputs: Record<string, T>
) {
  inputKeys.forEach((key) => {
    const oldInput = oldInputs[key];
    const newInput = newInputs[key];
    if (oldInput !== newInput) {
      console.log(`Input ${key} changed from ${oldInput} to ${newInput}`);
    }
  });
}

export function useDependenciesDebugger<T>(inputs: Record<string, T>) {
  const oldInputsRef = useRef(inputs);
  const inputValuesArray = Object.values(inputs);
  const inputKeysArray = Object.keys(inputs);
  useMemo(() => {
    const oldInputs = oldInputsRef.current;
    compareInputs(inputKeysArray, oldInputs, inputs);

    oldInputsRef.current = inputs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputValuesArray);
}

function parseQueryParam(query: string) {
  const params = new URLSearchParams(query.slice(1));
  return params.get("query");
}

export function useQueryParam(key: string) {
  const [query, setQuery] = useState<string | null>(null);
  useEffect(() => {
    const listener = () => {
      const location = window.location;
      const query = parseQueryParam(location.search);
      // console.log("popstate query", query);
      setQuery(query);
    };
    window.addEventListener("popstate", listener);

    return () => {
      window.removeEventListener("popstate", listener);
    };
  }, [key]);

  useEffect(() => {
    const location = window.location;
    const query = parseQueryParam(location.search);
    setQuery(query);
    // console.log("initial query", query);
  }, []);

  return query;
}

export function sortEntriesByRelevancy(
  entries: Array<Entry & { definitions: Definition[] }>
) {
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
  const entries: Record<string, Entry & { definitions: Definition[] }> = {};
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
