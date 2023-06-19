import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { createTRPCRouter, publicProcedure } from "../trpc";
import UniqueVerseCharsDict from "../../../materials/dictionary/uniqueVerseCharsDict.json";
import UniqueDescriptionCharsDict from "../../../materials/dictionary/uniqueDescriptionCharsDict.json";

export const definitionRouter = createTRPCRouter({
  findOne: publicProcedure
    .input(z.string())
    .query(async ({ input: searchTerm }) => {
      const definitions = await prisma.entry.findMany({
        where: {
          OR: [
            {
              simplified: searchTerm,
            },
            {
              traditional: searchTerm,
            },
          ],
        },
        include: {
          definitions: true,
        },
      });
      return definitions;
    }),

  fetchUniqueCharsDict: publicProcedure
    .input(z.enum(["verse", "description"]))
    .query(async ({ input: type }) => {
      switch (type) {
        case "verse":
          return UniqueVerseCharsDict;
        case "description":
          return UniqueDescriptionCharsDict;
        default:
          throw new Error("Invalid type");
      }
    }),
});
