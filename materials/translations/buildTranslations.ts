import fs from "fs";
import path from "path";

async function main() {
  const customTranslations = JSON.parse(
    await fs.promises.readFile(
      path.join(__dirname, "customTranslations.json"),
      "utf8"
    )
  );
  const historicalTranslations = JSON.parse(
    await fs.promises.readFile(
      path.join(__dirname, "historicalTranslations.json"),
      "utf8"
    )
  );

  const translations = [];
  for (let i = 0; i < 81; i++) {
    const verseId = i + 1;
    const gouTranslation = customTranslations.find(
      (t: { verseId: number; text: string[] }) => t.verseId === verseId
    );
    translations.push({
      verseId: i + 1,
      ...(gouTranslation ? { gou: gouTranslation.text.join(" ") } : {}),
      ...historicalTranslations[i],
    });
  }

  process.stdout.write(JSON.stringify(translations));
}

if (require.main === module) {
  main();
}
