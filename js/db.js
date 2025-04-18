// js/db.js

function openDatabase() {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) return reject('IndexedDB non supporté');
      const req = indexedDB.open('IntersolarDB', 1);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('exposants')) {
          db.createObjectStore('exposants', { keyPath: 'id', autoIncrement: true });
        }
      };
      req.onsuccess = e => resolve(e.target.result);
      req.onerror   = e => reject(e.target.error);
    });
  }
  
  async function checkDataExists() {
    try {
      const db = await openDatabase();
      return new Promise((res, rej) => {
        const tx = db.transaction('exposants', 'readonly');
        const store = tx.objectStore('exposants');
        const countReq = store.count();
        countReq.onsuccess = () => res(countReq.result > 0);
        countReq.onerror   = () => rej(countReq.error);
      });
    } catch {
      return false;
    }
  }
  
  async function getExposants() {
    const db = await openDatabase();
    return new Promise((res, rej) => {
      const tx = db.transaction('exposants', 'readonly');
      const req = tx.objectStore('exposants').getAll();
      req.onsuccess = () => res(req.result);
      req.onerror   = () => rej(req.error);
    });
  }
  
  async function saveExposants(data) {
    const db = await openDatabase();
    return new Promise((res, rej) => {
      const tx = db.transaction('exposants', 'readwrite');
      const store = tx.objectStore('exposants');
      store.clear();
      data.forEach(item => store.put(item));
      tx.oncomplete = () => res();
      tx.onerror    = () => rej(tx.error);
    });
  }
  
  window.DB = { checkDataExists, getExposants, saveExposants };
  