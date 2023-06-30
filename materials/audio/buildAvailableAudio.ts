import fs from "fs";
import path from "path";

async function main() {
  const files = await fs.promises.readdir(path.join(__dirname, "files"));
  await fs.promises.writeFile(
    path.join(__dirname, "availableFiles.json"),
    JSON.stringify(files)
  );
}

if (require.main === module) {
  main();
}
