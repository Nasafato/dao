import { z } from "zod";

export const MEMORY_STATUS = {
  LEARNING: "LEARNING",
  NOT_LEARNING: "NOT_LEARNING",
} as const;

export const VerseMemoryStatusSchema = z.object({
  id: z.string(),
  verseId: z.number(),
  userId: z.string(),
  status: z.enum([MEMORY_STATUS.LEARNING, MEMORY_STATUS.NOT_LEARNING]),
  nextReviewDatetime: z.number(),
});

export const VerseMemoryStatusSchemaArray = z.array(VerseMemoryStatusSchema);
export const tableName = "verse-memory-status";
export const indexes = {
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
};
export const schema = VerseMemoryStatusSchema;
export const arraySchema = VerseMemoryStatusSchemaArray;

export function createVerseMemoryStatusV1Store(db: IDBDatabase) {
  const verseMemoryStatusObjectStore = db.createObjectStore(tableName, {
    keyPath: "id",
  });
  for (const [indexName, { keyPath, opts }] of Object.entries(indexes)) {
    if (!verseMemoryStatusObjectStore.indexNames.contains(indexName)) {
      verseMemoryStatusObjectStore.createIndex(indexName, keyPath, opts);
    }
  }
}
