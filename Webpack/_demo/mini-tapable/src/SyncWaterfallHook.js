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
