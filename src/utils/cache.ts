// utils/cacheData.ts

interface CachedData {
  key: string;
  data: any;
}

export async function cacheData(key: string, data: any): Promise<void> {
  const openDBRequest: IDBOpenDBRequest = indexedDB.open("daodejing", 1);

  openDBRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
    db.createObjectStore("cachedData", { keyPath: "key" });
  };

  openDBRequest.onsuccess = (event: Event) => {
    const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
    const transaction: IDBTransaction = db.transaction(
      ["cachedData"],
      "readwrite"
    );
    const objectStore: IDBObjectStore = transaction.objectStore("cachedData");
    objectStore.put({ key, data } as CachedData);
  };
}

// utils/loadCachedData.ts

export async function loadCachedData(key: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const openDBRequest: IDBOpenDBRequest = indexedDB.open("daodejing", 1);

    openDBRequest.onerror = (event: Event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };

    openDBRequest.onsuccess = (event: Event) => {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
      const transaction: IDBTransaction = db.transaction(
        ["cachedData"],
        "readonly"
      );
      const objectStore: IDBObjectStore = transaction.objectStore("cachedData");
      const getRequest: IDBRequest = objectStore.get(key);

      getRequest.onsuccess = (event: Event) => {
        resolve((event.target as IDBRequest).result?.data);
      };

      getRequest.onerror = (event: Event) => {
        reject((event.target as IDBRequest).error);
      };
    };
  });
}
