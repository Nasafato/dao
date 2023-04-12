import * as z from "zod";

export type DictionaryEntry = z.infer<typeof dictionaryEntrySchema>;
export const dictionaryEntrySchema = z.object({
  spelling: z.string(),
  source: z.string(),
  traditional: z.string().optional(),
  word: z.string(),
  pinyin: z.array(z.string()),
  definitions: z.object({
    english: z.array(z.string()),
    chinese: z.array(z.string()).optional(),
  }),
});
