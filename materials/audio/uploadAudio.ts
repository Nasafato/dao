import { withStdinStdout } from "../cliUtils";
import fetch from "node-fetch";

const BASE_URL = `https://${process.env.BUNNYCDN_STORAGE_ENDPOINT}`;
async function main() {
  await withStdinStdout(async (ctx, input) => {
    const outputFilename = ctx.outputFile;
    if (!outputFilename) {
      throw new Error("No output file specified");
    }
    const outputFile = ctx.outputFile;
    if (!outputFile) {
      throw new Error("No output file specified");
    }
    const filename = outputFile.split("/").pop();
    const url = `${BASE_URL}/${process.env.BUNNYCDN_STORAGE_ZONE}/${filename}`;
    const apiKey = process.env.BUNNYCDN_API_KEY;
    if (!apiKey) {
      throw new Error("No BunnyCDN API key specified");
    }
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/octet-stream",
        AccessKey: apiKey,
      },
      body: input,
    });
    if (!response.ok) {
      console.error(response.status, response.statusText);
      throw new Error("Failed to upload file");
    }
  });
}

if (require.main === module) {
  main();
}
