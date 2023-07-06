import fs from "fs";
import { VerseCombined } from "types/materials";

async function main() {
  const args = process.argv.slice(2);
  const [
    daoInputPath,
    descriptionsInputPath,
    translationsInputPath,
    explanationsInputPath,
  ] = args;
  const dao = JSON.parse(await fs.promises.readFile(daoInputPath, "utf8"));
  const descriptions = JSON.parse(
    await fs.promises.readFile(descriptionsInputPath, "utf8")
  );
  const translations = JSON.parse(
    await fs.promises.readFile(translationsInputPath, "utf8")
  );
  const explanations = JSON.parse(
    await fs.promises.readFile(explanationsInputPath, "utf8")
  );

  const combined: VerseCombined[] = [];
  for (let i = 0; i < dao.length; i++) {
    combined.push({
      verseId: i + 1,
      verse: dao[i],
      description: descriptions[i],
      explanation: explanations[i],
      translations: translations[i],
    });
  }

  process.stdout.write(JSON.stringify(combined));
}

if (require.main === module) {
  main();
}
