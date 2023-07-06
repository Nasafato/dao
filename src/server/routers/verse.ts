import { z } from "zod";
import { DAO_VERSES, DAO_COMBINED } from "@/lib/materials";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";

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

      return DAO_COMBINED[verseId - 1];
    }),
});
