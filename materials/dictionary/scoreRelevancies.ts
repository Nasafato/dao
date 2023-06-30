import { SQL, inArray, or, sql } from "drizzle-orm";
import {
  DbDefinition,
  DbEntry,
  db,
  DefinitionsTable,
  EntriesTable,
} from "../../src/lib/edgeDb";
import { benchmark, processLines, withStdinStdout } from "../cliUtils";

type EntryRelevance = {
  id: number;
  relevancy: number;
  numDefinitions: number;
};

type DefinitionRelevance = {
  id: number;
  relevancy: number;
};

function findMatches<T>(arr: T[], pred: (t: T) => boolean) {
  const matches: T[] = [];
  for (const t of arr) {
    if (pred(t)) matches.push(t);
  }
  return matches;
}

async function accumulateUpdatesForChar(
  searchTerm: string,
  dbDefs: DbDefinition[],
  dbEntries: DbEntry[]
) {
  // Really, the entry relevance should be a score normalized by the number of definitions it has.
  // First, all definitions that aren't proper nouns or "variants of" should be given a score of 1.
  // Otherwise, the score of the definition is 0.

  const entries = findMatches(
    dbEntries,
    (e) => e.simplified === searchTerm || e.traditional === searchTerm
  );
  const entryRelevances: EntryRelevance[] = [];
  const definitionRelevances: DefinitionRelevance[] = [];
  let totalDefinitions = 0;
  for (const entry of entries) {
    // If first character is capitalized, it's a proper noun.
    const isProperNoun =
      entry.pronunciation[0] === entry.pronunciation[0].toUpperCase();
    const baseRelevance = isProperNoun ? -1 : 0;
    const entryRelevance = {
      id: entry.id,
      relevancy: baseRelevance,
      numDefinitions: 0,
    };

    const matchingDefs = findMatches(dbDefs, (d) => d.entryId === entry.id);
    for (const def of matchingDefs) {
      if (def.definition.includes("variant of")) {
        definitionRelevances.push({
          id: def.id,
          relevancy: -1,
        });
      } else if (def.definition.includes("CL:")) {
        definitionRelevances.push({
          id: def.id,
          relevancy: 1,
        });
      }
    }
    entryRelevance.numDefinitions += matchingDefs.length;
    totalDefinitions += matchingDefs.length;
    entryRelevances.push(entryRelevance);
  }
  // Decent heuristic, I hope.
  for (let i = 0; i < entryRelevances.length; i++) {
    const entry = entryRelevances[i];
    entry.relevancy += entry.numDefinitions / totalDefinitions;
  }

  return {
    entryRelevances,
    definitionRelevances,
  };
}

function generateValues(updates: { id: number; relevancy: number }[]) {
  const valChunks = updates.map(
    (u) => sql`(${u.id}::int, ${u.relevancy}::real)`
  );
  const finalVal = sql.join(valChunks, sql.raw(","));
  return finalVal;
}

function createEntriesUpdateSql(values: SQL) {
  const createSql = sql`
  WITH vals (id, relevancy) AS (VALUES ${values})
  UPDATE ${EntriesTable}
  SET ${sql.raw(EntriesTable.relevancy.name)} = vals.relevancy
  FROM vals
  WHERE ${EntriesTable.id} = vals.id;
`;
  return createSql;
}

function createDefinitionsUpdateSql(values: SQL) {
  const createSql = sql`
  WITH vals (id, relevancy) AS (VALUES ${values})
  UPDATE ${DefinitionsTable}
  SET ${sql.raw(DefinitionsTable.relevancy.name)} = vals.relevancy
  FROM vals
  WHERE ${DefinitionsTable.id} = vals.id;
`;
  return createSql;
}

async function main() {
  await withStdinStdout(async (ctx, input) => {
    const chars = (await processLines(input)).map((s) => s.trim());
    const dbEntries = await db
      .select()
      .from(EntriesTable)
      .where(
        or(
          inArray(EntriesTable.simplified, chars),
          inArray(EntriesTable.traditional, chars)
        )
      );
    const dbEntryIds = dbEntries.map((e) => e.id);
    const dbDefs = await db
      .select()
      .from(DefinitionsTable)
      .where(inArray(DefinitionsTable.entryId, dbEntryIds));

    const numItems = chars.length;
    const allEntries: EntryRelevance[] = [];
    const allDefinitions: DefinitionRelevance[] = [];
    await benchmark(async (onItemComplete) => {
      for (const searchTerm of chars) {
        const { entryRelevances, definitionRelevances } =
          await accumulateUpdatesForChar(searchTerm, dbDefs, dbEntries);
        allEntries.push(...entryRelevances);
        allDefinitions.push(...definitionRelevances);
        onItemComplete();
      }

      const updateSql = createEntriesUpdateSql(generateValues(allEntries));
      await db.execute(updateSql);
      const updateDefsSql = createDefinitionsUpdateSql(
        generateValues(allDefinitions)
      );
      await db.execute(updateDefsSql);
    }, numItems);
  });

  process.exit(0);
}

if (require.main === module) {
  main();
}
