import { z } from "zod";
import { Definition, Entry } from "@prisma/client";

export const Translators = ["gou", "goddard", "legge", "susuki"] as const;
export const VerseTranslationSchema = z.object({
  gou: z.string().optional(),
  goddard: z.string(),
  susuki: z.string(),
  legge: z.string(),
});
export type VerseTranslation = z.infer<typeof VerseTranslationSchema>;

export const VerseCombinedSchema = z.object({
  verseId: z.number().min(1).max(81),
  verse: z.string(),
  description: z.string(),
  explanation: z.string().optional(),
  translations: VerseTranslationSchema,
});
export type VerseCombined = z.infer<typeof VerseCombinedSchema>;

export const DenormalizedDictSchema = z.object({
  id: z.array(z.number()),
  pronunciation: z.array(z.string()),
  simplified: z.array(z.string()),
  traditional: z.array(z.string()),
  relevancy: z.array(z.number()),
  definitions: z.object({
    id: z.array(z.number()),
    entryId: z.array(z.number()),
    definition: z.array(z.string()),
    relevancy: z.array(z.number()),
  }),
});
export type DenormalizedDictSchema = z.infer<typeof DenormalizedDictSchema>;
export type NormalizedDict = Array<Entry & { definitions: Definition[] }>;
