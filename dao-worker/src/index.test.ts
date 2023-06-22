import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

describe("Worker", () => {
  let worker: UnstableDevWorker;

  beforeAll(async () => {
    worker = await unstable_dev("src/index.ts", {
      experimental: { disableExperimentalWarning: true },
      local: false,
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  it("should return Hello World", async () => {
    const newUrl = new URL(
      "https://dao-worker.daodejing.workers.dev/human03.mp3"
      //   "https://dao-worker.daodejing.workers.dev/dao/human01.mp3"
    );
    const resp = await worker.fetch(newUrl);
    if (resp) {
      console.log(new Map(resp.headers));
      //   const text = await resp.text();
      //   expect(text).toMatchInlineSnapshot(`"Hello World!"`);
    }
  });
});
