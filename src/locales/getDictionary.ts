import { Dict } from "@/types";
import "server-only";

const dictionaries: Record<string, () => Promise<Dict>> = {
  en: () => import("./en.json").then((module) => module.default),
  zh: () => import("./zh.json").then((module) => module.default),
};

export async function getDictionary(locale: string) {
  if (locale in dictionaries) {
    return dictionaries[locale]();
  }

  const keys = Object.keys(dictionaries);
  for (const key of keys) {
    if (locale.startsWith(key)) {
      return dictionaries[key]();
    }
  }

  throw new Error(`No dictionary found for locale ${locale}`);
}
