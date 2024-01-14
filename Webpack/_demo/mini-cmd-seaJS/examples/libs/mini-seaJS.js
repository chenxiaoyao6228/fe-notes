(function () {
  'use strict';

  class Context {
    constructor() {
      this.config = {};
      this.modules = {};
    }
    setConfig(config) {
      const rootPath = getRootPath();
      config.base = rootPath + '/' + config.base.split('/').slice(1);
      config.alias = {
        ...config.alias,
      };
      this.config = config;
    }
    getConfig() {
      return this.config;
    }

    setModule(moduleId, module) {
      this.modules[moduleId] = module;
    }
    getModule(moduleId) {
      return this.modules[moduleId];
    }
  }
  const contextInstance = new Context();

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function parseDependency(fnString) {
    const deps = [];
    const reg = /require\((['"])(.+?)\1\)/g;
    let result = null;
    while ((result = reg.exec(fnString))) {
      deps.push(result[2]);
    }
    return deps;
  }

  function getRootPath(){
    // 简单处理， 从index.html获取base
    let rootPath =  window.location.href.replace("/index.html", "");
    // fix: 处理html-preview的路由问题
    if(window.location.href.indexOf('html-preview') > -1){
      rootPath = rootPath.split("html-preview/?")[1];
    }
    return rootPath;
  }


  function getAbsPath(id) {
    if(id.startsWith("http")){
      return id
    }

    const basePath = contextInstance.getConfig().base;
    const aliasPath = contextInstance.getConfig().alias[id];
    if (!aliasPath) {
      throw new Error(`模块${id}不存在`);
    }
    return basePath + "/" + aliasPath + ".js";
  }


  function getCurrentScriptSrc() {
    if (document.currentScript) {
      return document.currentScript.src;
    }
    return "";
  }

  class Module  {
    constructor(id) {
      this.id = id;
      this.deps = [];
      this.factory = () => {};
      this.exports = null;
      this.callbacks = {};
      contextInstance.setModule(id, this);
      this.loadScript();
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

  function loadModule(id, callback) {
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

  function define(factory) {
    const id = getCurrentScriptSrc();
    const module = contextInstance.getModule(getAbsPath(id));
    module.factory = factory;
    const deps = (module.deps = parseDependency(factory.toString()));
    if (deps.length > 0) {
      Promise.all(
        deps.map((depId) => {
          return new Promise(((resolve, reject) => {
              const absPath = getAbsPath(depId);
              const depModule = contextInstance.getModule(absPath) || new Module(absPath);
              depModule.on('complete', resolve);
              depModule.on('error', reject);
          }))
        })
      ).then(() => {
          module.emit('complete');
      }).catch((err) => {
        module.emit('error', err);
      });
    } else {
      module.emit('complete');
    }
  }

  // require的执行时机是在factory里面，此时应该是parent以及deps全部加载完成才会执行该方法
  function require$1(id) {
    const module = contextInstance.getModule(getAbsPath(id));

    if(!module){
      throw new Error(`module ${getAbsPath(id)} is not found`)
    }
    return module.getExports();
  }

  function use(entryId, callback) {
    const absPath = getAbsPath(entryId);
    loadModule(absPath, callback);
  }

  window.define = define;
  window.require = require$1;

  window.seajs = {
    config: (config) => contextInstance.setConfig(config),
    use: use,
  };

})();
