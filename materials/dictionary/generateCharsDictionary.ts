// For every character, I can query the database for its definition, then cache it somehow? In Prisma?
// Or do I just...
// What's the simplest thing to do? Just fetch the whole JSON blob, stick it in IndexedDB, then query for that when offline.
// That's already a much better experience.

import { Definition } from "@prisma/client";
import { prisma } from "../../src/lib/prisma";
import fs from "fs/promises";
import path from "path";

async function main() {
  const uniqueChars = (
    await fs.readFile(path.join(__dirname, "uniqueChars.txt"))
  ).toString();
  const uniqueVerseChars = (
    await fs.readFile(path.join(__dirname, "uniqueVerseChars.txt"))
  ).toString();
  const uniqueDescriptionChars = (
    await fs.readFile(path.join(__dirname, "uniqueDescriptionChars.txt"))
  ).toString();

  const definitions: Record<string, any> = {};
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
        definitions: e.definitions.map(stripExtraInfo),
      };
    });
  }

  const uniqueVerseCharsDict: Record<string, any> = {};
  const uniqueDescriptionCharsDict: Record<string, any> = {};
  for (const char of uniqueVerseChars) {
    uniqueVerseCharsDict[char] = definitions[char];
  }
  for (const char of uniqueDescriptionChars) {
    uniqueDescriptionCharsDict[char] = definitions[char];
  }

  await fs.writeFile(
    path.join(__dirname, "uniqueCharsDict.json"),
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
