import path from "path";
import { z } from "zod";

export const CONFIG = {
  dictionaryPath: path.join(__dirname, "dictionary.json"),
  testPath: path.join(__dirname, "test-dictionary.json"),
  cedictPath: path.join(__dirname, "cedict.txt"),
  augmentsPath: path.join(__dirname, "augments.json"),
};

export const EntrySchema = z.object({
  pronunciation: z.string(),
  simplified: z.string(),
  traditional: z.string(),
  definitions: z.array(z.string()),
});
export type Entry = z.infer<typeof EntrySchema>;
