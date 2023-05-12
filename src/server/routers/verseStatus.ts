import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const verseStatusRouter = createTRPCRouter({
  findMany: protectedProcedure.query(async ({ ctx }) => {
    console.log("ctx.session.user.id", ctx.session.user.id);
    const userId = ctx.session.user.id;

    const verseStatuses = await prisma.verseToUser.findMany({
      where: {
        userId,
      },
    });

    return verseStatuses;
  }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        verseId: z.number(),
        status: z.enum(["reviewing", "learning", "not-learning"]),
      })
    )
    .mutation(async ({ ctx, input: { verseId, status } }) => {
      const userId = ctx.session.user.id;
      const verseToUser = await prisma.verseToUser.upsert({
        where: {
          verseId_userId: {
            verseId,
            userId,
          },
        },
        update: {
          status,
        },
        create: {
          status,
          verseId,
          userId,
        },
      });

      console.log("finishing up");

      return verseToUser;
    }),
});
