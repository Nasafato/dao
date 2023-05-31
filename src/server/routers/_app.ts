import { inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter } from "../trpc";
import { verseRouter } from "./verse";
// import { exampleRouter } from "~/server/api/routers/example";
import { definitionRouter } from "./definition";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  definition: definitionRouter,
  verse: verseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export type RouterOutput = inferRouterOutputs<AppRouter>;

export type DescriptionOutput = RouterOutput["verse"]["findDescription"];
export type DefinitionOutput = RouterOutput["definition"]["findOne"];
