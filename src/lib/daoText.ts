import DAO_COMBINED from "../../materials/combined.json";
import TRANSLATIONS_COMBINED from "../../materials/translations/translations.json";
import DAO_TEXT from "../fixtures/dao.json";

export const DAO_VERSES = Array.from(DAO_TEXT).map((value, index) => {
  return {
    text: value,
    id: index + 1,
  };
});

export const DAO_COMBINED_VERSES = Array.from(DAO_COMBINED).map(
  (value, index) => {
    const translations = TRANSLATIONS_COMBINED[index] as unknown as Record<
      string,
      string
    >;
    return {
      translations,
      description: value.description,
    };
  }
);
