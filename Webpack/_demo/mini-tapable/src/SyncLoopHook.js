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
