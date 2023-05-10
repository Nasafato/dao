const fs = require("fs");
const path = require("path");

const { augmentDictionary } = require("./augmentDictionary");
const { buildDictionary } = require("./buildDictionary");
const { buildDaoDictionary } = require("./buildDaoDictionary");
const { createDescriptions } = require("./buildDescriptions");
const {
  buildDescriptionsDictionary,
} = require("./buildDescriptionsDictionary");
const { buildVerseIndex } = require("./buildVerseIndex");
const { buildCombinedDictionary } = require("./buildCombinedDictionary");

function run() {
  buildDictionary();
  augmentDictionary();
  buildVerseIndex();
  // buildDaoDictionary();
  buildCombinedDictionary();
  fs.copyFile(
    path.join(__dirname, "dao-combined-dictionary.json"),
    path.join(
      __dirname,
      "../src/pages/api/fixtures/dao-combined-dictionary.json"
    ),
    (err) => {
      if (err) throw err;
      console.log(
        "./dao-combined-dictionary.json",
        "copied to",
        "../src/pages/api/fixtures/dao-combined-dictionary.json"
      );
    }
  );
  fs.copyFile(
    path.join(__dirname, "dao.json"),
    path.join(__dirname, "../src/fixtures/dao.json"),
    (err) => {
      if (err) throw err;
      console.log("dao.json copied to fixtures/dao.json");
    }
  );
  // createDescriptions();
  // buildDescriptionsDictionary();
}

if (require.main === module) {
  run();
}
