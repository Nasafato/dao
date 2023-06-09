import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { createTRPCRouter, publicProcedure } from "../trpc";

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
});
