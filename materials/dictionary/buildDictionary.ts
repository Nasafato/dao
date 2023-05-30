import { promises as fs } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import {
  DictionaryEntry as DictionaryEntry,
  CharacterVariant as Variant,
} from "./utils";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// interface DictionaryEntry {
//   spelling: "traditional" | "simplified";
//   source: "cedict";
//   simplified: string;
//   traditional: string;
//   word: string;
//   pinyin: string[];
//   definitions: {
//     english: string[];
//   };
// }

// const VARIANT_OF_REGEX = /variant of (.*)/;
const VARIANT_OF_REGEX = /variant of (.*?)\[(.*)\]/g;

const TEST_DICT = `
// 㚻姦 㚻奸 [ji1 jian1] /variant of 雞奸|鸡奸[ji1 jian1]/
// 㒳 㒳 [liang3] /old variant of 兩|两[liang3]/
// 行 行 [hang2] /row/line/commercial firm/line of business/profession/to rank (first, second etc) among one's siblings (by age)/(in data tables) row/(Tw) column/
// 行 行 [xing2] /to walk/to go/to travel/a visit/temporary/makeshift/current/in circulation/to do/to perform/capable/competent/effective/all right/OK!/will do/behavior/conduct/Taiwan pr. [xing4] for the behavior-conduct sense/
// 葯 药 [yao4] /leaf of the iris/variant of 藥|药[yao4]/
// word word [w o r d] /my (Internet slang variant of 我的[wo3 de5])/
// □ □ [biang4] /(Tw) (coll.) cool/awesome/(etymologically, a contracted form of 不一樣|不一样[bu4 yi1 yang4])/often written as ㄅㄧㄤˋ/
// □ □ [biu1] /(onom.) pew! (sound of a bullet fired from a gun)/also pr. [biu4]/
// □ □ [ging1] /uptight/obstinate/to awkwardly force oneself to do sth/(Taiwanese, Tai-lo pr. [king], often written as ㄍㄧㄥ, no generally accepted hanzi form)/
行 行 [hang2] /row/line/commercial firm/line of business/profession/to rank (first, second etc) among one's siblings (by age)/(in data tables) row/(Tw) column/
行 行 [xing2] /to walk/to go/to travel/a visit/temporary/makeshift/current/in circulation/to do/to perform/capable/competent/effective/all right/OK!/will do/behavior/conduct/Taiwan pr. [xing4] for the behavior-conduct sense/
`;

const cedictPath = path.join(__dirname, "cedict.txt");

async function readDict() {
  const dict = (await fs.readFile(cedictPath, "utf8"))
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => {
      if (line.startsWith("#")) return false;
      if (line === "") return false;
      return true;
    });
  return dict;
}

async function readTestDict() {
  return TEST_DICT.split("\n")
    .map((line) => line.trim())
    .filter((line) => {
      if (line.startsWith("#")) return false;
      if (line.startsWith("//")) return false;
      if (line === "") return false;
      return true;
    });
}

async function buildDictionary() {
  const dict = await readDict();
  // const dict = await readTestDict();

  const dictionary: Record<string, DictionaryEntry> = {};
  for (let l of dict) {
    l = l.replace(" [", "\t");
    l = l.replace("] /", "\t");
    const [spelling, pinyin, definition] = l.split("\t");
    const [traditional, simplified] = spelling.split(" ");
    const pronunciation = forcePronunciationIntoArray(pinyin);
    const definitionParts = definition
      .split("/")
      .filter((d) => d.trim() !== "");

    let entryKey = simplified;
    // console.log("definitionParts", definitionParts);
    for (const definitionPart of definitionParts) {
      VARIANT_OF_REGEX.lastIndex = 0;
      const groups = VARIANT_OF_REGEX.exec(definitionPart);
      // console.log(`${VARIANT_OF_REGEX}.exec(${definition})`);
      if (groups && groups.length > 0) {
        // console.log("Matches variant", groups);
        const [, variantOf, variantPronunciationString] = groups;
        const variants: Variant[] = [
          {
            spelling: "traditional",
            source: "cedict",
            character: traditional,
            pronunciation: pronunciation,
          },
          {
            spelling: "simplified",
            source: "cedict",
            character: simplified,
            pronunciation: pronunciation,
          },
        ];
        const variantPronunciation = forcePronunciationIntoArray(
          variantPronunciationString
        );
        let key;
        if (variantOf.includes("|")) {
          const [variantOfTraditional, variantOfSimplified] =
            variantOf.split("|");
          variants.push({
            spelling: "simplified",
            source: "cedict",
            character: variantOfSimplified,
            pronunciation: variantPronunciation,
          });
          variants.push({
            spelling: "traditional",
            source: "cedict",
            character: variantOfTraditional,
            pronunciation: variantPronunciation,
          });
          key = variantOfSimplified;
        } else {
          variants.push({
            spelling: "simplified",
            source: "cedict",
            character: variantOf,
            pronunciation: variantPronunciation,
          });
          key = variantOf;
        }
        entryKey = key;
        // Try to find existing entry
        const existingEntry = dictionary[simplified];
        if (!existingEntry) {
          dictionary[key] = {
            variants,
            character: key,
            definitions: [],
            source: "cedict",
            spelling: "simplified",
          };
        } else {
          existingEntry.variants = existingEntry.variants.concat(variants);
        }
      }
    }

    const existingEntry = dictionary[entryKey];
    if (!existingEntry) {
      dictionary[simplified] = {
        spelling: "simplified",
        source: "cedict",
        character: simplified,
        variants: [
          {
            spelling: "traditional",
            source: "cedict",
            character: traditional,
            pronunciation,
          },
        ],
        definitions: [
          {
            pronunciation: pronunciation,
            english: definitionParts.filter((d) => {
              const result = !VARIANT_OF_REGEX.test(d);
              VARIANT_OF_REGEX.lastIndex = 0;
              return result;
            }),
          },
        ],
      };
    } else {
      existingEntry.definitions = existingEntry.definitions.concat({
        pronunciation,
        english: definitionParts.filter((d) => {
          const result = !VARIANT_OF_REGEX.test(d);
          VARIANT_OF_REGEX.lastIndex = 0;
          return result;
        }),
      });
    }

    // Dedupe variations
    const entry = dictionary[simplified];
    if (!entry) {
      continue;
    }
    entry.variants.push({
      spelling: "simplified",
      source: "cedict",
      character: entryKey,
      pronunciation,
    });
    const hash = (variant: Variant) => {
      return `${variant.character}-${variant.pronunciation.join("-")}-${
        variant.spelling
      }`;
    };
    const variantMap = new Map<string, Variant>();
    for (const variant of entry.variants) {
      const hashed = hash(variant);
      variantMap.set(hashed, variant);
    }

    entry.variants = Array.from(variantMap.values());
  }

  await fs.writeFile(
    path.join(__dirname, "dictionary.json"),
    // JSON.stringify(dictionary, null, 2)
    JSON.stringify(dictionary)
  );
}

function forcePronunciationIntoArray(s: string | string[]) {
  if (Array.isArray(s)) return s;

  if (s.includes("[")) {
    s = s.replace("[", "").replace("]", "");
  }
  const split = s.split(" ").filter((s) => s !== "");
  return split;
}

if (require.main === module) {
  buildDictionary();
}

export { buildDictionary };
