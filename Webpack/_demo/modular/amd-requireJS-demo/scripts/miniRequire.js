// my-require.js

(function (global) {
  // 简化获取根路径
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

  function loadScript(url, callback) {
    console.log("loadScript called: url, callback", url, callback);
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
  }

  function loadModule(url, callback) {
    if (!modules[url] || !modules[url].loaded) {
      loadScript(url, function () {
        console.log("loadScript 完成------->", url);
        modules[url] = { loaded: true };
        callback(modules[url]);
      });
    } else {
      callback(modules[url]);
    }
  }

  global.require = function (dependencies, callback) {
    console.log("global.require callbacked: ", dependencies, callback);
    var resolvedDependencies = dependencies.map(resolvePath);

    var loadedModulesCount = 0;
    var totalModules = resolvedDependencies.length;

    // 在所有的依赖都执行完成之后，再执行回调函数
    function onModuleLoaded() {
      loadedModulesCount++;

      if (loadedModulesCount === totalModules) {
        // 拿到执行后的结果，把对应 return 出来的模块对象传入回调函数

        callback &&
          callback.apply(
            null,
            resolvedDependencies.map(function (url) {
              return modules[url].exports;
            })
          );
      }
    }

    resolvedDependencies.forEach(function (url) {
      loadModule(url, onModuleLoaded);
    });
  };

  global.define = function (name, dependencies, factory) {
    var _arguments = arguments;
    console.log("global.define callbacked: ", name, dependencies, factory);
    // 调用 define 的时候，证明模块已经加载完成，并且由浏览器执行了
    var absPath = isAbsolute(name) ? name : resolvePath(name);

    if (!modules[absPath]) {
      modules[absPath] = { loaded: false };

      var depAbsPaths = dependencies.map(function (dep) {
        return resolvePath(dep);
      });

      // 此时依赖的模块还没有加载完成，所以需要使用 require 来加载
      global.require(depAbsPaths, function () {
        // 使用 apply 将模块的导出对象传递给 factory 函数
        modules[absPath].exports = factory.apply(null, _arguments);
      });
    }
  };

  global.require.config = function (config) {
    baseUrl = config.baseUrl || "";
    paths = config.paths || {};
  };
})(window);