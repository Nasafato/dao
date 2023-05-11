const fs = require("fs");
const path = require("path");

function augmentDictionary() {
  const dictionary = JSON.parse(
    fs.readFileSync(path.join(__dirname, "dictionary.json"), "utf8")
  );
  dictionary["繟"] = {
    spelling: "simplified",
    source: "manual addition",
    traditional: "繟",
    word: "繟",
    pinyin: ["chan3"],
    definitions: {
      chinese: ["缓慢"],
      english: ["easy going; slow; sluggish"],
    },
  };

  fs.writeFileSync(
    path.join(__dirname, "dictionary.json"),
    JSON.stringify(dictionary)
  );
}

if (require.main === module) {
  augmentDictionary();
}

module.exports = {
  augmentDictionary,
};
