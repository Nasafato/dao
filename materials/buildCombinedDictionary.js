const fs = require("fs");

module.exports = {
  buildCombinedDictionary() {
    const dictionary = JSON.parse(fs.readFileSync("dictionary.json", "utf8"));

    const punctuations = `　。、「」【】：，？﹖； () ﹕ ！ ﹗ （ ） 《 》 “ ” . *`;

    const descriptions = fs.readFileSync("dao-description-cleaned.txt", "utf8");
    const dao = fs.readFileSync("dao.txt", "utf8");

    const allChars = new Set();
    for (const c of dao) {
      if (punctuations.includes(c)) continue;
      if (c.trim() === "") continue;
      if (allChars.has(c)) continue;
      allChars.add(c);
    }

    for (const c of descriptions) {
      if (punctuations.includes(c)) continue;
      if (c.trim() === "") continue;
      if (allChars.has(c)) continue;
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
        "All characters are present. Creating dao-combined-dictionary.json"
      );
    }

    const daoDict = {};
    for (const c of allChars) {
      if (daoDict[c]) {
        continue;
      }
      daoDict[c] = dictionary[c];
    }

    fs.writeFileSync("dao-combined-dictionary.json", JSON.stringify(daoDict));
  },
};

if (require.main === module) {
  module.exports.buildCombinedDictionary();
}
