// miniRequire.js

/*
  * 入口用use更容易理解一点?
*/


(function (global) {
  // 简化获取根路径
  var rootPath = window.location.href.replace("/index.html", "");

  /*
    module对象的结构
    { 
      status: false, // 模块是否加载完成 'initial' | 'loading' | 'loaded' | 'executed'
      exports: {} // 模块的导出对象
      deps: [] // 依赖的模块
      loadedDepsCount： 0 // 已经加载完成的依赖模块的数量
    }
  */

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

  // 这个loadScript是不是在node.js中可以用fs.readFile代替?
  function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = callback // onload的执行时机?与define的执行时机, 哪个先?
    document.head.appendChild(script);
  }

  // loadModule需要保证其子模块也加载完成了才能执行回调callback
  function loadModule(url, callback) {
    if (!modules[url] || !modules[url].loaded) {
    loadScript(url, function () {
      console.log("loadScript 完成------->", url);
      // 按理来说loadModule之后要先加载完子模块才能执行callback，不然子模块的exports还没生成
      modules[url].loaded = true;
      callback(modules[url]);
    });
    } else {
      callback(modules[url]);
    }
  }

  // 主模块可以不传入callback
  global.require = function (dependencies, callback) {
    console.log("global.require callbacked: ", dependencies, callback);
    var resolvedDependencies = dependencies.map(resolvePath);
    var loadedModulesCount = 0;
    var totalModules = resolvedDependencies.length;

    // 在所有的依赖都执行完成之后，再执行回调函数
    function onModuleLoaded() {
      // 🚧 FIXME： loadedModulesCount并不能保证所有的子模块都加载完成了
      loadedModulesCount++;
      if (loadedModulesCount === totalModules) {
        console.log("onModuleLoaded", dependencies);
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
      loadModule(url, onModuleLoaded); // loadModule需要保证其子模块也加载完成了才能执行回调onModuleLoaded
    });
  };

  // 调用 define 的时候，证明模块已经loadScript加载完成，并且由浏览器执行了, 但此时该模块依赖的模块不一定加载完成
  // fetch && eval script
  global.define = function (name, dependencies, factory) {
    var absPath = isAbsolute(name) ? name : resolvePath(name);
    modules[absPath] = { loaded: false, factory: factory };

    // 如果没有依赖，直接执行 factory 函数
    if (dependencies.length === 0) {
      modules[absPath].exports = factory.apply(null, arguments);
    } else {
      // 此时依赖的模块还没有加载完成，所以需要使用递归引入子模块
      var depAbsPaths = dependencies.map(function (dep) {
        return resolvePath(dep);
      });
      global.require(depAbsPaths, function (absPath) {
        // 拿到所有依赖模块的导出对象
        var _args = depAbsPaths.map(function (module) {
          return modules[module].exports;
        });
        // 使用 apply 将模块的导出对象传递给 factory 函数
        debugger
        modules[absPath].exports = factory.apply(null, _args);
      });
    }
  };

  global.require.config = function (config) {
    baseUrl = config.baseUrl || "";
    paths = config.paths || {};
  };
})(window);
