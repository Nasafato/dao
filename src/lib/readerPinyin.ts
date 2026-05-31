import "server-only";

import { punctuation } from "@/consts";
import type { VersePinyin } from "@/types";
import UniqueAllCharsDict from "materials/dictionary/uniqueAllCharsDict.json";

type PinyinEntry = {
  pinyin: string;
  relevancy: number;
};

const toneMarks = {
  a: ["ā", "á", "ǎ", "à"],
  e: ["ē", "é", "ě", "è"],
  i: ["ī", "í", "ǐ", "ì"],
  o: ["ō", "ó", "ǒ", "ò"],
  u: ["ū", "ú", "ǔ", "ù"],
  v: ["ǖ", "ǘ", "ǚ", "ǜ"],
} as const;

type ToneVowel = keyof typeof toneMarks;

const pinyinByChar = buildPinyinByChar();

export function buildVersePinyin(text: string): VersePinyin {
  const pinyin: VersePinyin = [];

  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    pinyin.push(canShowPinyin(char) ? pinyinByChar.get(char) ?? null : null);
  }

  return pinyin;
}

function buildPinyinByChar() {
  const map = new Map<string, PinyinEntry>();

  for (let index = 0; index < UniqueAllCharsDict.id.length; index++) {
    const entry = {
      pinyin: numberedPinyinToToneMarks(
        UniqueAllCharsDict.pronunciation[index]
      ),
      relevancy: UniqueAllCharsDict.relevancy[index],
    };

    setBestPinyin(map, UniqueAllCharsDict.simplified[index], entry);
    setBestPinyin(map, UniqueAllCharsDict.traditional[index], entry);
  }

  return new Map(
    Array.from(map.entries()).map(([char, entry]) => [char, entry.pinyin])
  );
}

function setBestPinyin(
  map: Map<string, PinyinEntry>,
  char: string,
  entry: PinyinEntry
) {
  const existing = map.get(char);
  if (!existing || entry.relevancy > existing.relevancy) {
    map.set(char, entry);
  }
}

function canShowPinyin(char: string) {
  return !!char.trim() && !punctuation.includes(char);
}

function numberedPinyinToToneMarks(pinyin: string) {
  return pinyin
    .toLowerCase()
    .replace(/([a-züv:]+)([1-5])/g, (_match, syllable, tone) => {
      return applyToneMark(syllable, Number(tone));
    });
}

function applyToneMark(syllable: string, tone: number) {
  const normalized = syllable.replace("u:", "v").replace("ü", "v");
  if (tone === 5) return normalized.replaceAll("v", "ü");

  const toneIndex = tone - 1;
  const target =
    findToneTarget(normalized, "a") ??
    findToneTarget(normalized, "e") ??
    findOuToneTarget(normalized) ??
    findLastToneVowel(normalized);

  if (target === null) return normalized.replaceAll("v", "ü");

  return (
    normalized.slice(0, target) +
    toneMarks[normalized[target] as ToneVowel][toneIndex] +
    normalized.slice(target + 1)
  ).replaceAll("v", "ü");
}

function findToneTarget(syllable: string, vowel: ToneVowel) {
  const index = syllable.indexOf(vowel);
  return index === -1 ? null : index;
}

function findOuToneTarget(syllable: string) {
  return syllable.includes("ou") ? syllable.indexOf("o") : null;
}

function findLastToneVowel(syllable: string) {
  for (let index = syllable.length - 1; index >= 0; index--) {
    if (isToneVowel(syllable[index])) return index;
  }
  return null;
}

function isToneVowel(char: string): char is ToneVowel {
  return char in toneMarks;
}
