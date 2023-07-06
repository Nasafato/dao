import { expect, test } from "vitest";
import { normalizeDict } from "@/utils";

test("dict normalized", async () => {
  const uniqueAllCharsDict = await import(
    "materials/dictionary/uniqueAllCharsDict.json"
  );
  const normalizedDict = normalizeDict(uniqueAllCharsDict);

  expect(normalizedDict).toBeDefined();
});
