import { createId } from "@paralleldrive/cuid2";
import { wrap } from "idb";
import { DATE_CONSTS } from "../../consts";
import { awaitDbInit, db as unwrappedDb } from "./db";
import { VerseMemoryStatus } from "./verseMemoryStatus";
import { VerseMemoryTest } from "./verseMemoryTest";

interface Args {
  userId: string;
  verseId: number;
  test: {
    type: "total";
    result: "pass" | "fail";
  };
}

export async function reportMemoryTestResult({ userId, verseId, test }: Args) {
  await awaitDbInit();
  const db = wrap(unwrappedDb);
  const status = await VerseMemoryStatus.get({
    userId_verseId: [userId, verseId],
  });

  const memoryTests = await VerseMemoryTest.getAll({
    userId_verseId: [userId, verseId],
  });

  memoryTests.sort((a, b) => b.createdAt - a.createdAt);
  let numSuccesses = 0;
  for (const memoryTest of memoryTests) {
    if (memoryTest.result !== "pass") {
      break;
    }
    numSuccesses++;
  }

  if (test.result === "pass") {
    numSuccesses++;
  } else {
    numSuccesses = 0;
  }

  // The next review datetime is the current time plus the max of:
  // - 15 minutes
  // - 1.8 ^ numSuccesses hours
  // Capped at 1 month
  const numHours = Math.max(
    0.25,
    numSuccesses === 0 ? 0 : Math.pow(1.8, numSuccesses)
  );
  const nextReviewDatetime =
    Date.now() + Math.min(numHours * 60 * 60 * 1000, DATE_CONSTS.ONE_MONTH);

  const tx = db.transaction(
    [VerseMemoryTest.tableName, VerseMemoryStatus.tableName],
    "readwrite"
  );
  const [statusKey, testKey] = await Promise.all([
    tx.objectStore(VerseMemoryStatus.tableName).put({
      ...status,
      nextReviewDatetime,
    }),
    tx.objectStore(VerseMemoryTest.tableName).add({
      id: createId(),
      userId,
      verseId,
      type: test.type,
      result: test.result,
      createdAt: Date.now(),
    }),
    tx.done,
  ]);

  const memoryTest = await VerseMemoryTest.get({ id: testKey });
  const updatedStatus = await VerseMemoryStatus.get({ id: statusKey });

  return {
    memoryTest,
    memoryStatus: updatedStatus,
  };
}
