(function (global) {
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

    var fullPath = baseUrl + "/" + _mapPath + ".js";

    return fullPath;
  }

  function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
  }

  function loadModule(url, callback) {
    if (!modules[url] || !modules[url].loaded) {
      loadScript(url, function () {
        modules[url] = { loaded: true };
        callback(modules[url]);
      });
    } else {
      callback(modules[url]);
    }
  }

  global.seajs = {
    config: function (config) {
      baseUrl = config.base || "";
      paths = config.alias || {};
    },

    use: function (entryModule) {
      var entryPath = resolvePath(entryModule);
      loadModule(entryPath, function (module) {
        global.require([entryPath], function () {
          // Entry module loaded
        });
      });
    },
  };

  global.define = function (name, factory) {
    var absPath = resolvePath(name);

    if (!modules[absPath]) {
      modules[absPath] = { loaded: false };

      var require = function (dep) {
        var depModule = modules[resolvePath(dep)];
        if (!depModule) {
          throw new Error('Module not found: ' + dep);
        }
        return depModule.exports;
      };

      var module = { exports: {} };

      factory(require, module.exports, module);

      modules[absPath].exports = module.exports;
      modules[absPath].loaded = true;
    }
  };

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
})(window);
