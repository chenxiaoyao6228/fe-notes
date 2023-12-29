
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
