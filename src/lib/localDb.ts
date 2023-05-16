// import * as localForage from "localforage";
export let localDb: IDBDatabase;

export async function setup() {
  const openRequest = indexedDB.open("daodejing", 1);
  const promise = new Promise<IDBDatabase>((resolve) => {
    openRequest.onsuccess = (ev) => {
      resolve(openRequest.result);
    };
  });
  localDb = await promise;

  const existingObjectStores = localDb.objectStoreNames;
}
