import fs from "fs";
import path from "path";
import {
  VerseTranslation,
  Translators,
  VerseTranslationSchema,
} from "types/materials";

async function main() {
  const translationFiles = await fs.promises.readdir(
    path.join(__dirname, "files")
  );

  const translationsMap: Record<string, Partial<VerseTranslation>> = {};
  for (const file of translationFiles) {
    const verseId = file.slice(0, 2);
    const translator = file.slice(2, -4) as (typeof Translators)[number];
    const translation = await fs.promises.readFile(
      path.join(__dirname, "files", file),
      "utf8"
    );
    if (translationsMap[verseId]) {
      translationsMap[verseId][translator] = translation;
    } else {
      translationsMap[verseId] = { [translator]: translation };
    }
  }

  const entries = Object.entries(translationsMap);
  entries.sort((a, b) => {
    return Number(a[0]) - Number(b[0]);
  });
  const translations = VerseTranslationSchema.array().parse(
    entries.map((e) => {
      return e[1];
    })
  );

  process.stdout.write(JSON.stringify(translations));
}

if (require.main === module) {
  main();
}
