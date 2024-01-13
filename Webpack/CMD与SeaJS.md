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

### 如何解析加载依赖

- 通过回调函数的 Function.toString 函数，使用正则表达式来捕捉内部的 require 字段，找到 require('lib-a')内部依赖的模块 lib-a
- 根据配置文件，找到 lib-a 的 js 文件的实际路径
- 在 dom 中插入 script 标签，载入模块指定的 js，绑定加载完成的事件，使得加载完成后将 js 文件绑定到 require 模块指定的 id（这里就是 lib-a 这个字符串）上
- 回调函数内部依赖的 js 全部加载（暂不调用）完后，调用回调函数
- 当回调函数调用 require('lib-a')，即执行绑定在'lib-a'这个 id 上的 js 文件，即刻执行，并将返回值传给 var libA
