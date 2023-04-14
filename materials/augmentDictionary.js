const fs = require("fs");

function augmentDictionary() {
  const dictionary = JSON.parse(fs.readFileSync("dictionary.json", "utf8"));
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

  fs.writeFileSync("dictionary.json", JSON.stringify(dictionary, null, 2));
}

if (require.main === module) {
  augmentDictionary();
}

module.exports = {
  augmentDictionary,
};
