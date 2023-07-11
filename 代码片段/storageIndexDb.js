/**
 * 基于IndexDB封装的仿localStage用法的工具
 * **/
function promisify(something) {
  return new Promise((resolve, reject) => {
    something.onsuccess = () => resolve(something.result);
    something.onerror = () => reject(something.error);
  });
}
class DBStorage {
  constructor(dbName, storeName) {
    const request = window.indexedDB.open(dbName);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName);
    this.dbPromise = promisify(request);
    this.storeName = storeName;
  }
  async getStore(operationMode, storeName = this.storeName) {
    const db = await this.dbPromise;
    return db.transaction(storeName, operationMode).objectStore(storeName);
  }
  async setItem(key, value) {
    const store = await this.getStore("readwrite");
    return promisify(store.put(value, key));
  }
  // 出于性能考虑，插入多个数据时优先使用这个方法, setManyItems([key: 'img', value: '11'])
  async setManyItems(items) {
    const store = await this.getStore("readwrite");
    items.forEach((item) => store.put(item.value, item.key));
    return promisify(store.transaction);
  }
  async getItem(key) {
    const store = await this.getStore("readonly");
    return promisify(store.get(key));
  }
  async removeItem(key) {
    const store = await this.getStore("readwrite");
    return promisify(store.delete(key));
  }
  async clear() {
    const store = await this.getStore("readwrite");
    return promisify(store.clear());
  }
}

const dbStorage = new DBStorage("my-project", "kv");

export default dbStorage;

// dbStorage.setItem('elements', [1,2,3,4,5])

// dbStorage.removeItem('elements')
// dbStorage.clear();

// dbStorage.setManyItems([
//     {key: 1, value: 'hello'},
//     {key: 2, value: 'test'}
// ])
// dbStorage.getItem('elements11').then(res => {
//   console.log('获取元素elements...', res)
// })
