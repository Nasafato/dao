import { Definition } from "@prisma/client";
import { prisma } from "../../src/lib/prisma";
import { processLines, withStdinStdout } from "../cliUtils";

async function main() {
  await withStdinStdout(async (input) => {
    const chars = (await processLines(input)).map((s) => s.trim());
    // const chars = `
    //     行
    //     道
    //     菜
    // `
    // .split("\n")
    // .map((s) => s.trim())
    // .filter(Boolean);
    for (const searchTerm of chars) {
      const entries = await prisma.entry.findMany({
        where: {
          OR: [
            {
              simplified: searchTerm,
            },
            {
              traditional: searchTerm,
            },
          ],
        },
        include: {
          definitions: true,
        },
      });

      // Really, the entry relevancy should be a score normalized by the number of definitions it has.
      // First, all definitions that aren't proper nouns or "variants of" should be given a score of 1.
      // Otherwise, the score of the definition is 0.

      const entryUpdates: {
        [id: string]: {
          info: string;
          relevancy?: number;
          numDefinitions: number;
          definitionUpdates: Partial<Definition>[];
        };
      } = {};
      let totalDefinitions = 0;
      for (const entry of entries) {
        // If first character is capitalized, it's a proper noun.
        const isProperNoun =
          entry.pronunciation[0] === entry.pronunciation[0].toUpperCase();
        if (isProperNoun) {
          entryUpdates[entry.id] = {
            info: `${entry.simplified} ${entry.pronunciation}`,
            relevancy: -1,
            numDefinitions: entry.definitions.length,
            definitionUpdates: [],
          };
        } else {
          entryUpdates[entry.id] = {
            info: `${entry.simplified} ${entry.pronunciation}`,
            definitionUpdates: [],
            numDefinitions: entry.definitions.length,
          };
        }

        totalDefinitions += entry.definitions.length;

        for (const def of entry.definitions) {
          if (def.definition.includes("variant of")) {
            entryUpdates[entry.id].definitionUpdates.push({
              id: def.id,
              relevancy: -1,
            });
          } else if (def.definition.includes("CL:")) {
            entryUpdates[entry.id].definitionUpdates.push({
              id: def.id,
              relevancy: 1,
            });
          }
        }

        // Decent heuristic, I hope.
        for (const [id, update] of Object.entries(entryUpdates)) {
          const relevancy = entryUpdates[id]?.relevancy;
          if (relevancy) {
            entryUpdates[id].relevancy =
              relevancy + update.numDefinitions / totalDefinitions;
          }
        }

        // process.stdout.write(JSON.stringify(entryUpdates, null, 2));
      }
      for (const [id, update] of Object.entries(entryUpdates)) {
        // console.log("updating", id, update.info, update.relevancy);
        if (update.relevancy !== undefined) {
          const result = await prisma.entry.update({
            data: { relevancy: update.relevancy },
            where: { id: Number(id) },
          });
          // console.log("result", result);
        }

        for (const { id, relevancy } of update.definitionUpdates) {
          // console.log("updating", id, relevancy);
          await prisma.definition.update({
            data: { relevancy },
            where: { id: Number(id) },
          });
        }
      }

      // process.stdout.write(
      //   JSON.stringify(
      //     {
      //       entryUpdates,
      //       definitionUpdates,
      //     },
      //     null,
      //     2
      //   )
      // );
    }
  });
}

if (require.main === module) {
  main();
}
