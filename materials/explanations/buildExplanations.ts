import fs from "fs";
import path from "path";

const explanationsPath = path.join(__dirname, "./explanations");

async function main() {
  const files = await fs.promises.readdir(explanationsPath);
  files.sort((a, b) => {
    let aName = a.replace(".txt", "");
    let bName = b.replace(".txt", "");
    return aName.localeCompare(bName);
  });
  const explanations: string[] = [];
  for (const file of files) {
    explanations.push(
      await fs.promises.readFile(path.join(explanationsPath, file), "utf-8")
    );
  }

  process.stdout.write(JSON.stringify(explanations));
}

if (require.main === module) {
  main();
}
