import fs from "fs";

async function main() {
  const args = process.argv.slice(2);
  const [daoInputPath, descriptionsInputPath, translationsInputPath] = args;
  const dao = JSON.parse(await fs.promises.readFile(daoInputPath, "utf8"));
  const descriptions = JSON.parse(
    await fs.promises.readFile(descriptionsInputPath, "utf8")
  );
  const translations = JSON.parse(
    await fs.promises.readFile(translationsInputPath, "utf8")
  );

  const combined = [];
  for (let i = 0; i < dao.length; i++) {
    combined.push({
      verseId: i + 1,
      verse: dao[i],
      description: descriptions[i],
      translations: translations[i],
    });
  }

  process.stdout.write(JSON.stringify(combined));
}

if (require.main === module) {
  main();
}
