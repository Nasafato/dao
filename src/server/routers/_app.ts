import { createTRPCRouter } from "../trpc";
// import { exampleRouter } from "~/server/api/routers/example";
import { verseStatusRouter } from "./verseStatus";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  verseStatus: verseStatusRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
