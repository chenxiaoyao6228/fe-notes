## AMD 与 RequireJS

CommonJS 规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。由于 Node.js 主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以 CommonJS 规范比较适用。

但是如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，AMD 规范是其中比较成熟的一个。

## AMD 规范

### 模块定义

在 AMD 规范中，每个模块都被定义为一个独立的文件，模块可以包含特定功能、代码段或对象。模块的定义使用 define 函数，该函数接受两个参数：模块标识符和一个返回模块内容的函数。

```js
// 定义一个模块
define("myModule", function () {
  // 显示地return一个对象
  return {
    foo: function () {
      console.log("Hello from myModule!");
    },
  };
});
```

### 模块的引入

引入模块时使用 require 函数，通过指定模块标识符来加载依赖。当模块被引入时，相应的回调函数将执行，并返回模块的实例或功能。

```js
// 引入模块
require(["myModule"], function (myModule) {
  myModule.foo(); // 调用模块中的函数
});
```

### 标志符

在 AMD 中，模块的标识符是一个字符串，用于唯一标识一个模块。模块标识符通常是模块的路径，可以包含文件路径或者相对路径。

```js
// 使用标识符引入模块
require(["path/to/myModule"], function (myModule) {
  // 模块加载成功后的操作
});
```

## 案例实现

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
