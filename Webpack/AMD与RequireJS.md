## AMD 与 RequireJS

一个常规的 requireJS 项目结构如下：

```
project-directory/
|-- index.html
|-- scripts/
| |-- lib-a.js
| |-- my-script.js
```

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RequireJS项目展示</title>
    <!-- 引入 RequireJS -->
    <script src="https://requirejs.org/docs/release/2.3.6/minified/require.js"></script>

    <!-- 引入配置和入口脚本 -->
    <script>
      require.config({
        baseUrl: "scripts", // 设置基准路径
        paths: {
          "lib-a": "lib-a", // 不需要写.js后缀
          "my-script": "my-script",
        },
      });

      // 启动应用
      require(["my-script"]);
    </script>
  </head>
  <body></body>
</html>
```

my-script.js

```js
define(["lib-a"], function (libA) {
  var a = libA.foo; // "bar"
  alert(a);
});
```

lib-a.js

```js
define([], function () {
  var foo = "bar";

  var libA = {
    foo: foo,
  };

  return libA;
});
```

实现 amd 的一些知识点

- script 的 onload 回调后于 script 内容的执行
- 相互递归的设计
- 先别考虑怎么实现 require 和 define，先考虑 Module 应该拥有哪些状态

下面是一个具体的 miniRequireJS 的实现

```js
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
```

> 对应的代码在 \_demo/mini-amd-requireJS 目录下， 除了 Promise 版本的实现，还有回调版本的实现，可以自行查看

AMD 的优缺点
AMD 运行时核心思想是「Early Executing」，也就是提前执行依赖 AMD 的这个特性有好有坏：
