const dbName = "costsDB";
const storeName = "costItems";

const openCostsDB = (dbName, number) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, number);
    request.onerror = () => reject("Error opening database");
    request.onsuccess = (event) => {
      const dbInstance = event.target.result;
      const dbObject = {
        db: dbInstance,
        addCost: async (item) => {
          return new Promise((innerResolve, innerReject) => {
            const transaction = dbInstance.transaction([storeName], "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.add(item);
            request.onerror = () => innerReject("Error adding item");
            request.onsuccess = (event) => innerResolve(event.target.result);
          });
        },
        getMonthlyReport: async (month, year) => {
          return new Promise((innerResolve, innerReject) => {
            const transaction = dbInstance.transaction([storeName], "readonly");
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
                innerResolve(items);
              }
            };
    
            store.openCursor().onerror = (event) => {
              innerReject("Error fetching items");
            };
          });
        }
      };
      resolve(dbObject);
    };
    request.onupgradeneeded = (event) => {
      const dbInstance = event.target.result;
      if (!dbInstance.objectStoreNames.contains(storeName)) {
        dbInstance.createObjectStore(storeName, { autoIncrement: true });
      }
    };
  });
};

// Create an idb object and attach the required function to it
const idb = {
  openCostsDB: openCostsDB,
};

// Attach idb object to the window for global access
window.idb = idb;
