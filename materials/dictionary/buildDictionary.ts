import fs from "fs/promises";
import { CONFIG, Entry } from "./config";
import { Prisma } from "@prisma/client";

// const VARIANT_OF_REGEX = /variant of (.*?)\[(.*)\]/g;

const TEST_DICT = `
㚻姦 㚻奸 [ji1 jian1] /variant of 雞奸|鸡奸[ji1 jian1]/
㒳 㒳 [liang3] /old variant of 兩|两[liang3]/
行 行 [hang2] /row/line/commercial firm/line of business/profession/to rank (first, second etc) among one's siblings (by age)/(in data tables) row/(Tw) column/
行 行 [xing2] /to walk/to go/to travel/a visit/temporary/makeshift/current/in circulation/to do/to perform/capable/competent/effective/all right/OK!/will do/behavior/conduct/Taiwan pr. [xing4] for the behavior-conduct sense/
葯 药 [yao4] /leaf of the iris/variant of 藥|药[yao4]/
word word [w o r d] /my (Internet slang variant of 我的[wo3 de5])/
□ □ [biang4] /(Tw) (coll.) cool/awesome/(etymologically, a contracted form of 不一樣|不一样[bu4 yi1 yang4])/often written as ㄅㄧㄤˋ/
□ □ [biu1] /(onom.) pew! (sound of a bullet fired from a gun)/also pr. [biu4]/
□ □ [ging1] /uptight/obstinate/to awkwardly force oneself to do sth/(Taiwanese, Tai-lo pr. [king], often written as ㄍㄧㄥ, no generally accepted hanzi form)/
行 行 [hang2] /row/line/commercial firm/line of business/profession/to rank (first, second etc) among one's siblings (by age)/(in data tables) row/(Tw) column/
行 行 [xing2] /to walk/to go/to travel/a visit/temporary/makeshift/current/in circulation/to do/to perform/capable/competent/effective/all right/OK!/will do/behavior/conduct/Taiwan pr. [xing4] for the behavior-conduct sense/
贏 赢 [ying2] /to beat/to win/to profit/
嬴 嬴 [ying2] /old variant of 贏|赢[ying2], to win, to profit/old variant of 盈[ying2], full/
盈 盈 [ying2] /full/filled/surplus/
嬴 嬴 [Ying2] /surname Ying/
丌 丌 [qi2] /archaic variant of 其[qi2]/
其 其 [qi2] /his/her/its/their/that/such/it (refers to sth preceding it)/
`;

const AUGMENTATIONS = `
繟 繟 [chan3] /easy going/slow/sluggish/
`;

async function readDict() {
  const dict = (await fs.readFile(CONFIG.cedictPath, "utf8"))
    .split("\n")
    .map((line) => line.trim())
    .filter(filterLine);
  dict.push(...AUGMENTATIONS.split("\n").filter(filterLine));
  return dict;
}

function filterLine(line: string) {
  if (line.startsWith("#")) return false;
  if (line.startsWith("//")) return false;
  if (line === "") return false;
  return true;
}

async function readTestDict() {
  const dict = TEST_DICT.split("\n")
    .map((line) => line.trim())
    .filter((line) => {
      if (line.startsWith("#")) return false;
      if (line.startsWith("//")) return false;
      if (line === "") return false;
      return true;
    });
  dict.push(...AUGMENTATIONS.split("\n").filter(filterLine));
  return dict;
}

const USE_TEST_DICT = true;
// const USE_TEST_DICT = false;

export async function buildDictionary() {
  const dict = USE_TEST_DICT ? await readTestDict() : await readDict();
  const entries = buildEntries(dict);
  const dictpath = USE_TEST_DICT ? CONFIG.testPath : CONFIG.dictionaryPath;
  await fs.writeFile(dictpath, JSON.stringify(entries));
}

export function buildEntries(lines: string[]) {
  const entries = [];
  for (let l of lines) {
    l = l.replace(" [", "\t");
    l = l.replace("] /", "\t");
    const [spelling, pinyin, definition] = l.split("\t");
    const [traditional, simplified] = spelling.split(" ");
    const definitionParts = definition
      .split("/")
      .filter((d) => d.trim() !== "");

    const row = {
      traditional,
      simplified,
      pronunciation: pinyin,
      definitions: definitionParts,
    };
    entries.push(row);
  }
  return entries;
}

if (require.main === module) {
  buildDictionary();
}
