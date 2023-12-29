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
          if (currentTap.type === 'sync') {
            result = callback(value, ...args);
            next(null, result);
          } else if (currentTap.type === 'promise') {
            result = await callback(value, ...args);
            next(null, result);
          } else if (currentTap.type === 'async') {
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
const asyncSeriesWaterfallHook = new AsyncSeriesWaterfallHook(['arg1', 'arg2']);

asyncSeriesWaterfallHook.tap('Plugin1',  (value, arg1, arg2) => {
  console.log('Plugin1:', value, arg1, arg2);
  return 'Result from Plugin1';
});

asyncSeriesWaterfallHook.tapAsync('Plugin2', async (value, arg1, arg2, callback) => {
  console.log('Plugin2:', value, arg1, arg2, callback);
  setTimeout(() => callback(null, 'Result from Plugin2'), 500);
});

asyncSeriesWaterfallHook.tapPromise('Plugin3', async (value, arg1, arg2) => {
  console.log('Plugin3:', value, arg1, arg2);
  return new Promise((resolve) => setTimeout(() => resolve('Result from Plugin3'), 1000));
});

asyncSeriesWaterfallHook.callAsync('Initial Value', 'Hello', 'World', (result) => {
  console.log('Final Result:', result);
});

asyncSeriesWaterfallHook.promise('Initial Value', 'Hello', 'World').then((result) => {
  console.log('Promise Result:', result);
});


