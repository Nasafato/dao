import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { awaitDbInit, wrappedDb as db } from "../db";
import {
  MEMORY_STATUS,
  arraySchema,
  indexes,
  schema,
  tableName,
} from "./schema";

export class VerseMemoryStatus {
  static tableName = tableName;
  static indexes = indexes;
  static schema = schema;
  static arraySchema = arraySchema;

  static async get({
    id,
    userId_verseId,
  }: {
    id?: IDBValidKey;
    userId_verseId?: [string, number];
  }) {
    await awaitDbInit();
    let status;
    if (id) {
      status = await db.get(tableName, id);
    } else if (userId_verseId) {
      status = await db.getFromIndex(
        tableName,
        indexes.userId_verseId.indexName,
        userId_verseId
      );
    } else {
      throw new Error("Must provide either id or userId_verseId");
    }

    return schema.parse(status);
  }

  static async getAll({ userId }: { userId: string }) {
    await awaitDbInit();
    const statuses = await db.getAllFromIndex(
      tableName,
      indexes.userId.indexName,
      userId
    );

    return arraySchema.parse(statuses);
  }

  static async update({
    userId_verseId,
    data,
  }: {
    userId_verseId: [string, number];
    data: Partial<VerseMemoryStatusType>;
  }) {
    const [userId, verseId] = userId_verseId;
    await awaitDbInit();
    let update;
    try {
      const existingStatus = await VerseMemoryStatus.get({ userId_verseId });
      update = {
        ...existingStatus,
        ...data,
      };
    } catch (err) {
      update = {
        id: createId(),
        userId,
        verseId,
        nextReviewDatetime: Date.now(),
        status: data.status ?? MEMORY_STATUS.LEARNING,
      };
    }

    return await VerseMemoryStatus.put(update);
  }

  static async put(status: VerseMemoryStatusType) {
    await awaitDbInit();
    const key = await db.put(tableName, status);
    return await VerseMemoryStatus.get({ id: key });
  }
}

export type VerseMemoryStatusType = z.infer<typeof schema>;
