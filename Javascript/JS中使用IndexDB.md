## 前言

IndexDB（Indexed Database）是一种用于在浏览器中存储大量结构化数据的 Web API。它提供了一种在客户端存储和检索数据的方式，类似于关系型数据库的功能，但是在浏览器中运行。

具有以下特点

- NoSQL 数据库： IndexDB 是一种 NoSQL 数据库，不使用传统的表格结构，而是使用对象存储数据。

- 异步操作： IndexDB 的 API 设计是异步的，这意味着对数据库的读取和写入都是非阻塞的，不会影响主线程。

- 键值对存储： 数据以键值对的形式存储在 IndexDB 中，其中键和值可以是任意 JavaScript 对象。

- 事务： 操作 IndexDB 时通常使用事务来确保数据的一致性和完整性。事务可以包含多个数据库操作，并在需要时回滚。

- 支持索引： 可以在存储的对象属性上创建索引，以便更快地检索数据。

- 存储大量数据： 适用于需要在客户端存储大量数据的应用，例如离线 Web 应用或需要快速访问数据的应用。

## 基于 IndexDB 封装的仿 localStage 用法的工具

```js
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
```
