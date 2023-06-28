import { z } from "zod";

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
