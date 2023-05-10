const fs = require("fs");
const path = require("path");

const daoDescriptionsPath = path.join(__dirname, "dao-descriptions.json");
const daoPath = path.join(__dirname, "dao.json");

module.exports = {
  buildVerseIndex() {
    const descriptions = JSON.parse(fs.readFileSync(daoDescriptionsPath));
    const texts = JSON.parse(fs.readFileSync(daoPath));

    const combined = [];
    for (let i = 0; i < 80; i++) {
      const text = texts[i];
      const description = descriptions[i + 1];
      combined.push({
        index: i + 1,
        text,
        description,
      });
    }

    fs.writeFileSync("./dao-combined.json", JSON.stringify(combined));
  },
};
