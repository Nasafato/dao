import "server-only";
import {
  db,
  DbEntryWithDefinitions,
  DefinitionsTable,
  EntriesTable,
} from "@/lib/edgeDb";
import { eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("query");
  console.error("No search term");
  if (!searchTerm) {
    return NextResponse.json({ data: [] });
  }

  console.error("Finding matches");
  const matches = await db
    .select()
    .from(EntriesTable)
    .leftJoin(DefinitionsTable, eq(EntriesTable.id, DefinitionsTable.entryId))
    .where(
      or(
        eq(EntriesTable.simplified, searchTerm),
        eq(EntriesTable.traditional, searchTerm)
      )
    );

  console.error("Grouping matches", matches);
  const matchesByEntryId: Record<number, DbEntryWithDefinitions> = {};
  for (const match of matches) {
    const {
      definitions,
      entries: { id: entryId },
    } = match;
    if (!matchesByEntryId[entryId]) {
      matchesByEntryId[entryId] = { ...match.entries, definitions: [] };
    }
    if (definitions) {
      matchesByEntryId[entryId].definitions.push(definitions);
    }
  }
  const data = Object.values(matchesByEntryId);
  console.error("Returning data", data);

  return NextResponse.json({ data });
}
