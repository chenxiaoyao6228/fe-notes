// miniRequire.js

(function (global) {
  var rootPath = window.location.href.replace("/index.html", "");
  var modules = {}; // 存储模块
  var baseUrl = ""; // 基准路径
  var paths = {}; // 路径映射

  function isAbsolute(url) {
    return /^(https?:\/\/|\/)/.test(url);
  }

  function resolvePath(path) {
    if (isAbsolute(path)) {
      return path;
    }
    const _mapPath = paths[path];

    if (!_mapPath) {
      throw new Error("路径映射不存在");
    }

    var fullPath = rootPath + "/" + baseUrl + "/" + _mapPath + ".js";

    return fullPath;
  }

  function loadScriptAsync(url) {
    return new Promise((resolve, reject) => {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function loadModuleAsync(url) {
    return new Promise((resolve, reject) => {
      if (!modules[url] || !modules[url].loaded) {
        loadScriptAsync(url)
          .then(() => {
            // 模块加载且执行完成, define已执行
            const _deps = modules[url].deps;
            // 没有依赖
            if (_deps.length === 0) {
              modules[url].exports = modules[url].factory();
              return resolve(modules[url].exports);
            }
            // 有依赖
            return global.require(modules[url].deps).then((_dep_exports) => {
              modules[url].exports = modules[url].factory(..._dep_exports);
              return resolve(modules[url].exports);
            });
          })
          .catch(reject);
      } else {
        resolve(modules[url].exports);
      }
    });
  }

  global.require = function (dependencies) {
    var resolvedDependencies = dependencies.map(resolvePath);
    return Promise.all(resolvedDependencies.map(loadModuleAsync));
  };

  global.define = function (name, dependencies, factory) {
    var absPath = isAbsolute(name) ? name : resolvePath(name);
    modules[absPath] = {
      name: absPath,
      deps: dependencies,
      loaded: false,
      factory: factory,
      exports: null,
    };
  };

  global.require.config = function (config) {
    baseUrl = config.baseUrl || "";
    paths = config.paths || {};
  };
})(window);
