const fs = require("fs");

module.exports = {
  createDescriptions() {
    const f = fs.readFileSync(path.join(__dirname, "./dao-description.txt"));

    const lines = f
      .toString()
      .split("\n")
      .filter((s) => s.trim());

    fs.writeFileSync(
      path.join(__dirname, "./dao-description-cleaned.txt"),
      lines.join("\n")
    );

    const linesWithoutTitle = lines.slice(1);
    console.log(linesWithoutTitle.length);
    console.log(linesWithoutTitle.slice(-2));
    const descriptions = [];
    for (let i = 0; i < linesWithoutTitle.length - 1; i += 2) {
      const titleLine = linesWithoutTitle[i];
      const descriptionLine = linesWithoutTitle[i + 1];
      if (descriptionLine.startsWith("《老子")) {
        console.error("Out of order");
        console.log(i, titleLine, descriptionLine);
        break;
      }
      descriptions.push(descriptionLine.replace("【解释】 ", ""));
    }

    console.log(descriptions.length);
    const descriptionsIndex = {};
    for (let i = 0; i < descriptions.length; i++) {
      descriptionsIndex[i + 1] = descriptions[i].trim();
    }
    fs.writeFileSync(
      path.join(__dirname, "./dao-descriptions.json"),
      JSON.stringify(descriptionsIndex)
    );
  },
};

if (require.main === module) {
  module.exports.createDescriptions();
}
