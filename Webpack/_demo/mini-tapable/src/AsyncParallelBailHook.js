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
    this.taps.push({ type: 'sync',  callback, pluginName: name });
  }

  tapPromise(pluginName, callback) {
    this.taps.push({ type: 'promise',  callback, pluginName });
  }

  tapAsync(pluginName, callback) {
    this.taps.push({ type: 'async',  callback, pluginName });
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
      if (tap.type === 'sync') {
        done(null, callback(...args));
      } else if (tap.type === 'promise') {
        Promise.resolve(callback(...args)).then((result) => done(null, result), done);
      } else if (tap.type === 'async') {
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
const asyncParallelBailHook = new AsyncParallelBailHook(['arg1', 'arg2']);

asyncParallelBailHook.tap('Plugin1', (arg1, arg2) => {
  console.log('Plugin1:', arg1, arg2);
  return 'Result from Plugin1';
});

asyncParallelBailHook.tapAsync('Plugin2', (arg1, arg2, callback) => {
  console.log('Plugin2:', arg1, arg2);
  setTimeout(() => callback('Result from Plugin2'), 500);
});

asyncParallelBailHook.tapPromise('Plugin3', (arg1, arg2) => {
  console.log('Plugin3:', arg1, arg2);
  return new Promise((resolve) => setTimeout(() => resolve('Result from Plugin3'), 1000));
});

asyncParallelBailHook.callAsync('Hello', 'World', (result) => {
  console.log('Final Result:', result);
});

asyncParallelBailHook.promise('Hello', 'World').then((result) => {
  console.log('Promise Result:', result);
});
