import { DATE_CONSTS } from "../consts";
import {
  MEMORY_STATUS,
  VerseMemoryStatusTable,
  VerseMemoryStatusSchema,
  VerseMemoryStatusType,
  VerseMemoryTestTable,
  VerseMemoryTestSchema,
  VerseMemoryTestType,
  VerseMemoryStatusSchemaArray,
} from "./localSchema";
import { createId, init } from "@paralleldrive/cuid2";
// import { openDB, deleteDB, wrap, unwrap, IDBPDatabase } from "idb";

// export let localDb: IDBPDatabase | null = null;
export let localDb: IDBDatabase;

export const USER_ID = "local-user-placeholder";
export const INDEXED_DB_NAME = "daodejing";
export const INDEXED_DB_VERSION = 1;

let openRequest: IDBOpenDBRequest;
export let initializeDbPromise: Promise<IDBDatabase> | null;

export function initializeDb() {
  console.log("Setting up");
  if (initializeDbPromise) {
    return;
  }
  initializeDbPromise = new Promise((resolve, reject) => {
    indexedDB.databases().then((databases) => {
      console.log("databases", databases);
    });
    if (localDb) {
      return;
    }

    if (openRequest) {
      return;
    }
    openRequest = indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION);
    console.log("openRequest", openRequest);
    openRequest.onupgradeneeded = () => {
      console.log("onupgradeneeded");
      localDb = openRequest.result;
      const verseMemoryStatusObjectStore = localDb.createObjectStore(
        VerseMemoryStatusTable.tableName,
        {
          keyPath: "id",
        }
      );
      for (const [indexName, { keyPath, opts }] of Object.entries(
        VerseMemoryStatusTable.indexes
      )) {
        if (!verseMemoryStatusObjectStore.indexNames.contains(indexName)) {
          verseMemoryStatusObjectStore.createIndex(indexName, keyPath, opts);
        }
      }

      const verseMemoryTestObjectStore = localDb.createObjectStore(
        VerseMemoryTestTable.tableName,
        { keyPath: "id" }
      );
      for (const [indexName, { keyPath, opts }] of Object.entries(
        VerseMemoryTestTable.indexes
      )) {
        if (!verseMemoryTestObjectStore.indexNames.contains(indexName)) {
          verseMemoryTestObjectStore.createIndex(indexName, keyPath, opts);
        }
      }
    };

    openRequest.onerror = () => {
      console.error(openRequest.error);
      reject(openRequest.error);
    };
    openRequest.onsuccess = () => {
      localDb = openRequest.result;
      resolve(localDb);

      localDb.onversionchange = () => {
        localDb.close();
        alert("Database is outdated, please reload the page.");
      };
    };

    openRequest.onblocked = () => {
      console.error("Database is blocked");
      reject(new Error("Database is blocked"));
    };
  });
}

export async function getVerseMemoryStatusById(id: string) {
  const verseMemoryStatus = await get(VerseMemoryStatusTable.tableName, id);
  if (!verseMemoryStatus) {
    console.log("None found");
    return null;
  }
  const memoryStatus = VerseMemoryStatusSchema.parse(verseMemoryStatus);
  console.log("memoryStatus", memoryStatus);
  return memoryStatus;
}

export async function getVerseMemoryStatuses(userId: string) {
  await initializeDbPromise;
  const verseMemoryStatuses = await new Promise((resolve, reject) => {
    const index = localDb
      .transaction(VerseMemoryStatusTable.tableName, "readonly")
      .objectStore(VerseMemoryStatusTable.tableName)
      .index(VerseMemoryStatusTable.indexes.userId.indexName);

    const request = index.getAll(userId);
    request.onsuccess = (event) => {
      const req = event.target as IDBRequest;
      resolve(req.result);
    };
    request.onerror = (event) => {
      const req = event.target as IDBRequest;
      reject(req.error);
    };
  });

  const result = VerseMemoryStatusSchemaArray.parse(verseMemoryStatuses);
  return result;
}

export async function getVerseMemoryStatus(userId: string, verseId: number) {
  await initializeDbPromise;
  const verseMemoryStatus = await new Promise((resolve, reject) => {
    const index = localDb
      .transaction(VerseMemoryStatusTable.tableName, "readonly")
      .objectStore(VerseMemoryStatusTable.tableName)
      .index(VerseMemoryStatusTable.indexes.userId_verseId.indexName);

    const request = index.get([userId, verseId]);
    request.onsuccess = (event) => {
      const req = event.target as IDBRequest;
      resolve(req.result);
    };
    request.onerror = (event) => {
      const req = event.target as IDBRequest;
      reject(req.error);
    };
  });

  if (!verseMemoryStatus) {
    throw new Error("None found");
  }
  const memoryStatus = VerseMemoryStatusSchema.parse(verseMemoryStatus);
  return memoryStatus;
}

export async function setVerseMemoryStatus(
  verseMemoryStatus: VerseMemoryStatusType
) {
  const result = await set(VerseMemoryStatusTable.tableName, verseMemoryStatus);
  return VerseMemoryStatusSchema.parse(result);
}

export async function updateStatus(
  userId: string,
  verseId: number,
  status: keyof typeof MEMORY_STATUS
) {
  let id;
  try {
    const existingStatus = await getVerseMemoryStatus(userId, verseId);
    id = existingStatus.id;
  } catch (err) {
    id = createId();
  }
  let numSuccesses = 0;
  const nextReview =
    Date.now() +
    Math.max(
      Math.max(0.25, Math.pow(1.8, numSuccesses)) * 60 * 60 * 1000,
      DATE_CONSTS.ONE_MONTH
    );

  const memoryStatus: VerseMemoryStatusType = {
    nextReviewDatetime: nextReview,
    verseId,
    status,
    userId: USER_ID,
    id,
  };

  const newMemoryStatus = await setVerseMemoryStatus(memoryStatus);
  console.log("newMemoryStatus", newMemoryStatus);
  return newMemoryStatus;
}

export async function reportMemoryTestResult(
  userId: string,
  verseId: number,
  test: {
    type: "total";
    result: "pass" | "fail";
  }
) {
  await initializeDbPromise;
  if (!localDb) {
    throw new Error("localDb is not initialized");
  }

  const status = VerseMemoryStatusSchema.parse(
    await new Promise((resolve, reject) => {
      const tx = localDb
        .transaction(VerseMemoryStatusTable.tableName, "readonly")
        .objectStore(VerseMemoryStatusTable.tableName)
        .index(VerseMemoryStatusTable.indexes.userId_verseId.indexName)
        .get([userId, verseId]);
      tx.onsuccess = (event) => {
        const req = event.target as IDBRequest;
        resolve(req.result);
      };
      tx.onerror = (event) => {
        const req = event.target as IDBRequest;
        reject(req.error);
      };
    })
  );

  const update = await new Promise<{
    memoryTest: VerseMemoryTestType;
    memoryStatus: VerseMemoryStatusType;
  }>((resolve, reject) => {
    const tx = localDb.transaction(
      [VerseMemoryTestTable.tableName, VerseMemoryStatusTable.tableName],
      "readwrite"
    );

    tx.onerror = (event) => {
      const req = event.target as IDBRequest;
      reject(req.error);
    };

    const reportTestRequest = tx
      .objectStore(VerseMemoryTestTable.tableName)
      .add({
        id: createId(),
        userId,
        verseId,
        type: test.type,
        result: test.result,
        createdAt: Date.now(),
      });

    const updateStatusRequest = tx
      .objectStore(VerseMemoryStatusTable.tableName)
      .put({
        ...status,
        nextReviewDatetime: Date.now() + DATE_CONSTS.ONE_DAY,
      });

    Promise.all([
      new Promise((resolve, reject) => {
        reportTestRequest.onsuccess = (event) => {
          const req = event.target as IDBRequest;
          resolve(req.result);
        };

        reportTestRequest.onerror = (event) => {
          const req = event.target as IDBRequest;
          reject(req.error);
        };
      }),
      new Promise((resolve, reject) => {
        updateStatusRequest.onsuccess = (event) => {
          const req = event.target as IDBRequest;
          resolve(req.result);
        };

        updateStatusRequest.onerror = (event) => {
          const req = event.target as IDBRequest;
          reject(req.error);
        };
      }),
    ]).then(([memoryTestRaw, memoryStatusRaw]) => {
      const memoryTest = VerseMemoryTestSchema.parse(memoryTestRaw);
      const memoryStatus = VerseMemoryStatusSchema.parse(memoryStatusRaw);
      resolve({ memoryTest, memoryStatus });
    });
  });

  return update;
}

async function get<T = unknown>(tableName: string, key: IDBValidKey) {
  await initializeDbPromise;
  if (!localDb) {
    throw new Error("localDb is not initialized");
  }
  const transaction = localDb.transaction(tableName, "readonly");
  const store = transaction.objectStore(tableName);
  const request = store.get(key);
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}

async function set<T>(tableName: string, item: T) {
  await initializeDbPromise;
  if (!localDb) {
    throw new Error("localDb is not initialized");
  }
  const transaction = localDb.transaction(tableName, "readwrite");
  const store = transaction.objectStore(tableName);
  const request = store.put(item);

  const success = await new Promise<IDBValidKey>((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });

  const result = await get(tableName, success);
  return result;
}
