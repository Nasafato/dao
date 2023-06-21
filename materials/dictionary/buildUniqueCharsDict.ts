import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import { prisma } from "../../src/lib/prisma";
import type { DenormalizedDictSchema } from "../../src/utils";

async function main() {
  // const uniqueChars = (
  //   await fs.readFile(path.join(__dirname, "uniqueAllChars.txt"))
  // ).toString();
  const uniqueChars = `
    非
  `
    .split("\n")
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
  }

  console.log(JSON.stringify(finalObject, null, 2));
  // await fs.writeFile(
  //   path.join(__dirname, "uniqueAllCharsDict.json"),
  //   JSON.stringify(finalObject)
  // );
  process.exit(0);
}

if (require.main === module) {
  main();
}
