import fs from "fs";
import path from "path";
import { buildTranslationName } from "../../types/materials";

async function main() {
  const files = await fs.promises.readdir(path.join(__dirname, "files"));
  for (const file of files) {
    const verseId = file.slice(0, 2);
    const translator = file.slice(2, -4);
    const audioFileName = buildTranslationName({
      verseId: Number(verseId),
      translator: translator as any,
      language: "english",
    });
    // Rename file to audioFileName
    await fs.promises.rename(
      path.join(__dirname, "files", file),
      path.join(__dirname, "files", `${audioFileName}.txt`)
    );
  }
}

if (require.main === module) {
  main();
}
