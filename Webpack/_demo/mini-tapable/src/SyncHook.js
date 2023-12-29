const { SyncHook } = require("tapable");

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
