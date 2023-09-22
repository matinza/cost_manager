/*
  developers: 
  Elinor_Shaar_318863289
  Matan_Avital_204597082
*/
const storeName = "costItems";

const openCostsDB = (dbName = "costsDB", version = 1) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, version);
        request.onerror = () => reject("Error opening database");
        request.onsuccess = (event) => {
            const db = event.target.result;
            
            const customDb = {
                _db: db,
                addCost: (item) => {
                    return new Promise((resolve, reject) => {
                        const transaction = customDb._db.transaction([storeName], "readwrite");
                        const store = transaction.objectStore(storeName);
                        const request = store.add(item);
                        request.onerror = () => reject("Error adding item");
                        request.onsuccess = (event) => resolve(event.target.result);
                    });
                },
                getMonthlyReport: (month, year) => {
                    return new Promise((resolve, reject) => {
                        const transaction = customDb._db.transaction([storeName], "readonly");
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
                }
            };

            resolve(customDb);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { autoIncrement: true });
            }
        };
    });
};

// Define an idb object to align with test.html expectations.
const idb = {
    openCostsDB
};

// If in a browser environment, attach the idb object to the window.
if (typeof window !== "undefined") {
    window.idb = idb;
}

// for react compoenents
if (typeof module !== "undefined" && module.exports) {
    module.exports = idb;
}
