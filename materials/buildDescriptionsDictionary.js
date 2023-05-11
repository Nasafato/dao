const fs = require("fs");
const path = require("path");

module.exports = {
  buildDescriptionsDictionary() {
    const dictionary = JSON.parse(
      fs.readFileSync(path.join(__dirname, "dictionary.json"), "utf8")
    );

    const punctuations = `　。、「」【】：，？﹖； () ﹕ ！ ﹗ （ ） 《 》 “ ” . *`;

    const dao = fs.readFileSync(
      path.join(__dirname, "dao-description-cleaned.txt"),
      "utf8"
    );

    const allChars = new Set();
    for (const c of dao) {
      if (punctuations.includes(c)) continue;
      if (c.trim() === "") continue;
      allChars.add(c);
    }

    let numMissing = 0;
    const missing = [];
    for (const c of allChars) {
      if (!dictionary[c]) {
        numMissing += 1;
        missing.push(c);
      }
    }

    if (numMissing > 0) {
      console.log(`Missing ${numMissing} characters`);
      console.log(missing.join(" "));
      process.exit(1);
    } else {
      console.log(
        "All characters are present. Creating descriptions-dictionary.json"
      );
    }

    const daoDict = {};
    for (const c of allChars) {
      if (daoDict[c]) {
        continue;
      }
      daoDict[c] = dictionary[c];
    }

    fs.writeFileSync(
      path.join(__dirname, "descriptions-dictionary.json"),
      JSON.stringify(daoDict)
    );
  },
};

if (require.main === module) {
  module.exports.buildDescriptionsDictionary();
}
