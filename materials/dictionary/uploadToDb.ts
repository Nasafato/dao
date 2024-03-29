import { performance } from "perf_hooks";
import cliProgress from "cli-progress";
import fs from "fs/promises";
import { CONFIG, Entry, EntrySchema } from "./config";
import { z } from "zod";
import { prisma } from "@/lib/db";

const EntrySchemaArray = z.array(EntrySchema);

// async function processWithDrizzle(entry: Entry) {
//   const [createdEntry] = await db
//     .insert(entries)
//     .values({
//       pronunciation: entry.pronunciation,
//       simplified: entry.simplified,
//       traditional: entry.traditional,
//     })
//     .returning();
//   await db.insert(definitions).values(
//     entry.definitions.map((d) => ({
//       definition: d,
//       entryId: createdEntry.id,
//     }))
//   );
// }

async function processWithPrisma(entry: Entry) {
  await prisma.entry.upsert({
    where: {
      pronunciation_simplified_traditional: {
        pronunciation: entry.pronunciation,
        simplified: entry.simplified,
        traditional: entry.traditional,
      },
    },
    create: {
      pronunciation: entry.pronunciation,
      simplified: entry.simplified,
      traditional: entry.traditional,
      definitions: {
        createMany: {
          data: entry.definitions.map((d) => ({ definition: d })),
        },
      },
    },
    update: {},
  });
}

async function uploadToDb(
  dict: z.infer<typeof EntrySchemaArray>,
  processEntry: (entry: Entry) => Promise<void>,
  onItemComplete?: () => void
) {
  for (const entry of dict) {
    await processEntry(entry);
    onItemComplete?.();
  }
}

async function main() {
  // const fullDict = EntrySchemaArray.parse(
  //   JSON.parse(await fs.readFile(CONFIG.dictionaryPath, "utf-8"))
  // );

  // We only care about single characters for now.
  const augments = EntrySchemaArray.parse(
    JSON.parse(await fs.readFile(CONFIG.augmentsPath, "utf-8"))
  );
  // const dict = fullDict.filter((e) => e.simplified.length < 2);

  // await benchmark(
  //   (onItemComplete) => uploadToDb(dict, processWithDrizzle, onItemComplete),
  //   dict.length
  // );

  // await benchmark(
  //   (onItemComplete) => uploadToDb(dict, processWithPrisma, onItemComplete),
  //   dict.length
  // );

  await uploadToDb(augments, processWithPrisma);

  process.exit(0);
}

main();
