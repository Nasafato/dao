import { z } from "zod";
import { DAO_VERSES } from "../../lib/daoText";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const verseRouter = createTRPCRouter({
  findOne: publicProcedure
    .input(z.number())
    .query(async ({ input: verseId }) => {
      if (verseId > 81 || verseId < 1) {
        throw new Error("Verse ID must be between 1 and 81");
      }

      return DAO_VERSES[verseId - 1];
    }),

  findDescription: publicProcedure
    .input(z.number())
    .query(async ({ input: verseId }) => {
      if (verseId > 81 || verseId < 1) {
        throw new Error("Verse ID must be between 1 and 81");
      }

      const res = await import("../../../materials/dao-combined.json");
      const daoCombined = DaoVersesIndex.parse(res.default);
      const description = daoCombined[verseId - 1].description;
      const translations = translationsSchema.parse(
        (
          await import(
            `../../../materials/translations/${
              verseId < 10 ? "0" + verseId : verseId
            }.json`
          )
        ).default
      );

      return {
        translations,
        description,
      };
    }),
});

const translationsSchema = z.object({
  legge: z.string(),
  susuki: z.string(),
  goddard: z.string(),
});

export type DaoVerseType = z.infer<typeof DaoVerse>;
export const DaoVerse = z.object({
  text: z.string(),
  description: z.string(),
  index: z.number(),
});

const DaoVersesIndex = z.array(DaoVerse);
