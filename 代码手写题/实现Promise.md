## 前言

实现一个 Promise

## 代码实现

```js
class MPromise {
  constructor(resolver) {
    if (!isFunction(resolver)) {
      throw new Error("resolver must be a function");
    }
    this.state = 0;
    this.value = null;
    this.pending = [];
    resolver(this.resolve.bind(this), this.reject.bind(this));
  }
  static resolve(value) {
    return new MPromise((resolve) => {
      resolve(value);
    });
  }
  static reject(reason) {
    return new MPromise((resolve, reject) => {
      reject(reason);
    });
  }
  static race(promises) {
    return new MPromise((resolve) => {
      promises.forEach((promise) => {
        promise.then((res) => {
          resolve(res);
        });
      });
    });
  }
  static all(promises) {
    let result = [];
    return new MPromise((resolve) => {
      let count = 0;
      promises.forEach((promise, index) => {
        count++;
        promise.then((res) => {
          result[index] = res;
          count--;
          if (count === 0) {
            resolve(result);
          }
        });
      });
    });
  }
  resolve(value) {
    if (this.state) {
      return;
    }
    if (value && isFunction(value.then)) {
      value.then(this.resolve.bind(this), this.reject.bind(this));
    } else {
      this.state = 1;
      this.value = value;
      this.scheduleQueue();
    }
  }
  reject(reason) {
    if (this.state) {
      return;
    }
    this.state = 2;
    this.value = reason;
    this.scheduleQueue();
  }
  scheduleQueue() {
    setTimeout(() => {
      while (this.pending.length) {
        let [promise, onFulfilled, onRejected] = this.pending.shift();
        if (this.state === 1) {
          // 触发下一个promise
          if (isFunction(onFulfilled)) {
            promise.resolve(onFulfilled(this.value));
          } else {
            promise.resolve(this.value);
          }
        } else {
          if (isFunction(onRejected)) {
            promise.reject(onRejected(this.value));
          } else {
            promise.reject(this.value);
          }
        }
      }
    });
  }

  then(onFulfilled, onRejected) {
    let promise = new MPromise(() => {});
    this.pending.push([promise, onFulfilled, onRejected]);
    if (this.state === 1) {
      this.scheduleQueue(this.value);
    }
    return promise;
  }
  catch(onRejected) {
    this.then(null, onRejected);
  }
  finally(onFinally) {
    this.then(onFinally, onFinally);
  }
}

function isFunction(fn) {
  return Object.prototype.toString.call(fn) === "[object Function]";
}
export default MPromise;
```
