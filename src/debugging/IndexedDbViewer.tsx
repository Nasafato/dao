import { openDB, deleteDB, wrap, unwrap } from "idb";
import { useQuery } from "@tanstack/react-query";
import { initializeDbPromise } from "../lib/localDb/db";

interface IndexedDbViewerProps {
  dbName: string;
  version: number;
}
export function IndexedDbViewer({ dbName, version }: IndexedDbViewerProps) {
  const query = useQuery({
    queryKey: ["indexedDb", dbName, version],
    queryFn: async () => {
      await initializeDbPromise;
      const db = await openDB(dbName, version);
      const stores = db.objectStoreNames;
      return {
        stores,
      };
    },
    networkMode: "offlineFirst",
  });
  const stores = query.data?.stores ? Array.from(query.data.stores) : [];
  return (
    <div>
      <div>
        {dbName}({version})
      </div>
      <div>Load status: {query.status}</div>
      {query.isSuccess &&
        (stores.length > 0 ? (
          <ul>
            {stores.map((storeName) => (
              <li key={storeName}>
                {storeName}
                <IndexedDbStoreViewer
                  dbName={dbName}
                  storeName={storeName}
                  version={version}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div>No stores</div>
        ))}
    </div>
  );
}

export function IndexedDbStoreViewer({
  dbName,
  storeName,
  version,
}: {
  dbName: string;
  version: number;
  storeName: string;
}) {
  const query = useQuery({
    queryKey: ["indexedDb", dbName, version, storeName],
    queryFn: async () => {
      try {
        console.log("initializeDbPromise", initializeDbPromise);
        await initializeDbPromise;
      } catch (err) {
        console.error(err);
      }
      const db = await openDB(dbName, version);
      const keys = await db.getAllKeys(storeName);
      const values = await db.getAll(storeName);
      return {
        keys,
        values,
      };
    },
    networkMode: "offlineFirst",
  });
  return (
    <div>
      {query.isLoading && <div>Loading...</div>}
      {query.data?.keys.map((key) => (
        <IDBKey key={stringifyIdbKey(key)} idbKey={key}></IDBKey>
      ))}
      <pre>{JSON.stringify(query.data?.values, null, 2)}</pre>
    </div>
  );
}

function stringifyIdbKey(idbKey: IDBValidKey) {
  if (typeof idbKey === "string") {
    return idbKey;
  }

  if (typeof idbKey === "number") {
    return idbKey;
  }

  if (idbKey instanceof Date) {
    return idbKey.toISOString();
  }

  if (idbKey instanceof ArrayBuffer) {
    return idbKey.byteLength;
  }

  return JSON.stringify(idbKey);
}

export function IDBKey({ idbKey }: { idbKey: IDBValidKey }) {
  if (typeof idbKey === "string") {
    return <div>String: {idbKey}</div>;
  }

  if (typeof idbKey === "number") {
    return <div>Number: {idbKey}</div>;
  }

  if (idbKey instanceof Date) {
    return <div>Date: {idbKey.toISOString()}</div>;
  }

  if (idbKey instanceof ArrayBuffer) {
    return <div>Array buffer: {idbKey.byteLength}</div>;
  }

  return <div>{JSON.stringify(idbKey)}</div>;
}
