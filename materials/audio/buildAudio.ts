import fetch from "node-fetch";
import { Readable } from "stream";
import { processLines, withStdinStdout } from "materials/cliUtils";

const JOSH_VOICE_ID = "TxGEqnHWrfWFTfGW9XjX";

const BASE_URL = "https://api.elevenlabs.io/v1";

async function main() {
  await withStdinStdout(async (ctx, input) => {
    const lines = await processLines(input);
    const text = lines.join("\n");
    const apiKey = process.env.ELEVEN_LABS_API_KEY || "";
    if (!apiKey) {
      throw new Error("ELEVEN_LABS_API_KEY not set");
    }
    console.log(text);
    const stream = await fetch(
      `${BASE_URL}/text-to-speech/${JOSH_VOICE_ID}/stream`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          accept: "audio/mpeg",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
          },
        }),
      }
    ).then((r) => r.body as Readable | null);

    return stream;
  });
}

if (require.main === module) {
  main();
}
