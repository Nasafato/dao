const fs = require("fs");
const path = require("path");

const cedictPath = path.join(__dirname, "cedict.txt");

function readDict() {
  const dict = fs
    .readFileSync(cedictPath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => {
      if (line.startsWith("#")) return false;
      return true;
    });
  return dict;
}

function build(dict) {
  const dictionary = {};
  for (let l of dict) {
    l = l.replace(" [", "\t");
    l = l.replace("] /", "\t");
    const [spelling, pinyin, definition] = l.split("\t");
    const [traditional, simplified] = spelling.split(" ");
    const pronunciation = pinyin.split(" ");
    const definitionParts = definition
      .split("/")
      .filter((d) => d.trim() !== "");
    dictionary[traditional] = {
      spelling: "traditional",
      source: "cedict",
      simplified,
      word: traditional,
      pinyin: pronunciation,
      definitions: {
        english: definitionParts,
      },
    };
    dictionary[simplified] = {
      spelling: "simplified",
      source: "cedict",
      traditional,
      word: simplified,
      pinyin: pronunciation,
      definitions: {
        english: definitionParts,
      },
    };
  }

  return dictionary;
}

function buildDictionary() {
  const dict = readDict();
  const dictionary = build(dict);
  fs.writeFileSync("dictionary.json", JSON.stringify(dictionary));
}

if (require.main === module) {
  buildDictionary();
}

module.exports = {
  buildDictionary,
};
