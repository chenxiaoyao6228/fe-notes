(function (global) {
  var rootPath = window.location.href.replace("/index.html", "");
  var modules = {};
  var baseUrl = "";
  var paths = {};

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
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
  }

  function loadModule(url, onModuleLoaded) {
    if (!modules[url] || !modules[url].loaded) {
      loadScript(url, function () {
        modules[url].loaded = true;

        var dependencies = modules[url].dependencies;
        var factory = modules[url].factory;

        // 如果此时没有依赖，说明是一个独立的模块，直接执行factory
        if (dependencies.length === 0) {
          modules[url].exports = factory.apply(null, arguments);
          onModuleLoaded();
        } else {
          // 否则，加载所有的依赖模块，然后执行factory
          global.require(dependencies, function () {
            var depAbsPaths = dependencies.map(function (dep) {
              return resolvePath(dep);
            });
            var _args = depAbsPaths.map(function (module) {
              return modules[module].exports;
            });
            modules[url].exports = factory.apply(null, _args);
            onModuleLoaded()
          });
        }
      });
    } else {
      onModuleLoaded();
    }
  }

  global.require = function (dependencies, callback) {
    var resolvedDependencies = dependencies.map(resolvePath);
    var loadedModulesCount = 0;
    var totalModules = resolvedDependencies.length;

    function onModuleLoaded() {
      loadedModulesCount++;
      if (loadedModulesCount === totalModules) {
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
    var absPath = isAbsolute(name) ? name : resolvePath(name);
    modules[absPath] = { loaded: false, factory: factory, dependencies };
  };

  global.require.config = function (config) {
    baseUrl = config.baseUrl || "";
    paths = config.paths || {};
  };
})(window);
