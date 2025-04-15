# JS代码手写题

## 防抖节流

事件(eg: scroll 事件, 业务触发 onChange)的频繁触发可能导致页面大量计算并抖动，为了规避这种情况，我们需要一些手段了控制事件触发的频率。
在这样的背景下，throttle(事件节流)和 debounce(事件防抖)出现了。

这两者都以闭包的形式出现，记录自由变量，并通过定时函数(setTimeout, requestAnimationFrame)进行触发.

### throttle(事件节流)

throttle[/'θrɑtl/]: 节流阀，油门；功率，马力；气管

> 只认第一次： 在某段时间间隔内，不管触发了多少次，都只认第一次触发，并在计时结束时候予以响应

### 场景举例：

- scroll 事件
- resize 事件
- mousemove 事件

### 代码实现

```js
function throttle(fn, timeout) {
  let last = 0;
  return function () {
    const context = this;
    const args = arguments;
    let now = Date.now();
    if (now - last < timeout) {
      return;
    }
    last = now;
    fn.apply(context, args);
  };
}
```

### debounce(事件防抖)

debounce[/di'bauns/]: 去抖动

> 只认最后一次：在某段时间内，不管触发了多少次回调，都只认最后一次。

### 场景举例：

- 搜索输入框/自动填充组件： 在固定的时间间隔之后，用户输入稳定之后再触发 search

### 代码实现

```js
function debounce(fn, timeout) {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, timeout);
  };
}
```

## 红绿灯实现

实现一个红绿灯，支持以下功能：

- 按照红灯->绿灯->黄灯的方式循环打印, 打印时间间隔分别为 3s->2s->1s

### 实现: 借助 async-await

```js
function renderLight(color) {
  const lights = document.querySelectorAll(".light");
  lights.forEach((light) => (light.style.backgroundColor = "transparent"));
  document.querySelector(`.${color}`).style.backgroundColor = color;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function renderLightWidthDelay(color, duration) {
  renderLight(color);
  await sleep(duration);
}

const lightRunner = (() => {
  const tasks = [];
  let curIndex = 0;

  const add = (task) => {
    tasks.push(task);
  };

  const run = async () => {
    while (tasks.length) {
      const task = tasks[curIndex];
      await task();
      if (curIndex >= tasks.length - 1) {
        curIndex = 0;
      } else {
        curIndex++;
      }
    }
  };

  return {
    add,
    run,
  };
})();
```

## Promise实现

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

```

## 实现call,apply,bind

### call实现

```js
/**
 * 实现call方法
 *
 * @param {*} context
 * @return {*}
 */
function myCall(context) {
  context[this.name] = this; //通过函数的name属性可以拿到函数名
  var args = [];
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push("arguments[" + i + "]");
  }
  var result = eval("context[this.name](" + args + ")");
  delete context[this.name];
  return result;
}
```

### apply实现

```js
/**
 * 实现apply方法
 *
 * @param {*} context
 * @param {*} arr
 * @return {*}
 */
function myApply(context, arr) {
  context[this.name] = this; //通过函数的name属性可以拿到函数名
  var args = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    args.push("arr[" + i + "]");
  }
  var result = eval("context[this.name](" + args + ")");
  delete context[this.name];
  return result;
}
```

### bind实现

```js
/**
 * 实现一个bind方法
 *
 * @export
 * @param {*} fn
 * @param {*} context
 * @return {*}
 */
function myBind(fn, context) {
  return function () {
    return fn.apply(context, arguments);
  };
}
```

## 实现EventBus

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

## 实现深拷贝

### 浅拷贝

首先可以通过 Object.assign 来解决这个问题,很多人认为这个函数是用来深拷贝的。其实并不是, Object.assign 只会拷贝所有的属性值到新的对象中, 如果属性值是对象的话,拷贝的是地址,所以并不是深拷贝

```js
let a = { age: 1 };
let b = Object.assign({}, a);
a.age = 2;
console.log(b.age); // 1
```

另外我们还可以通过展开运算符... 来实现浅拷贝

```js
let a = { age: 1 };
let b = { ...a };
a.age = 2;
console.log(b.age); //
```

通常浅拷贝就能解决大部分问题了,但是当我们遇到如下情况就可能需要使用到深拷贝了

```js
let a = { age: 1, jobs: { first: "FE" } };
let b = { ...a };
a.jobs.first = "native";
console.log(b.jobs.first); // native
```

### 深拷贝实现

这个问题通常可以通过 JSON.parse(JSON.stringify(object)) 来解决。

```js
let a = { age: 1, jobs: { first: "FE" } };
let b = JSON.parse(JSON.stringify(a));
a.jobs.first = "native";
console.log(b.jobs.first); // FE
```

但是该方法也是有局限性的:

- 会忽略 undefined
- 会忽略 symbol
- 不能序列化函数
- 不能解决循环引用的对象

自己实现如下：

```js
function deepClone(obj) {
  if (!isObject(obj) && !isArray(obj)) return;
  let result = isArray(obj) ? [] : {};

  if (isObject(obj)) {
    for (let key in obj) {
      if (isObject(obj[key]) || isArray(obj[key])) {
        result[key] = deepClone(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
  } else if (isArray(obj)) {
    let res = [];
    obj.forEach((item, index) => {
      if (isArray(item) || isObject(obj)) {
        res[index] = deepClone(item);
      } else {
        res[index] = item;
      }
    });
    return res;
  }
  return result;
}
```

## 实现异步串行钩子

```ts
class AsyncSeriesHook {
  tasks: Function[];
  constructor() {
    this.tasks = [];
  }

  next(task: Function) {
    this.tasks.push(task);
    return this;
  }

  callAsync(...args: any) {
    const finalCallback = args.pop();
    const next = (idx: number, lastResult = null) => {
      if (idx === this.tasks.length) {
        finalCallback(lastResult, null);
        return;
      }
      const task = this.tasks[idx];
      task(...args, lastResult).then(
        (res: any) => {
          next(idx + 1, res);
        },
        (err: any) => finalCallback(null, err),
      );
    };
    next(0);
  }

  run(...args: any) {
    return new Promise((resolve, reject) => {
      const finalCallback = (res: any, err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      };
      this.callAsync(...args, finalCallback);
    });
  }
}
```

## 实现批量请求函数

实现一个批量请求函数, 能够限制并发量：

- 要求最大并发数 maxNum
- 每当有一个请求返回，就留下一个空位，可以增加新的请求
- 所有请求完成后，结果按照 urls 里面的顺序依次打出

```js
function multiRequest(urls, maxNum) {
  const results = [];
  let currentIndex = 0;
  let currentRequests = 0;

  function doRequest(url) {
    currentRequests++;
    const i = currentIndex;
    return request(url).then((result) => {
      results[i] = result;
      currentRequests--;
      tryNextRequest();
    });
  }

  function tryNextRequest() {
    while (currentRequests < maxNum && currentIndex < urls.length) {
      doRequest(urls[currentIndex]);
      currentIndex++;
    }

    if (currentIndex === urls.length && currentRequests === 0) {
      // All requests are completed
      console.log(results);
    }
  }

  tryNextRequest();
}
```

## 实现函数式编程相关方法

### partial

```js
/**
 * partial
 *
 * @param {*} fn
 * @return {*}
 */
function partial(fn) {
  let partialArgs = arguments.length > 1 ? [].slice.call(arguments, 1) : [];
  return function () {
    let args = partialArgs.concat([].slice.call(arguments));
    return fn.apply(fn, args);
  };
}
```

### partialRight

```js
/**
 * partialRight
 *
 * @param {*} fn
 * @return {*}
 */
function partialRight(fn) {
  let partialArgs = arguments.length > 1 ? [].slice.call(arguments, 1) : [];
  return function () {
    let args = [].slice.call(arguments).concat(partialArgs);
    return fn.apply(fn, args);
  };
}
```

### pipe

```js
/**
 * pipe函数
 *
 * @export
 * @param {*} fns
 * @return {*}
 */
function pipe(...fns) {
  return (arg) => {
    return fns.reduce((acc, fn) => fn(acc), arg);
  };
}
```

### currying

```js
function currying(fn, args = []) {
  return function temp(...innerArgs) {
    if (innerArgs.length > 0) {
      // 收集后面传入的参数
      args = [...args, ...innerArgs];
      // 返回函数供后面可以继续调用
      return temp;
    } else {
      const val = fn.apply(this, args);
      // 清空参数数组，为了保证下次执行函数可以继续迭代
      args = [];
      return val;
    }
  };
}

// 使用示例
function add(...args) {
  //求和
  return args.reduce((a, b) => a + b);
}
const curriedAdd = currying(add);
```

## JS实现AOP

在 js 中实现 AOP，主要是通过装饰器模式来实现的，装饰器模式的核心是通过装饰器函数来包装原函数，从而实现对原函数的增强。

```js
Function.prototype.before = function (func) {
  const _self = this;
  return function () {
    if (func.apply(this, arguments) === false) {
      return false;
    }
    return _self.apply(this, arguments);
  };
};

Function.prototype.after = function (func) {
  const _self = this;
  return function () {
    if (_self.apply(this, arguments) === false) {
      return false;
    }
    return func.apply(this, arguments);
  };
};
```

使用示例：

```js
function exampleFunction() {
  console.log("执行主要逻辑");
  return "主要逻辑结果";
}

// 在示例函数执行前添加逻辑
const functionWithBefore = exampleFunction.before(function () {
  console.log("执行前置逻辑");
  // 返回 false 可以中止主要逻辑的执行
  // return false;
});

// 在示例函数执行后添加逻辑
const functionWithAfter = exampleFunction.after(function () {
  console.log("执行后置逻辑");
});

// 输出结果示例：
// 执行前置逻辑
// 执行主要逻辑
// 执行后置逻辑
```

## 实现ResolvablePromise

一般情况下，Promise 的 resolve 和 reject 方法是内部使用的，但有时候我们可能需要在外部的代码中触发 Promise 的状态改变。

### 实现代码

```ts
export type ResolvablePromise<T> = Promise<T> & {
  resolve: (value: T) => void;
  reject: (error: Error) => void;
};

export const createResolvablePromise = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  (promise as any).resolve = resolve;
  (promise as any).reject = reject;

  return promise as ResolvablePromise<T>;
};
```

### 使用示例

```ts
// 延迟操作示例
export const delayedAction = (delay: number): ResolvablePromise<void> => {
  const resolvablePromise = createResolvablePromise<void>();

  setTimeout(() => {
    resolvablePromise.resolve();
  }, delay);

  return resolvablePromise;
};

// 多个并行操作示例
export const fetchData = (): ResolvablePromise<string[]> => {
  const resolvablePromise = createResolvablePromise<string[]>();

  const requests = [
    fetch("api/data1").then((response) => response.text()),
    fetch("api/data2").then((response) => response.text()),
    fetch("api/data3").then((response) => response.text())
  ];

  Promise.all(requests)
    .then((data) => {
      resolvablePromise.resolve(data);
    })
    .catch((error) => {
      resolvablePromise.reject(new Error(`Error fetching data: ${error}`));
    });

  return resolvablePromise;
};
```

## 实现继承extend

参考：https://github.com/chenxiaoyao6228/fe-notes/blob/main/Javascript/%E4%B8%80%E6%96%87%E7%90%86%E8%A7%A3JS%E4%B8%AD%E7%9A%84%E7%BB%A7%E6%89%BF.md
