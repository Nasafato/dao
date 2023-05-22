import { awaitDbInit, wrappedDb as db } from "../db";
import {
  VerseMemoryTestSchemaArray as arraySchema,
  VerserMemoryTestIndexes as indexes,
  VerseMemoryTestSchema as schema,
  VerseMemoryTestTableName as tableName,
} from "./schema";

export class VerseMemoryTest {
  static tableName = tableName;
  static indexes = indexes;
  static schema = schema;
  static arraySchema = arraySchema;

  static async get({ id }: { id: IDBValidKey }) {
    await awaitDbInit();
    let memoryTest = await db.get(tableName, id);
    return schema.parse(memoryTest);
  }

  static async getAll({
    userId_verseId,
  }: {
    userId_verseId: [string, number];
  }) {
    await awaitDbInit();
    const statuses = await db.getAllFromIndex(
      tableName,
      indexes.userId_verseId.indexName,
      userId_verseId
    );

    return arraySchema.parse(statuses);
  }
}
