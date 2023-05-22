import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { DAO_VERSES } from "../../lib/daoText";

export const verseRouter = createTRPCRouter({
  findOne: publicProcedure
    .input(z.number())
    .query(async ({ input: verseId }) => {
      if (verseId > 81 || verseId < 1) {
        throw new Error("Verse ID must be between 1 and 81");
      }

      return DAO_VERSES[verseId - 1];
    }),
});
