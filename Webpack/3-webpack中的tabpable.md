## 前言

Webpack 中的核心架构是基于 Tapable 实现的，Tapable 是一个类似于 Node.js 的 EventEmitter 的库，专门用于实现发布-订阅模式。Webpack 中的核心组件 Compiler、Compilation、Module、Chunk、ChunkGroup、Dependency、Template 都是通过 Tapable 实现的。

Tappable 主要负责管理 Hooks，Hooks 是一系列具有特定生命周期的事件。通过 Tappable，Webpack 中的不同部分可以创建和触发 Hooks，而插件可以监听这些 Hooks，在适当的时机执行自定义的逻辑。这种设计模式使得插件开发更加灵活，能够介入 Webpack 构建流程的不同阶段。

Tappable 可以被视为 Webpack 插件系统的基石。它提供了一种机制，使得插件可以注册自己的逻辑，而这些逻辑可以被集中执行，而不需要硬编码到 Webpack 的核心逻辑中。这种松耦合的设计让插件开发者更容易理解和维护自己的代码，也让整个插件系统更容易扩展。

## Tapable 中的核心概念

### Hook

在 Tappable 中，Hook 是一个核心类，代表一个事件（或者说是一个钩子）。每个 Hook 实例都可以被订阅，订阅者可以在事件触发时执行自己的逻辑。Hook 的主要职责是管理订阅者和触发事件。

```js
const { Hook } = require("tapable");

const myHook = new Hook(["arg1", "arg2"]);

myHook.tap("Plugin1", (arg1, arg2) => {
  console.log("Plugin1:", arg1, arg2);
});

myHook.tap("Plugin2", (arg1, arg2) => {
  console.log("Plugin2:", arg1, arg2);
});

myHook.call(42, "hello");
```

### HookCodeFactory

HookCodeFactory 是一个工厂类，用于生成 Hook 的触发函数。每个 Hook 都有一个对应的 HookCodeFactory，HookCodeFactory 会根据 Hook 的类型和订阅者的类型生成不同的触发函数。

```js
const { Hook, HookCodeFactory } = require("tapable");

class MyHook extends Hook {
  constructor(args) {
    super(args);
    this.compile = this.compileFactory();
  }

  compileFactory() {
    return HookCodeFactory((args) => {
      return args.map((arg) => `console.log('${arg}:', ${arg});`).join("");
    });
  }
}

const myHook = new MyHook(["arg1", "arg2"]);

const code = myHook.compile({
  tap: (tapInfo) => {
    return `console.log('Tapped by ${tapInfo.name}');`;
  },
  type: "sync",
});

console.log(code);
```

在上述示例中，MyHook 继承自 Hook，并通过 HookCodeFactory 生成了用于触发事件的代码。compileFactory 方法返回一个函数，该函数接受一个参数 args，并返回一个字符串，其中包含了触发 Hook 事件时执行的代码。这样的设计使得 Hook 类型可以通过不同的 HookCodeFactory 来实现不同的触发逻辑。

## Hook 的类型与用途

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/webpack-tabpable-hooks-list.png)

### AsyncParallelBailHook

```js
/**
 * 类似于 AsyncParallelHook，但如果任何插件的回调函数返回除 undefined 之外的值，执行将停止，并在返回该值的情况下调用最终回调。
 * 当插件的结果可以决定是否应执行后续插件时很有用。
 * 支持异步插件注册和执行，包括回调函数和返回 Promise 的函数。
 */

class AsyncParallelBailHook {
  constructor(args) {
    this.args = args;
    this.taps = [];
  }

  tap(name, callback) {
    this.taps.push({ type: "sync", callback, pluginName: name });
  }

  tapPromise(pluginName, callback) {
    this.taps.push({ type: "promise", callback, pluginName });
  }

  tapAsync(pluginName, callback) {
    this.taps.push({ type: "async", callback, pluginName });
  }

  callAsync(...args) {
    const finalCallback = args.pop();
    let count = 0;

    const done = (err, result) => {
      count++;
      if (err || result || count === this.taps.length) {
        finalCallback(err, result);
      }
    };

    for (const tap of this.taps) {
      const callback = tap.callback;
      if (tap.type === "sync") {
        done(null, callback(...args));
      } else if (tap.type === "promise") {
        Promise.resolve(callback(...args)).then(
          (result) => done(null, result),
          done
        );
      } else if (tap.type === "async") {
        callback(...args, done);
      }
    }
  }

  promise(...args) {
    return new Promise((resolve, reject) => {
      this.callAsync(...args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

// Demo
const asyncParallelBailHook = new AsyncParallelBailHook(["arg1", "arg2"]);

asyncParallelBailHook.tap("Plugin1", (arg1, arg2) => {
  console.log("Plugin1:", arg1, arg2);
  return "Result from Plugin1";
});

asyncParallelBailHook.tapAsync("Plugin2", (arg1, arg2, callback) => {
  console.log("Plugin2:", arg1, arg2);
  setTimeout(() => callback("Result from Plugin2"), 500);
});

asyncParallelBailHook.tapPromise("Plugin3", (arg1, arg2) => {
  console.log("Plugin3:", arg1, arg2);
  return new Promise((resolve) =>
    setTimeout(() => resolve("Result from Plugin3"), 1000)
  );
});

asyncParallelBailHook.callAsync("Hello", "World", (result) => {
  console.log("Final Result:", result);
});

asyncParallelBailHook.promise("Hello", "World").then((result) => {
  console.log("Promise Result:", result);
});
```

### SyncHook

```js
/**
 * 允许按照特定的顺序执行多个插件（回调函数）。如果任何插件返回一个值，它不会停止执行。
 * 适用于需要同步执行插件并且执行顺序很重要的场景。
 */
class SyncHook {
  constructor(args) {
    this.args = args;
    this.taps = [];
  }

  tap(name, callback) {
    this.taps.push({ name, callback });
  }

  call(...args) {
    for (const tap of this.taps) {
      tap.callback(...args);
    }
  }
}

// Demo
const syncHook = new SyncHook(["arg1", "arg2"]);
syncHook.tap("Plugin1", (arg1, arg2) => {
  console.log("Plugin1:", arg1, arg2);
});

syncHook.tap("Plugin2", (arg1, arg2) => {
  console.log("Plugin2:", arg1, arg2);
});

syncHook.call("Hello", "World");
```

### SyncBailHook

```js
/**
 * 类似于 SyncHook，但如果任何插件返回除 undefined 之外的值，执行将停止，并返回该值。
 * 当插件的结果可以决定是否应执行后续插件时很有用。
 */
class SyncBailHook {
  constructor(args) {
    this.args = args;
    this.taps = [];
  }
  tap(name, callback) {
    this.taps.push({ name, callback });
  }
  call(...args) {
    for (const tap of this.taps) {
      // 只要监听函数中有一个函数的返回值不为 null，则跳过剩下所有的逻辑
      const result = tap.callback(...args);
      if (result) {
        break;
      }
    }
  }
}

// Usage
const syncBailHook = new SyncBailHook(["arg1", "arg2"]);
syncBailHook.tap("Plugin1", (arg1, arg2) => {
  console.log("Plugin1:", arg1, arg2);
});

syncBailHook.tap("Plugin2", (arg1, arg2) => {
  console.log("Plugin2:", arg1, arg2);
  return "Result from Plugin2";
});

const result = syncBailHook.call("Hello", "World");
console.log("Final Result:", result);
```

### SyncWaterfallHook

```js
/**
 *  类似于 SyncHook，但每个插件的结果作为参数传递给顺序中的下一个插件。
 *  在一个插件的结果需要传递给顺序中的下一个插件以形成瀑布效果时很有用。
 */
class SyncWaterfallHook {
  constructor(args) {
    this.args = args;
    this.taps = [];
  }

  tap(name, callback) {
    this.taps.push({ name, callback });
  }

  call(...args) {
    let result = args;
    for (const tap of this.taps) {
      // 上一个监听函数的返回值可以传给下一个监听函数
      result = [tap.callback(...result)];
    }
    return result[0];
  }
}

// Usage
const syncWaterfallHook = new SyncWaterfallHook(["arg1", "arg2"]);
syncWaterfallHook.tap("Plugin1", (arg1, arg2) => {
  console.log("Plugin1:", arg1, arg2);
  return "ModifiedArg1";
});

syncWaterfallHook.tap("Plugin2", (arg1, arg2) => {
  console.log("Plugin2:", arg1, arg2);
  return "FinalResult";
});

const result = syncWaterfallHook.call("Hello", "World");
console.log("Final Result:", result);
```

### SyncLoopHook

```js
/**
 * 允许插件重复执行，直到插件返回 undefined 为止。它会在插件返回 undefined 之前一直循环调用插件。
 * 适用于需要多次执行插件直到满足某个条件的场景。
 */

class SyncLoopHook {
  constructor(args) {
    this.args = args;
    this.taps = [];
  }

  tap(name, callback) {
    this.taps.push({ name, callback });
  }

  call(...args) {
    for (const tap of this.taps) {
      let iterationResult;
      do {
        iterationResult = tap.callback(...args);
      } while (iterationResult !== undefined);
    }
  }
}

// Demo
const syncLoopHook = new SyncLoopHook(["arg1", "arg2"]);
let count = 0;

syncLoopHook.tap("Plugin1", (arg1, arg2) => {
  console.log("Plugin1:", arg1, arg2);
  count++;
  if (count < 3) {
    return true; // 继续循环
  }
});

syncLoopHook.tap("Plugin2", (arg1, arg2) => {
  console.log("Plugin2:", arg1, arg2);
});

syncLoopHook.call("Hello", "World");
```

### AsyncParallelHook

```js
/**
 * AsyncParallelHook 是一个并行的异步钩子，允许多个插件并行执行，最后在所有插件执行完成后调用回调函数。
 * 适用于并行执行异步插件的场景。
 */
class AsyncParallelHook {
  constructor(args) {
    this.args = args;
    this.taps = [];
  }

  tapAsync(name, callback) {
    this.taps.push({ name, callback });
  }

  callAsync(...args) {
    const finalCallback = args.pop();
    let count = this.taps.length;
    const done = () => {
      count--; // 有点类似Promise.all的实现
      if (count === 0) {
        finalCallback();
      }
    };

    for (const tap of this.taps) {
      tap.callback(...args, done);
    }
  }
}

// Demo
const asyncParallelHook = new AsyncParallelHook(["arg1", "arg2"]);
asyncParallelHook.tapAsync("Plugin1", (arg1, arg2, callback) => {
  console.log("Plugin1:", arg1, arg2);
  setTimeout(callback, 1000);
});

asyncParallelHook.tapAsync("Plugin2", (arg1, arg2, callback) => {
  console.log("Plugin2:", arg1, arg2);
  setTimeout(callback, 500);
});

asyncParallelHook.callAsync("Hello", "World", () => {
  console.log("All plugins executed.");
});
```

### AsyncParallelBailHook

```js
/**
 * 类似于 AsyncParallelHook，但如果任何插件的回调函数返回除 undefined 之外的值，执行将停止，并在返回该值的情况下调用最终回调。
 * 当插件的结果可以决定是否应执行后续插件时很有用。
 * 支持异步插件注册和执行，包括回调函数和返回 Promise 的函数。
 */

class AsyncParallelBailHook {
  constructor(args) {
    this.args = args;
    this.taps = [];
  }

  tap(name, callback) {
    this.taps.push({ type: "sync", callback, pluginName: name });
  }

  tapPromise(pluginName, callback) {
    this.taps.push({ type: "promise", callback, pluginName });
  }

  tapAsync(pluginName, callback) {
    this.taps.push({ type: "async", callback, pluginName });
  }

  callAsync(...args) {
    const finalCallback = args.pop();
    let count = 0;

    const done = (err, result) => {
      count++;
      if (err || result || count === this.taps.length) {
        finalCallback(err, result);
      }
    };

    for (const tap of this.taps) {
      const callback = tap.callback;
      if (tap.type === "sync") {
        done(null, callback(...args));
      } else if (tap.type === "promise") {
        Promise.resolve(callback(...args)).then(
          (result) => done(null, result),
          done
        );
      } else if (tap.type === "async") {
        callback(...args, done);
      }
    }
  }

  promise(...args) {
    return new Promise((resolve, reject) => {
      this.callAsync(...args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

// Demo
const asyncParallelBailHook = new AsyncParallelBailHook(["arg1", "arg2"]);

asyncParallelBailHook.tap("Plugin1", (arg1, arg2) => {
  console.log("Plugin1:", arg1, arg2);
  return "Result from Plugin1";
});

asyncParallelBailHook.tapAsync("Plugin2", (arg1, arg2, callback) => {
  console.log("Plugin2:", arg1, arg2);
  setTimeout(() => callback("Result from Plugin2"), 500);
});

asyncParallelBailHook.tapPromise("Plugin3", (arg1, arg2) => {
  console.log("Plugin3:", arg1, arg2);
  return new Promise((resolve) =>
    setTimeout(() => resolve("Result from Plugin3"), 1000)
  );
});

asyncParallelBailHook.callAsync("Hello", "World", (result) => {
  console.log("Final Result:", result);
});

asyncParallelBailHook.promise("Hello", "World").then((result) => {
  console.log("Promise Result:", result);
});
```

### AsyncSeriesBailHook

```js
/**
 * 类似于 AsyncSeriesHook，但如果任何插件的回调函数返回除 undefined 之外的值，执行将停止，并在返回该值的情况下调用最终回调。
 * 当插件的结果可以决定是否应执行后续插件时很有用。
 */

class AsyncSeriesBailHook {
  constructor(args) {
    this.args = args;
    this.taps = [];
  }

  tap(name, callback) {
    this.taps.push({ type: "sync", callback, pluginName: name });
  }

  tapPromise(pluginName, callback) {
    this.taps.push({ type: "promise", callback, pluginName });
  }

  tapAsync(pluginName, callback) {
    this.taps.push({ type: "async", callback, pluginName });
  }

  async callAsync(...args) {
    const finalCallback = args.pop();
    let currentIndex = 0;

    const next = async (err, result) => {
      if (err || result !== undefined) {
        return finalCallback(err, result);
      }

      if (currentIndex < this.taps.length) {
        const currentTap = this.taps[currentIndex++];
        const callback = currentTap.callback;

        try {
          if (currentTap.type === "sync") {
            await next(null, await callback(...args));
          } else if (currentTap.type === "promise") {
            await next(null, await Promise.resolve(callback(...args)));
          } else if (currentTap.type === "async") {
            callback(...args, (err, result) => next(err, result));
          }
        } catch (error) {
          next(error);
        }
      } else {
        finalCallback();
      }
    };

    next(null, undefined);
  }

  async promise(...args) {
    return new Promise((resolve, reject) => {
      this.callAsync(...args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

// Demo
const asyncSeriesBailHook = new AsyncSeriesBailHook(["arg1", "arg2"]);

asyncSeriesBailHook.tap("Plugin1", async (arg1, arg2) => {
  console.log("Plugin1:", arg1, arg2);
  return "Result from Plugin1";
});

asyncSeriesBailHook.tapAsync("Plugin2", async (arg1, arg2, callback) => {
  console.log("Plugin2:", arg1, arg2);
  setTimeout(() => callback("Result from Plugin2"), 500);
});

asyncSeriesBailHook.tapPromise("Plugin3", async (arg1, arg2) => {
  console.log("Plugin3:", arg1, arg2);
  return new Promise((resolve) =>
    setTimeout(() => resolve("Result from Plugin3"), 1000)
  );
});

asyncSeriesBailHook.callAsync("Hello", "World", (result) => {
  console.log("Final Result:", result);
});

asyncSeriesBailHook.promise("Hello", "World").then((result) => {
  console.log("Promise Result:", result);
});
```

### AsyncSeriesWaterfallHook

```js
/**
 * 类似于 AsyncSeriesHook，但每个插件的结果作为参数传递给顺序中的下一个插件。
 * 在一个插件的结果需要传递给顺序中的下一个插件以形成瀑布效果时很有用。
 */

class AsyncSeriesWaterfallHook {
  constructor(args) {
    this.args = args;
    this.taps = [];
  }

  tap(name, callback) {
    this.taps.push({ type: "sync", callback, pluginName: name });
  }

  tapPromise(pluginName, callback) {
    this.taps.push({ type: "promise", callback, pluginName });
  }

  tapAsync(pluginName, callback) {
    this.taps.push({ type: "async", callback, pluginName });
  }

  async callAsync(...args) {
    const finalCallback = args.pop();
    let result = args.shift();
    let currentIndex = 0;

    const next = async (err, value) => {
      if (err) {
        return finalCallback(err);
      }

      if (currentIndex < this.taps.length) {
        const currentTap = this.taps[currentIndex++];
        const callback = currentTap.callback;

        try {
          if (currentTap.type === "sync") {
            result = callback(value, ...args);
            next(null, result);
          } else if (currentTap.type === "promise") {
            result = await callback(value, ...args);
            next(null, result);
          } else if (currentTap.type === "async") {
            callback(value, ...args, (err, newValue) => next(err, newValue));
          }
        } catch (error) {
          next(error);
        }
      } else {
        finalCallback(null, result);
      }
    };

    next(null, undefined);
  }

  async promise(...args) {
    return new Promise((resolve, reject) => {
      this.callAsync(...args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

// Demo
const asyncSeriesWaterfallHook = new AsyncSeriesWaterfallHook(["arg1", "arg2"]);

asyncSeriesWaterfallHook.tap("Plugin1", (value, arg1, arg2) => {
  console.log("Plugin1:", value, arg1, arg2);
  return "Result from Plugin1";
});

asyncSeriesWaterfallHook.tapAsync(
  "Plugin2",
  async (value, arg1, arg2, callback) => {
    console.log("Plugin2:", value, arg1, arg2, callback);
    setTimeout(() => callback(null, "Result from Plugin2"), 500);
  }
);

asyncSeriesWaterfallHook.tapPromise("Plugin3", async (value, arg1, arg2) => {
  console.log("Plugin3:", value, arg1, arg2);
  return new Promise((resolve) =>
    setTimeout(() => resolve("Result from Plugin3"), 1000)
  );
});

asyncSeriesWaterfallHook.callAsync(
  "Initial Value",
  "Hello",
  "World",
  (result) => {
    console.log("Final Result:", result);
  }
);

asyncSeriesWaterfallHook
  .promise("Initial Value", "Hello", "World")
  .then((result) => {
    console.log("Promise Result:", result);
  });
```

所有代码参见 \_demo/mini-tabpable

## 参考

- [tabpable](https://www.npmjs.com/package/tapable)
- [强大的异步流程控制库 Async.js](https://caolan.github.io/async/v3/)
