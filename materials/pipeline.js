const fs = require("fs");

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
    "./dao-combined-dictionary.json",
    "../src/pages/api/fixtures/dao-combined-dictionary.json",
    (err) => {
      if (err) throw err;
      console.log(
        "./dao-combined-dictionary.json",
        "copied to",
        "../src/pages/api/fixtures/dao-combined-dictionary.json"
      );
    }
  );
  // createDescriptions();
  // buildDescriptionsDictionary();
}

if (require.main === module) {
  run();
}
