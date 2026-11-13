/**
 * IndexedDB persistence helper for Sentra Properti.
 * IndexedDB provides virtually unlimited client-side storage (hundreds of megabytes),
 * completely bypassing the restrictive 5MB browser quota limit of synchronous localStorage.
 */

const IDB_NAME = 'sentra_properti_db_v1';
const IDB_STORE = 'app_cache';
const IDB_VERSION = 1;

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);

        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(IDB_STORE)) {
            db.createObjectStore(IDB_STORE);
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          console.warn('IndexedDB failed to open:', request.error);
          resolve(null);
        };
      } catch (err) {
        console.warn('IndexedDB initialization error:', err);
        resolve(null);
      }
    });
  }

  return dbPromise;
}

export async function idbGet<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const store = tx.objectStore(IDB_STORE);
        const req = store.get(key);

        req.onsuccess = () => {
          resolve(req.result !== undefined ? (req.result as T) : null);
        };

        req.onerror = () => {
          resolve(null);
        };
      } catch {
        resolve(null);
      }
    });
  } catch {
    return null;
  }
}

export async function idbSet<T>(key: string, value: T): Promise<boolean> {
  try {
    const db = await openDB();
    if (!db) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        store.put(value, key);

        tx.oncomplete = () => {
          resolve(true);
        };

        tx.onerror = () => {
          resolve(false);
        };
      } catch {
        resolve(false);
      }
    });
  } catch {
    return false;
  }
}

export async function idbRemove(key: string): Promise<boolean> {
  try {
    const db = await openDB();
    if (!db) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        store.delete(key);

        tx.oncomplete = () => {
          resolve(true);
        };

        tx.onerror = () => {
          resolve(false);
        };
      } catch {
        resolve(false);
      }
    });
  } catch {
    return false;
  }
}

export async function idbClear(): Promise<boolean> {
  try {
    const db = await openDB();
    if (!db) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        store.clear();

        tx.oncomplete = () => {
          resolve(true);
        };

        tx.onerror = () => {
          resolve(false);
        };
      } catch {
        resolve(false);
      }
    });
  } catch {
    return false;
  }
}
