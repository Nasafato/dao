import * as z from "zod";

export const MEMORY_STATUS = {
  LEARNING: "LEARNING",
  NOT_LEARNING: "NOT_LEARNING",
} as const;

export const VerseMemoryStatus = z.object({
  //   userId: z.string(),
  verseId: z.number(),
  status: z.enum([MEMORY_STATUS.LEARNING, MEMORY_STATUS.NOT_LEARNING]),
  nextReviewDatetime: z.number(),
});

export const VerseTotalMemoryTest = z.object({
  verseId: z.number(),
  type: z.enum(["total"]),
  result: z.enum(["pass", "fail"]),
});

// const VerseClozeMemoryTest = z.object({
//   verseId: z.number(),
//   type: z.enum(["cloze"]),
//   // The total number of clozes completed
//   result: z.number(),
// });
