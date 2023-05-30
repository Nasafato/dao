import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "../../lib/prisma";

export const definitionRouter = createTRPCRouter({
  findOne: publicProcedure
    .input(z.string())
    .query(async ({ input: searchTerm }) => {
      const characters = await prisma.character.findMany({
        where: {
          OR: [
            {
              character: searchTerm,
            },
            {
              spellingVariants: {
                some: {
                  variant: searchTerm,
                },
              },
            },
          ],
        },
        include: {
          spellingVariants: true,
          pronunciationVariants: {
            include: {
              definitions: true,
            },
          },
        },
      });

      if (characters.length === 0) {
        throw new Error("No results found");
      }

      return characters[0];
    }),
});
