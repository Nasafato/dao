// For every character, I can query the database for its definition, then cache it somehow? In Prisma?
// Or do I just...
// What's the simplest thing to do? Just fetch the whole JSON blob, stick it in IndexedDB, then query for that when offline.
// That's already a much better experience.

import { Definition } from "@prisma/client";
import { prisma } from "../../src/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { CachedResult } from "../../src/hooks";

async function main() {
  const uniqueChars = (
    await fs.readFile(path.join(__dirname, "uniqueAllChars.txt"))
  ).toString();
  const uniqueVerseChars = (
    await fs.readFile(path.join(__dirname, "uniqueVerseChars.txt"))
  ).toString();
  const uniqueDescriptionChars = (
    await fs.readFile(path.join(__dirname, "uniqueDescriptionChars.txt"))
  ).toString();

  const definitions: Record<string, CachedResult> = {};
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
    definitions[char] = entries.map((e) => {
      return {
        id: e.id,
        pronunciation: e.pronunciation,
        simplified: e.simplified,
        traditional: e.traditional,
        definitions: e.definitions.map(stripExtraInfo),
      };
    });
  }

  const uniqueVerseCharsDict: Record<string, CachedResult> = {};
  const uniqueDescriptionCharsDict: Record<string, CachedResult> = {};
  for (const char of uniqueVerseChars) {
    uniqueVerseCharsDict[char] = definitions[char];
  }
  for (const char of uniqueDescriptionChars) {
    uniqueDescriptionCharsDict[char] = definitions[char];
  }

  await fs.writeFile(
    path.join(__dirname, "uniqueAllCharsDict.json"),
    JSON.stringify(definitions)
  );
  await fs.writeFile(
    path.join(__dirname, "uniqueVerseCharsDict.json"),
    JSON.stringify(uniqueVerseCharsDict)
  );
  await fs.writeFile(
    path.join(__dirname, "uniqueDescriptionCharsDict.json"),
    JSON.stringify(uniqueDescriptionCharsDict)
  );
}

function stripExtraInfo(definition: Definition) {
  return definition.definition;
}

if (require.main === module) {
  main();
}
