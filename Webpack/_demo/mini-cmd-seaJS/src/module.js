import contextInstance from "./context";
import { getAbsPath, loadScript } from "./util";

class Module  {
  constructor(id) {
    this.id = id;
    this.deps = [];
    this.factory = () => {};
    this.exports = null;
    this.callbacks = {}
    contextInstance.setModule(id, this);
    this.loadScript()
  }
  on(type, handler) {
    if (!this.callbacks[type]) {
      this.callbacks[type] = [];
    }
    this.callbacks[type].push(handler);
  }
  emit(type, ...args) {
    if (this.callbacks[type]) {
      this.callbacks[type].forEach((handler) => handler(...args));
    }
  }
  loadScript() {
    loadScript(this.id);
  }
  getExports() {
    if (!this.exports) {
      this.factory(require, this.exports, this);
    }
    return this.exports;
  }
}

export function loadModule(id, callback) {
  return new Promise((resolve, reject) => {
    const module =
      contextInstance.getModule(getAbsPath(id)) || new Module(getAbsPath(id));
    module.on("complete", () => {
      const _exports = module.getExports();
      callback && callback(_exports);
      resolve(_exports);
    });
    module.on("error", (err) => {
      reject(err);
    });
  });
}

export default Module;
