const fs = require("fs");

module.exports = {
  buildVerseIndex() {
    const descriptions = JSON.parse(fs.readFileSync("./dao-descriptions.json"));
    const texts = JSON.parse(fs.readFileSync("./dao.json"));

    const combined = {};
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
