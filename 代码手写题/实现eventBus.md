## 前言

手写 eventBus

## 代码实现

```js
class EventBus {
  constructor() {
    this.listeners = {};
    this.uuid = 0;
  }
  on(name, callback) {
    // 这里也可以使用二维数组的形式[[],[]], 取消事件的时候将该项的索引设置为null
    // 可以避免在遍历是删除元素带来的问题
    this.listeners[name] = this.listeners[name] || {};
    this.listeners[name][this.uuid] = callback;
    this.uuid++;
  }
  emit(name) {
    this.listeners[name] &&
      Object.keys(this.listeners[name]).forEach((key) => {
        let callback = this.listeners[name][key];
        callback();
        if (callback.ONCE) {
          delete this.listeners[name][key];
        }
      });
  }
  once(name, callback) {
    let callbackWrapper = () => callback();
    callbackWrapper.ONCE = true;
    this.on(name, callbackWrapper);
  }
  off(name, listener) {
    Object.keys(this.listeners[name]).forEach((key) => {
      let callback = this.listeners[name][key];
      if (callback === listener) {
        delete this.listeners[name][key];
      }
    });
  }
}
```
