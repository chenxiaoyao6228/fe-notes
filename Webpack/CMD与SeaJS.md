## 前言

CMD 规范专门用于浏览器端，模块的加载是异步的，模块使用时才会加载执行。CMD 规范整合了 CommonJS 和 AMD 规范的特点。

## CMD 规范

### 模块定义

模块的定义使用 define 函数，模块的定义也接受两个参数：模块标识符和一个返回模块内容的函数。

```js
// 定义一个模块
define(function (require, exports, module) {
  // 通过exports或者module.exports对外暴露接口
  exports.foo = function () {
    console.log("Hello from myModule!");
  };
});
```

### 模块的引入

在 CMD 规范中，引入模块时使用 require 函数

```js
// 引入模块
var myModule = require("myModule");
myModule.foo(); // 调用模块中的函数
```

### 标志符

CMD 中的模块标识符同样是一个字符串，用于唯一标识一个模块。模块标识符通常是模块的路径，可以包含文件路径或者相对路径。

## 与其他规范的区别

### 与 CommonJS 的区别

CMD 与 CommonJS 的不同之处在于

- CMD 模块需要用 define 来明确定义一个模块，而在 Node 实现中是隐式包装的
- CMD 是异步加载模块，而 CommonJS 是同步加载模块

### 与 AMD 的区别

AMD 规范推崇的是依赖前置，CMD 推崇的是依赖就近。可以非常简单的理解为：

- **依赖前置**就是在模块声明/引入前，先把该模块需要的依赖先引入
- **依赖就近**就是模块声明/引入不需要提前引入依赖，在模块内部再引入

## SeaJS 的使用

Sea.js 由国内的玉伯创建，是一个遵循 CMD 规范的模块加载器。

seajs 的引入和启动:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>seaJS项目展示</title>
    <!-- 引入 seaJS -->
    <script src="libs/seaJS.js"></script>
    <!-- 引入配置和入口脚本 -->
    <script>
      seajs.config({
        base: "./scripts",
        alias: {
          "lib-a-dep": "lib-a-dep",
          "lib-a": "lib-a", // 不需要写.js后缀
          "my-script": "my-script",
        },
      });
      // 启动应用
      seajs.use("my-script");
    </script>
  </head>
  <body></body>
</html>
```

```js
// my-script.js
define(function (require, exports, module) {
  var libA = require("lib-a");

  function logMsg() {
    var a = libA.foo; // "foo"
    alert(a + "-" + libA.bar);
  }

  var button = document.createElement("button");
  button.innerHTML = "Click me and look at the console!";
  button.onclick = logMsg;
  document.body.appendChild(button);
});
```

## SeaJS 的关键原理

仔细观察上面的代码，我们会发现 seaJS 的写法与 requireJS 的写法不同，更符合 nodeJS 对模块的同步写法

```js
var libA = require("lib-a");
console.log("libA", libA); // 如何保证libA已经加载完成了呢？
```

那么问题来了，nodejs 运行在服务端，同步加载模块是没有问题的，

但是实际上 seaJS 是异步加载的，那么 seaJS 是如何实现这种同步的写法的呢？

### 如何解析加载依赖

- 通过回调函数的 Function.toString 函数，使用正则表达式来捕捉内部的 require 字段，找到 require('lib-a')内部依赖的模块 lib-a
- 根据配置文件，找到 lib-a 的 js 文件的实际路径
- 在 dom 中插入 script 标签，载入模块指定的 js，绑定加载完成的事件，使得加载完成后将 js 文件绑定到 require 模块指定的 id（这里就是 lib-a 这个字符串）上
- 回调函数内部依赖的 js 全部加载（暂不调用）完后，调用回调函数
- 当回调函数调用 require('lib-a')，即执行绑定在'lib-a'这个 id 上的 js 文件，即刻执行，并将返回值传给 var libA

### 实现

seaJs 的操作确实有点骚，简易好好看下下面的实现代码

```js
(function () {
  "use strict";

  class Context {
    constructor() {
      this.config = {};
      this.modules = {};
    }
    setConfig(config) {
      const rootPath = getRootPath();
      config.base = rootPath + "/" + config.base.split("/").slice(1);
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

  function getRootPath() {
    // 简单处理， 从index.html获取base
    const rootPath = window.location.href.replace("/index.html", "");
    return rootPath;
  }

  function getAbsPath(id) {
    if (id.startsWith("http")) {
      return id;
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

  class Module {
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
          return new Promise((resolve, reject) => {
            const absPath = getAbsPath(depId);
            const depModule =
              contextInstance.getModule(absPath) || new Module(absPath);
            depModule.on("complete", resolve);
            depModule.on("error", reject);
          });
        })
      )
        .then(() => {
          module.emit("complete");
        })
        .catch((err) => {
          module.emit("error", err);
        });
    } else {
      module.emit("complete");
    }
  }

  // require的执行时机是在factory里面，此时应该是parent以及deps全部加载完成才会执行该方法
  function require$1(id) {
    const module = contextInstance.getModule(getAbsPath(id));

    if (!module) {
      throw new Error(`module ${getAbsPath(id)} is not found`);
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
```

查看示例代码请点击[此处](https://github.com/chenxiaoyao6228/fe-notes/blob/main/Webpack/_demo/mini-cmd-seaJS/examples/index.html)
