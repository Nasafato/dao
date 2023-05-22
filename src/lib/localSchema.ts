import * as z from "zod";

export const VerseTotalMemoryTestSchema = z.object({
  id: z.string(),
  userId: z.string(),
  verseId: z.number(),
  type: z.literal("total"),
  result: z.enum(["pass", "fail"]),
  createdAt: z.number(),
});

export const VerseMemoryTestTable = {
  tableName: "verse-memory-test",
  indexes: {
    userId_verseId: {
      indexName: "userId_verseId",
      keyPath: ["userId", "verseId"],
      opts: { unique: false },
    },
    createdAt: {
      indexName: "createdAt",
      keyPath: "createdAt",
      opts: { unique: false },
    },
  },
} as const;

const VerseClozeMemoryTestSchema = z.object({
  verseId: z.number(),
  type: z.literal("cloze"),
  // The total number of clozes completed
  result: z.number(),
  createdAt: z.number(),
});

export const VerseMemoryTestSchema = z.discriminatedUnion("type", [
  VerseTotalMemoryTestSchema,
  VerseClozeMemoryTestSchema,
]);
export const VerseMemoryTestSchemaArray = z.array(VerseMemoryTestSchema);

export type VerseMemoryTestType = z.infer<typeof VerseMemoryTestSchema>;
