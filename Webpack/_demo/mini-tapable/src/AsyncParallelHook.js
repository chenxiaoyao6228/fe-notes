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
