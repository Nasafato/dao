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
export const VerseMemoryStatusSchemaArray = z.array(VerseMemoryStatusSchema);

export const VerseMemoryStatusTable = {
  tableName: "verse-memory-status",
  indexes: {
    userId: {
      indexName: "userId",
      keyPath: "userId",
      opts: { unique: false },
    },
    status: {
      indexName: "status",
      keyPath: "status",
      opts: { unique: false },
    },
    nextReviewDateTime: {
      indexName: "nextReviewDateTime",
      keyPath: "nextReviewDateTime",
      opts: { unique: false },
    },
    userId_verseId: {
      indexName: "userId_verseId",
      keyPath: ["userId", "verseId"],
      opts: { unique: true },
    },
  },
} as const;
export type VerseMemoryStatusType = z.infer<typeof VerseMemoryStatusSchema>;

export const VerseTotalMemoryTestSchema = z.object({
  id: z.string(),
  userId: z.string(),
  verseId: z.number(),
  type: z.enum(["total"]),
  result: z.enum(["pass", "fail"]),
  createdAt: z.number(),
});

export const VerseMemoryTestTable = {
  tableName: "verse-memory-test",
  indexes: {
    userId_verseId: {
      indexName: "userId_verseId",
      keyPath: ["userId", "verseId"],
      opts: { unique: true },
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
  type: z.enum(["cloze"]),
  // The total number of clozes completed
  result: z.number(),
  createdAt: z.number(),
});

export const VerseMemoryTestSchema = z.union([
  VerseTotalMemoryTestSchema,
  VerseClozeMemoryTestSchema,
]);

export type VerseMemoryTestType = z.infer<typeof VerseMemoryTestSchema>;
