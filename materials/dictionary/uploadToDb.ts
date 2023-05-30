import { prisma } from "./buildDictionary";

import { DictionaryEntrySchema, matchVariantRegex } from "./utils";
import cliProgress from "cli-progress";
import { promises as fs } from "fs";
import path from "path";

const DICT_PATH = path.join(__dirname, "dictionary.json");

let processed = 0;

async function main() {
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  const dict = JSON.parse(await fs.readFile(DICT_PATH, "utf-8"));
  const entries = Object.entries(dict);
  bar.start(entries.length, 0);
  for (let i = 0; i < entries.length; i++) {
    const [key, rawEntry] = entries[i];
    if (key.length > 1) {
      processed++;
      // Only put in single characters for now.
      continue;
    }
    // If key is ASCII (i.e. not a Chinese character), skip it.
    if (key.charCodeAt(0) < 128) {
      processed++;
      continue;
    }

    const existingEntry = await prisma.character.findUnique({
      where: {
        character: key,
      },
    });
    if (existingEntry) {
      processed++;
      continue;
    }

    i++;

    const entry = DictionaryEntrySchema.parse(rawEntry);
    const pronunciationMap = new Map<string, string[]>();
    let spellingVariants: Array<{
      spelling: string;
      simplified: boolean;
      isKey: boolean;
    }> = [];
    for (const variant of entry.variants) {
      if (variant.spelling === "simplified") {
        pronunciationMap.set(variant.pronunciation.join(" "), []);
        spellingVariants.push({
          spelling: variant.character,
          simplified: true,
          isKey: variant.character === key,
        });
      } else {
        const match = spellingVariants.find(
          (s) => s.spelling === variant.character
        );
        if (!match) {
          spellingVariants.push({
            spelling: variant.character,
            simplified: false,
            isKey: false,
          });
        }
      }
    }
    // Dedupe spelling variants
    const spellingVariantMap = new Map<
      string,
      {
        spelling: string;
        simplified: boolean;
        isKey: boolean;
      }
    >();
    for (const variant of spellingVariants) {
      const hash = `${variant.spelling}-${variant.simplified}`;
      spellingVariantMap.set(hash, variant);
    }
    spellingVariants = Array.from(spellingVariantMap.values());

    for (const definition of entry.definitions) {
      if (definition.english.some((s) => s.includes("variant of"))) {
        continue;
      }
      const pronunciationKey = definition.pronunciation.join(" ");
      const pronunciationDefinitions = pronunciationMap.get(pronunciationKey);
      if (!pronunciationDefinitions) {
        throw new Error(
          "Unexpected pronunciation: " + definition.pronunciation + " : " + key
        );
      }
      pronunciationMap.set(pronunciationKey, [
        ...pronunciationDefinitions,
        ...definition.english,
      ]);
    }

    await prisma.character.create({
      data: {
        character: key,
        pronunciationVariants: {
          create: Array.from(pronunciationMap.entries()).map(
            ([pronunciation, definitions]) => {
              return {
                pronunciation,
                simplified: true,
                definitions: {
                  create: definitions.map((definition) => {
                    return {
                      definition,
                      language: "english",
                    };
                  }),
                },
              };
            }
          ),
        },
        spellingVariants: {
          create: spellingVariants.map((variant) => {
            return {
              variant: variant.spelling,
              simplified: variant.simplified,
              isKey: variant.isKey,
            };
          }),
        },
      },
    });

    processed++;
    bar.update(processed);
  }

  bar.stop();
}

main();
