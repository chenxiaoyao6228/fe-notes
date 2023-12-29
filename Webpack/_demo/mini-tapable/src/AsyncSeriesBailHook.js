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
    this.taps.push({ type: 'sync', callback, pluginName: name });
  }

  tapPromise(pluginName, callback) {
    this.taps.push({ type: 'promise', callback, pluginName });
  }

  tapAsync(pluginName, callback) {
    this.taps.push({ type: 'async', callback, pluginName });
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
          if (currentTap.type === 'sync') {
            await next(null, await callback(...args));
          } else if (currentTap.type === 'promise') {
            await next(null, await Promise.resolve(callback(...args)));
          } else if (currentTap.type === 'async') {
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
const asyncSeriesBailHook = new AsyncSeriesBailHook(['arg1', 'arg2']);

asyncSeriesBailHook.tap('Plugin1', async (arg1, arg2) => {
  console.log('Plugin1:', arg1, arg2);
  return 'Result from Plugin1';
});

asyncSeriesBailHook.tapAsync('Plugin2', async (arg1, arg2, callback) => {
  console.log('Plugin2:', arg1, arg2);
  setTimeout(() => callback('Result from Plugin2'), 500);
});

asyncSeriesBailHook.tapPromise('Plugin3', async (arg1, arg2) => {
  console.log('Plugin3:', arg1, arg2);
  return new Promise((resolve) => setTimeout(() => resolve('Result from Plugin3'), 1000));
});

asyncSeriesBailHook.callAsync('Hello', 'World', (result) => {
  console.log('Final Result:', result);
});

asyncSeriesBailHook.promise('Hello', 'World').then((result) => {
  console.log('Promise Result:', result);
});
