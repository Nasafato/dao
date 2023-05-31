import { useRef, useMemo, useState, useEffect } from "react";
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
