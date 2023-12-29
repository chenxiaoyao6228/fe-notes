/**
 * 串行的异步钩子，允许多个插件按照顺序依次执行，最后在所有插件执行完成后调用回调函数。
 * 适用于按照顺序执行异步插件的场景。
 */

class AsyncSeriesHook {
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
      if (err || result || currentIndex === this.taps.length) {
        return finalCallback(err, result);
      }

      const currentTap = this.taps[currentIndex++];
      const callback = currentTap.callback;

      try {
        if (currentTap.type === 'sync') {
          next(null, await callback(...args));
        } else if (currentTap.type === 'promise') {
          next(null, await Promise.resolve(callback(...args)));
        } else if (currentTap.type === 'async') {
          callback(...args, (err, result) => next(err, result));
        }
      } catch (error) {
        next(error);
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
const asyncSeriesHook = new AsyncSeriesHook(['arg1', 'arg2']);

asyncSeriesHook.tap('Plugin1', async (arg1, arg2) => {
  console.log('Plugin1:', arg1, arg2);
  return 'Result from Plugin1';
});

asyncSeriesHook.tapAsync('Plugin2', async (arg1, arg2, callback) => {
  console.log('Plugin2:', arg1, arg2);
  setTimeout(() => callback('Result from Plugin2'), 500);
});

asyncSeriesHook.tapPromise('Plugin3', async (arg1, arg2) => {
  console.log('Plugin3:', arg1, arg2);
  return new Promise((resolve) => setTimeout(() => resolve('Result from Plugin3'), 1000));
});

asyncSeriesHook.callAsync('Hello', 'World', (result) => {
  console.log('Final Result:', result);
});

asyncSeriesHook.promise('Hello', 'World').then((result) => {
  console.log('Promise Result:', result);
});
