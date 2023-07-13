import DAO_JSON from "materials/verses/dao.json";
import DESCRIPTIONS_JSON from "materials//descriptions/descriptions.json";
import fs from "fs";
import { join } from "path";

const punctuations = `　。、「」【】：，？﹖； () ﹕ ！ ﹗ （ ）“”`;

const uniqueChars = new Set();
const uniqueVerseChars = new Set();
const uniqueDescriptionChars = new Set();
for (const verse of DAO_JSON) {
  for (const c of verse) {
    if (punctuations.includes(c)) continue;
    if (c.trim() === "") continue;
    uniqueChars.add(c);
    uniqueVerseChars.add(c);
  }
}

for (const verse of DESCRIPTIONS_JSON) {
  for (const c of verse) {
    if (punctuations.includes(c)) continue;
    if (c.trim() === "") continue;
    uniqueChars.add(c);
    uniqueDescriptionChars.add(c);
  }
}

function readIter(iter: IterableIterator<any>) {
  const items = [];
  for (const i of iter) {
    items.push(i);
  }

  return items;
}

const uniqueCharsWrite = readIter(uniqueChars.values()).join("\n");
const uniqueVerseCharsWrite = readIter(uniqueVerseChars.values()).join("\n");
const uniqueDescriptionCharsWrite = readIter(
  uniqueDescriptionChars.values()
).join("\n");

fs.writeFileSync(join(__dirname, "./uniqueAllChars.txt"), uniqueCharsWrite, {
  encoding: "utf8",
});
fs.writeFileSync(
  join(__dirname, "./uniqueDescriptionChars.txt"),
  uniqueDescriptionCharsWrite,
  {
    encoding: "utf8",
  }
);
fs.writeFileSync(
  join(__dirname, "./uniqueVerseChars.txt"),
  uniqueVerseCharsWrite,
  {
    encoding: "utf8",
  }
);
