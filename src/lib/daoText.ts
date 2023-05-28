import DAO_TEXT from "../fixtures/dao.json";
import { z } from "zod";
import DAO_COMBINED from "../../materials/dao-combined.json";
import TRANSLATIONS_COMBINED from "../../materials/translations/combined-translations.json";

export const DAO_VERSES = Array.from(DAO_TEXT).map((value, index) => {
  return {
    text: value,
    id: index + 1,
  };
});

export const DAO_COMBINED_VERSES = Array.from(DAO_COMBINED).map(
  (value, index) => {
    const translations = TRANSLATIONS_COMBINED[index];
    return {
      translations,
      description: value.description,
    };
  }
);
