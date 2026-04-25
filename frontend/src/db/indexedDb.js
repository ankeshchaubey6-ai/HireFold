// src/db/indexedDb.js

import { DB_NAME, DB_VERSION, STORE_SCHEMAS } from "./stores.config";

let dbInstance = null;

/**
 * Open IndexedDB connection (SAFE)
 */
export function openDatabase() {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      Object.entries(STORE_SCHEMAS).forEach(
        ([storeName, schema]) => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, {
              keyPath: schema.keyPath,
              autoIncrement: schema.autoIncrement,
            });

            schema.indexes.forEach((index) => {
              store.createIndex(
                index.name,
                index.keyPath,
                { unique: index.unique }
              );
            });
          }
        }
      );
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Execute transaction safely
 */
export async function executeTransaction(
  storeName,
  mode,
  operation
) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);

    let result;

    try {
      result = operation(store);
    } catch (err) {
      reject(err);
    }

    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
  });
}
