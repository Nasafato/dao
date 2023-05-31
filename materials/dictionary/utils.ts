import { z } from "zod";

export const CharacterVariantSchema = z.object({
  character: z.string(),
  pronunciation: z.array(z.string()),
  spelling: z.enum(["traditional", "simplified"]),
  source: z.literal("cedict"),
});

export const DictionaryEntrySchema = z.object({
  character: z.string(),
  spelling: z.enum(["traditional", "simplified"]),
  definitions: z.array(
    z.object({
      pronunciation: z.array(z.string()),
      english: z.array(z.string()),
    })
  ),
  variants: z.array(CharacterVariantSchema),
  source: z.literal("cedict"),
});

export type CharacterVariant = z.infer<typeof CharacterVariantSchema>;

export type DictionaryEntry = z.infer<typeof DictionaryEntrySchema>;

export const VARIANT_OF_REGEX = /variant of (.*?)\[(.*)\]/g;

export function matchVariantRegex(s: string) {
  VARIANT_OF_REGEX.lastIndex = 0;
  return VARIANT_OF_REGEX.exec(s);
}
