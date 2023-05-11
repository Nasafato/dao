const fs = require("fs");
const path = require("path");

// Read `dao.txt` and write it line by line into `dao.json`
const daoPath = path.join(__dirname, "dao.txt");
const daoJsonPath = path.join(__dirname, "dao.json");

function buildDaoJson() {
  const dao = fs.readFileSync(daoPath, "utf8");
  const daoJson = dao.split("\n");
  fs.writeFileSync(daoJsonPath, JSON.stringify(daoJson));
}

module.exports = {
  buildDaoJson,
};

if (require.main === module) {
  buildDaoJson();
}
