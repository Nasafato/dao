import * as z from "zod";

export const MEMORY_STATUS = {
  LEARNING: "LEARNING",
  NOT_LEARNING: "NOT_LEARNING",
} as const;

export const VerseMemoryStatusSchema = z.object({
  //   userId: z.string(),
  id: z.string(),
  verseId: z.number(),
  userId: z.string(),
  status: z.enum([MEMORY_STATUS.LEARNING, MEMORY_STATUS.NOT_LEARNING]),
  nextReviewDatetime: z.number(),
});
export const VerseMemoryStatus = {
  tableName: "verse-memory-status",
};
export type VerseMemoryStatusType = z.infer<typeof VerseMemoryStatusSchema>;

export const VerseTotalMemoryTestSchema = z.object({
  id: z.string(),
  userId: z.string(),
  verseId: z.number(),
  type: z.enum(["total"]),
  result: z.enum(["pass", "fail"]),
});

export const VerseMemoryTest = {
  tableName: "verse-memory-test",
};

const VerseClozeMemoryTestSchema = z.object({
  verseId: z.number(),
  type: z.enum(["cloze"]),
  // The total number of clozes completed
  result: z.number(),
});

export const VerseMemoryTestSchema = z.union([
  VerseTotalMemoryTestSchema,
  VerseClozeMemoryTestSchema,
]);

export type VerseMemoryTestType = z.infer<typeof VerseMemoryTestSchema>;
