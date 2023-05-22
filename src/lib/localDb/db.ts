import { IDBPDatabase, wrap } from "idb";
import { createVerseMemoryStatusV1Store } from "./verseMemoryStatus/schema";
import { createVerseMemoryTestV1Store } from "./verseMemoryTest/schema";

// export let localDb: IDBPDatabase | null = null;
export let db: IDBDatabase;
export let wrappedDb: IDBPDatabase;

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
    if (db) {
      return;
    }

    if (openRequest) {
      return;
    }
    openRequest = indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION);
    openRequest.onupgradeneeded = () => {
      db = openRequest.result;
      createVerseMemoryTestV1Store(db);
      createVerseMemoryStatusV1Store(db);
    };

    openRequest.onerror = () => {
      console.error(openRequest.error);
      reject(openRequest.error);
    };
    openRequest.onsuccess = () => {
      db = openRequest.result;
      wrappedDb = wrap(db);
      resolve(db);

      db.onversionchange = () => {
        db.close();
        alert("Database is outdated, please reload the page.");
      };
    };

    openRequest.onblocked = () => {
      console.error("Database is blocked");
      reject(new Error("Database is blocked"));
    };
  });
}

export async function awaitDbInit() {
  await initializeDbPromise;
  if (!db) {
    throw new Error("localDb is not initialized");
  }
}
