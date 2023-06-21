import { z } from "zod";
import { prisma } from "../../lib/db";
import UniqueAllCharsDict from "../../../materials/dictionary/uniqueAllCharsDict.json";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const definitionRouter = createTRPCRouter({
  findOne: publicProcedure
    .input(z.string())
    .query(async ({ input: searchTerm }) => {
      let entries = await prisma.entry.findMany({
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

      return entries;
    }),

  fetchUniqueCharsDict: publicProcedure
    .input(z.enum(["verse", "description", "all"]))
    .query(async ({ input: type }) => {
      switch (type) {
        case "all":
          return UniqueAllCharsDict;
        case "verse":
        case "description":
        default:
          throw new Error("Invalid type");
      }
    }),
});
