const fs = require("fs");

const descriptions = JSON.parse(
  fs.readFileSync("./materials/dao-descriptions.json")
);
const texts = JSON.parse(fs.readFileSync("./src/fixtures/dao.json"));

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

fs.writeFileSync(
  "./src/fixtures/dao-combined.json",
  JSON.stringify(combined, null, 2)
);
