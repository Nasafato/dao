import fs from "fs";
import path from "path";

const daoPath = path.join(__dirname, "dao.txt");
const daoJsonPath = path.join(__dirname, "dao.json");

function buildDaoJson() {
  const dao = fs.readFileSync(daoPath, "utf8");
  const daoJson = dao.split("\n");
  fs.writeFileSync(daoJsonPath, JSON.stringify(daoJson));
}

export { buildDaoJson };

if (require.main === module) {
  buildDaoJson();
}
