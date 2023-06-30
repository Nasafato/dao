import { InferModel } from "drizzle-orm";
import { integer, pgTable, real, serial, text } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";

export const EntriesTable = pgTable("entries", {
  id: serial("id").primaryKey(),
  pronunciation: text("pronunciation").notNull(),
  simplified: text("simplified").notNull(),
  traditional: text("traditional").notNull(),
  relevancy: real("relevancy").notNull(),
});

export const DefinitionsTable = pgTable("definitions", {
  id: serial("id").primaryKey(),
  entryId: integer("entry_id")
    .references(() => EntriesTable.id)
    .notNull(),
  definition: text("definition").notNull(),
  relevancy: real("relevancy").notNull(),
});

export const db = drizzle(sql);

export type DbEntry = InferModel<typeof EntriesTable>;
export type DbEntryWithDefinitions = DbEntry & {
  definitions: DbDefinition[];
};
export type DbDefinition = InferModel<typeof DefinitionsTable>;
