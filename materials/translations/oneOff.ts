import fs from "fs";
import path from "path";
import { Translators, VerseTranslationSchema } from "../../types/materials";

async function main() {
  const translations = VerseTranslationSchema.array().parse(
    JSON.parse(
      await fs.promises.readFile(
        path.join(__dirname, "./translations.json"),
        "utf-8"
      )
    )
  );
  for (let i = 0; i < translations.length; i++) {
    const verseId = i + 1;
    const t = translations[i];
    for (const translator of Translators) {
      const translation = t[translator];
      if (translation)
        await fs.promises.writeFile(
          path.join(
            __dirname,
            `./files/${verseId > 9 ? verseId : `0${verseId}`}${translator}.txt`
          ),
          translation
        );
    }
  }
}

main();
