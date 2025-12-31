
import { CrisisManifesto, KeywordArchetype } from "../types";

const DB_NAME = "KrisenKanonDB";
const DB_VERSION = 1;

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject("Database error");
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("manifestos")) {
        db.createObjectStore("manifestos", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("archetypes")) {
        db.createObjectStore("archetypes", { keyPath: "id" });
      }
    };
  });
};

export const saveManifesto = async (id: string, data: CrisisManifesto) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("manifestos", "readwrite");
    const store = transaction.objectStore("manifestos");
    store.put({ id, ...data });
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(false);
  });
};

export const getManifesto = async (id: string): Promise<CrisisManifesto | null> => {
  const db = await openDB();
  return new Promise((resolve) => {
    const transaction = db.transaction("manifestos", "readonly");
    const store = transaction.objectStore("manifestos");
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => resolve(null);
  });
};

export const getAllManifestos = async (): Promise<any[]> => {
  const db = await openDB();
  return new Promise((resolve) => {
    const transaction = db.transaction("manifestos", "readonly");
    const store = transaction.objectStore("manifestos");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });
};
