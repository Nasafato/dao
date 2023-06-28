import { VerseCombined, VerseTranslation } from "../../types/materials";

const TRANSLATIONS_COMBINED: VerseTranslation[] = require("../../materials/translations/translations.json");
const DAO_TEXT: string[] = require("../../materials/verses/dao.json");

export { TRANSLATIONS_COMBINED };
export const DAO_VERSES = Array.from(DAO_TEXT).map((value, index) => {
  return {
    text: value,
    id: index + 1,
  };
});

const daoCombined: VerseCombined[] = require("../../materials/combined.json");
export const DAO_COMBINED = daoCombined;
