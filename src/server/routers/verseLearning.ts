import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { DATE_CONSTS } from "../../consts";

export const verseLearningRouter = createTRPCRouter({
  recordTest: protectedProcedure
    .input(
      z.object({
        time: z.number(),
        verseId: z.number(),
        result: z.enum(["success", "failure"]),
      })
    )
    .mutation(async ({ ctx, input: { verseId, ...input } }) => {
      const userId = ctx.session.user.id;
      await prisma.verseMemoryTest.create({
        data: {
          createdAt: new Date(input.time),
          userId,
          verseId,
          result: input.result,
        },
      });

      const memoryTests = await prisma.verseMemoryTest.findMany({
        where: {
          verseId,
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      let numSuccesses = 0;
      for (const memoryTest of memoryTests) {
        if (memoryTest.result !== "success") {
          break;
        }
        numSuccesses++;
      }

      // Next review should be max(0.25, numSuccess^1.8) hours from now.
      const nextReview = new Date(
        Date.now() +
          Math.max(
            Math.max(0.25, Math.pow(1.8, numSuccesses)) * 60 * 60 * 1000,
            DATE_CONSTS.ONE_MONTH
          )
      );

      const result = await prisma.verseToUser.upsert({
        where: {
          verseId_userId: {
            userId: ctx.session.user.id,
            verseId,
          },
        },
        update: {
          status: "learning",
          nextReview,
        },
        create: {
          userId: ctx.session.user.id,
          verseId,
          status: "learning",
          nextReview,
        },
      });

      return result;
    }),
});
