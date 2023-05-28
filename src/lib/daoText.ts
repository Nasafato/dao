import DAO_TEXT from "../fixtures/dao.json";
import { z } from "zod";
import DAO_COMBINED from "../../materials/dao-combined.json";
import TRANSLATIONS_COMBINED from "../../materials/translations/combined-translations.json";

// const translationsSchema = z.object({
//   legge: z.string(),
//   susuki: z.string(),
//   goddard: z.string(),
// });

// export type DaoVerseType = z.infer<typeof DaoVerse>;
// export const DaoVerse = z.object({
//   text: z.string(),
//   description: z.string(),
//   index: z.number(),
// });

// const DaoVersesIndex = z.array(DaoVerse);

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

//   const res = await import("../../../materials/dao-combined.json");
//   const daoCombined = DaoVersesIndex.parse(res.default);
//   const description = daoCombined[verseId - 1].description;
//   const translations = translationsSchema.parse(
//     (
//       await import(
//         `../../../materials/translations/${
//           verseId < 10 ? "0" + verseId : verseId
//         }.json`
//       )
//     ).default
//   );

//   return {
//     translations,
//     description,
//   };
// }),
