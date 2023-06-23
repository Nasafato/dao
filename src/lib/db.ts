import { PrismaClient } from "@prisma/client";
import { InferModel } from "drizzle-orm";
import { integer, pgTable, real, serial, text } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const entries = pgTable("entries", {
  id: serial("id").primaryKey(),
  pronunciation: text("pronunciation").notNull(),
  simplified: text("simplified").notNull(),
  traditional: text("traditional").notNull(),
  relevancy: real("relevancy").notNull(),
});

export const definitions = pgTable("definitions", {
  id: serial("id").primaryKey(),
  entryId: integer("entry_id")
    .references(() => entries.id)
    .notNull(),
  definition: text("definition").notNull(),
  relevancy: real("relevancy").notNull(),
});

const queryClient = postgres(process.env.POSTGRES_PRISMA_URL ?? "");
export const db = drizzle(queryClient);

export type DbEntry = InferModel<typeof entries>;
export type DbDefinition = InferModel<typeof definitions>;
