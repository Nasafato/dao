import { IDBPDatabase, openDB } from "idb";

let dbPromise: Promise<IDBPDatabase<unknown>> | undefined;

export function initializeKeyValueStore() {
  console.log("Setting up key value store");
  if (dbPromise) {
    return;
  }
  dbPromise = openDB("keyval-store", 1, {
    upgrade(db) {
      db.createObjectStore("keyval");
    },
  });
}

export async function get<T>(key: IDBValidKey): Promise<T> {
  if (!dbPromise) {
    throw new Error("Key value store is not initialized");
  }
  return (await dbPromise).get("keyval", key);
}
export async function set(key: IDBValidKey, val: any) {
  if (!dbPromise) {
    throw new Error("Key value store is not initialized");
  }
  return (await dbPromise).put("keyval", val, key);
}
export async function del(key: IDBValidKey) {
  if (!dbPromise) {
    throw new Error("Key value store is not initialized");
  }
  return (await dbPromise).delete("keyval", key);
}
export async function clear() {
  if (!dbPromise) {
    throw new Error("Key value store is not initialized");
  }
  return (await dbPromise).clear("keyval");
}
export async function keys() {
  if (!dbPromise) {
    throw new Error("Key value store is not initialized");
  }
  return (await dbPromise).getAllKeys("keyval");
}
