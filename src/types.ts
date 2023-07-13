import * as z from "zod";

export type DictionaryEntry = z.infer<typeof DictionaryEntrySchema>;
export const DictionaryEntrySchema = z.object({
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

export const DictionarySchema = z.record(DictionaryEntrySchema);

export type DictionarySchemaType = z.infer<typeof DictionarySchema>;

export type DaoVerse = {
  id: number;
  text: string;
};

export const VerseToUserSchema = z.object({
  verseId: z.number(),
  status: z.enum(["learning", "reviewing", "not-learning"]),
});

export type VerseToUserSchemaType = z.infer<typeof VerseToUserSchema>;

export type Dict = {
  [key: string]: string | Dict;
};

export type Link = {
  key: string;
  name: React.ReactNode;
  href: string;
  children?: Link[];
};

export type LinkWithChildren = Link & {
  children: Link[];
};
