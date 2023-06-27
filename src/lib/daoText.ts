import TRANSLATIONS_COMBINED from "../../materials/translations/translations.json";
import DAO_TEXT from "../fixtures/dao.json";

export const DAO_VERSES = Array.from(DAO_TEXT).map((value, index) => {
  return {
    text: value,
    id: index + 1,
  };
});

import daoCombined from "../../materials/combined.json";
export const DAO_COMBINED = Array.from(daoCombined).map((value, index) => {
  const translations = TRANSLATIONS_COMBINED[index] as unknown as Record<
    string,
    string
  >;
  return {
    translations,
    description: value.description,
  };
});
