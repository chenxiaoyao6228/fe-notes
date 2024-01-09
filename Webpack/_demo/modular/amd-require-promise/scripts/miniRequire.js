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
    console.log("loadModuleAsync 开始-------------", url);
    return new Promise((resolve, reject) => {
      // if (!modules[url] || !modules[url].loaded) {
        loadScriptAsync(url)
          .then(() => {
            const _deps = modules[url].deps;

            if(_deps.length === 0) {
              return resolve();
            }

            // 模块加载且执行完成, define已执行
            return global.require(modules[url].deps, ()=> {
              // 所有子模块加载完成，执行factory
              var _exports = modules[url].factory.apply(null, arguments);
              console.log("_exports", _exports);
              resolve(_exports);
            });
          })
          .catch(reject);
      // } else {
      //   resolve(modules[url]);
      // }
    });
  }

  global.require = function (dependencies, callback) {


    return new Promise((resolve, reject) => {
      var resolvedDependencies = dependencies.map(resolvePath);
  
      return Promise.all(resolvedDependencies.map(loadModuleAsync)).then(
        (dependencyModules) => {
          console.log("All modules loaded: ", dependencyModules);
        const _dep_exports =  dependencyModules.map((module) => module.exports);
          resolve(_dep_exports);
        }
      );
    })

  };

  global.define = function (name, dependencies, factory) {
    console.warn(` define执行, ${name}`, dependencies);

    var absPath = isAbsolute(name) ? name : resolvePath(name);

    modules[absPath] = {
      name: absPath,
      deps: dependencies,
      loaded: false,
      factory: factory,
      exports: null,
    };

  
    // return Promise.all(depAbsPaths.map(loadModuleAsync)).then(() => {
    //   var _args = depAbsPaths.map(function (module) {
    //     return modules[module].exports;
    //   });
    //   modules[absPath].exports = factory.apply(null, _args);
    // });
    // 此时依赖还是没有回来, 但是onload已经触发 => 把require放到onload里面!!
  };

  global.require.config = function (config) {
    baseUrl = config.baseUrl || "";
    paths = config.paths || {};
  };
})(window);
