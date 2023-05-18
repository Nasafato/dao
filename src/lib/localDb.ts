import { DATE_CONSTS } from "../consts";
import {
  MEMORY_STATUS,
  VerseMemoryStatus,
  VerseMemoryStatusSchema,
  VerseMemoryStatusType,
  VerseMemoryTest,
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

// export function initializeDb() {
//   initializeDbPromise = _initDb();
// }

// async function _initDb() {
//   localDb = await openDB(INDEXED_DB_NAME, INDEXED_DB_VERSION, {
//     upgrade(db, oldVersion, newVersion, transaction, event) {
//       console.log("Upgrading", db, oldVersion, newVersion, transaction, event);
//       const store = db.createObjectStore(VerseMemoryStatus.tableName, {
//         keyPath: "id",
//       });
//       store.createIndex("userId_verseId", ["userId", "verseId"], {
//         unique: true,
//       });
//     },
//   });
// }

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
        VerseMemoryStatus.tableName,
        {
          keyPath: "id",
        }
      );
      verseMemoryStatusObjectStore.createIndex(
        "userId_verseId",
        ["userId", "verseId"],
        {
          unique: true,
        }
      );
      // localDb.createObjectStore(VerseMemoryTest.tableName, {
      //   keyPath: "id",
      // });
    };

    openRequest.onerror = () => {
      console.error(openRequest.error);
      reject(openRequest.error);
    };
    openRequest.onsuccess = () => {
      localDb = openRequest.result;
      resolve(localDb);

      // const storeNames = localDb.objectStoreNames;
      // if (!storeNames.contains(VerseMemoryStatus.tableName)) {
      //   localDb.createObjectStore(VerseMemoryStatus.tableName, {
      //     keyPath: "id",
      //   });
      // }
      // if (!storeNames.contains(VerseMemoryTest.tableName)) {
      //   localDb.createObjectStore(VerseMemoryTest.tableName, {
      //     keyPath: "id",
      //   });
      // }

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
  const verseMemoryStatus = await get(VerseMemoryStatus.tableName, id);
  if (!verseMemoryStatus) {
    console.log("None found");
    return null;
  }
  const memoryStatus = VerseMemoryStatusSchema.parse(verseMemoryStatus);
  console.log("memoryStatus", memoryStatus);
  return memoryStatus;
}

export async function getVerseMemoryStatus(userId: string, verseId: number) {
  await initializeDbPromise;
  const verseMemoryStatus = await new Promise((resolve, reject) => {
    const index = localDb
      .transaction(VerseMemoryStatus.tableName, "readonly")
      .objectStore(VerseMemoryStatus.tableName)
      .index("userId_verseId");

    index.getAllKeys().onsuccess = (event) => {
      // @ts-ignore
      console.log("allKeys", event.target.result);
    };
    const request = index.get([userId, verseId]);
    request.onsuccess = (event) => {
      // @ts-ignore
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      // @ts-ignore
      reject(event.target.error);
    };
  });
  // console.log("getVerseMemoryStatus", verseId);
  // const verseMemoryStatus = await get(
  //   VerseMemoryStatus.tableName,
  //   verseId.toString()
  // );
  if (!verseMemoryStatus) {
    console.log("None found");
    return null;
  }
  const memoryStatus = VerseMemoryStatusSchema.parse(verseMemoryStatus);
  console.log("memoryStatus", memoryStatus);
  return memoryStatus;
}

export async function setVerseMemoryStatus(
  verseMemoryStatus: VerseMemoryStatusType
) {
  const result = await set(VerseMemoryStatus.tableName, verseMemoryStatus);
  return VerseMemoryStatusSchema.parse(result);
}

export async function updateStatus(
  userId: string,
  verseId: number,
  status: keyof typeof MEMORY_STATUS
) {
  const existingStatus = await getVerseMemoryStatus(userId, verseId);
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
    id: existingStatus?.id || createId(),
  };

  const newMemoryStatus = await setVerseMemoryStatus(memoryStatus);
  console.log("newMemoryStatus", newMemoryStatus);
  return newMemoryStatus;
}

// async function get<T = unknown>(
//   tableName: string,
//   key: IDBValidKey
// ): Promise<T> {
//   await initializeDbPromise;
//   if (!localDb) {
//     throw new Error("localDb is not initialized");
//   }
//   return await localDb.get(tableName, key);
// }

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
