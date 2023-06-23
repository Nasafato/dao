import fs from "fs";
import path from "path";

const daoPath = path.join(__dirname, "dao.txt");
const daoJsonPath = path.join(__dirname, "dao.json");
const allPath = path.join(__dirname, "all/");

function buildDaoJson() {
  const dao = fs.readFileSync(daoPath, "utf8");
  const daoJson = dao.split("\n");
  fs.writeFileSync(daoJsonPath, JSON.stringify(daoJson));

  for (const [index, line] of daoJson.entries()) {
    const verseId = index + 1;
    const lineJson = JSON.stringify(line);
    const linePath = path.join(
      allPath,
      `${verseId < 10 ? "0" : ""}${verseId}.json`
    );
    fs.writeFileSync(linePath, lineJson);
  }
}

export { buildDaoJson };

if (require.main === module) {
  buildDaoJson();
}
