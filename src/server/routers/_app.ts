import { createTRPCRouter } from "../trpc";
import { verseLearningRouter } from "./verseLearning";
// import { exampleRouter } from "~/server/api/routers/example";
import { verseStatusRouter } from "./verseStatus";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  verseStatus: verseStatusRouter,
  verseLearning: verseLearningRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
