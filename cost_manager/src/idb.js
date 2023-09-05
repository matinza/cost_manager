const dbName = "costsDB";
const storeName = "costItems";

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onerror = () => reject("Error opening database");
    request.onsuccess = (event) => resolve(event.target.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { autoIncrement: true });
      }
    };
  });
};

const addCost = async (item) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.add(item);
    request.onerror = () => reject("Error adding item");
    request.onsuccess = (event) => resolve(event.target.result);
  });
};

const getMonthlyReport = async (month, year) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);
    const items = [];

    store.openCursor().onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const item = cursor.value;
        const itemDate = new Date(item.date);
        if (itemDate.getMonth() === month && itemDate.getFullYear() === year) {
          items.push(item);
        }
        cursor.continue();
      } else {
        resolve(items);
      }
    };

    store.openCursor().onerror = (event) => {
      reject("Error fetching items");
    };
  });
};

export { addCost, getMonthlyReport };
