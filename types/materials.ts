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

/*
 * Eleven Labs API
 */
export const ElevenLabsVoiceSchema = z.object({
  voice_id: z.string(),
  name: z.string(),
  samples: z.nullable(z.unknown()),
  category: z.string(),
  fine_tuning: z.object({
    model_id: z.nullable(z.unknown()),
    language: z.nullable(z.unknown()),
    is_allowed_to_fine_tune: z.boolean(),
    fine_tuning_requested: z.boolean(),
    finetuning_state: z.string(),
    verification_attempts: z.nullable(z.unknown()),
    verification_failures: z.array(z.unknown()),
    verification_attempts_count: z.number(),
    slice_ids: z.nullable(z.unknown()),
    manual_verification: z.nullable(z.unknown()),
    manual_verification_requested: z.boolean(),
  }),
  labels: z.record(z.unknown()),
  description: z.nullable(z.string()),
  preview_url: z.string(),
  available_for_tiers: z.array(z.unknown()),
  settings: z.nullable(z.unknown()),
  sharing: z.nullable(z.unknown()),
});

export const ElevenLabsGetVoicesResponseSchema = z.object({
  voices: z.array(ElevenLabsVoiceSchema),
});
