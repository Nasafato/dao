import { prisma } from "../../src/lib/db";
import type { DenormalizedDictSchema } from "../../types/materials";
import { processLines, withStdinStdout, benchmark } from "../cliUtils";

async function main() {
  await withStdinStdout(async (ctx, input) => {
    const uniqueChars = (await processLines(input))
      .map((s) => s.trim())
      .filter(Boolean);
    const finalObject: DenormalizedDictSchema = {
      id: [],
      pronunciation: [],
      simplified: [],
      traditional: [],
      relevancy: [],
      definitions: {
        id: [],
        entryId: [],
        definition: [],
        relevancy: [],
      },
    };

    const numItems = uniqueChars.length;
    await benchmark(async (onItemComplete) => {
      for (let i = 0; i < uniqueChars.length; i++) {
        const char = uniqueChars[i];
        const entries = await prisma.entry.findMany({
          where: {
            OR: [
              {
                simplified: char,
              },
              {
                traditional: char,
              },
            ],
          },
          include: {
            definitions: true,
          },
        });
        for (const entry of entries) {
          finalObject.id.push(entry.id);
          finalObject.pronunciation.push(entry.pronunciation);
          finalObject.simplified.push(entry.simplified);
          finalObject.traditional.push(entry.traditional);
          finalObject.relevancy.push(entry.relevancy);
        }
        for (const definition of entries.flatMap((e) => e.definitions)) {
          finalObject.definitions.id.push(definition.id);
          finalObject.definitions.entryId.push(definition.entryId);
          finalObject.definitions.definition.push(definition.definition);
          finalObject.definitions.relevancy.push(definition.relevancy);
        }

        onItemComplete();
      }
    }, numItems);

    return JSON.stringify(finalObject, null);
  });
}

if (require.main === module) {
  main();
}
