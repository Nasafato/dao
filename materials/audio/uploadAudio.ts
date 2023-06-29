import fs from "fs";
import { withStdinStdout } from "../cliUtils";

const BASE_URL = "https://storage.bunnycdn.com/";
async function main() {
  await withStdinStdout(async (ctx, input) => {
    const outputFilename = ctx.outputFile;
    if (!outputFilename) {
      throw new Error("No output file specified");
    }
    console.log(ctx.inputFilePath, ctx.outputFilePath);
    const language = "english";
    const translator = language === "english" ? "gou" : "";
    const url = `${BASE_URL}/${process.env.BUNNYCDN_STORAGE_ZONE}/${language}${
      translator ? "/" + translator : ""
    }/${outputFilename}`;
    // await fetch();
  });
}

if (require.main === module) {
  main();
}
