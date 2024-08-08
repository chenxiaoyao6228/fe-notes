---
title: "深入理解CommonJS模块化规范与Node.js实现"
date: "2023-12-12"
summary: "本文介绍了CommonJS规范及其在Node.js中的实现，包括模块定义、引用、标识和编译执行的过程，并探讨了模块缓存、路径分析及循环依赖问题。"
tags: ["前端", "模块化", "JavaScript", "CommonJS", "Node.js"]
draft: false
authors: ["default"]
---

## 前言

在其他高级语言中，Java 有类文件，Python 有 import 机制，Ruby 有 require,PHP 有 include 和 require。而 JavaScripti 通过`<script>`标签引入代码的方式显得杂乱无章.CommonJS 规范为 JavaScriptf 制定了一个美好的愿景一希望 JavaScript 能够在任何地方运行。

本节主要介绍 CommonJS 规范，以及 Node.js 中的实现。

> 本节所有代码在[此处](https://github.com/chenxiaoyao6228/fe-notes/tree/main/Webpack/_demo/commonJS)

## CommonJS 基本语法

### 模块定义

在 CommonJS 模块系统中，使用`module.exports`和`exports` 对象来导出模块。例如：

```js
// lib-a.js
var foo = "foo";

export function getFoo() {
  return "foo";
}

module.exports = {
  foo,
};
```

### 模块引用

在 CommonJS 模块系统中，使用 require() 函数来引入一个模块。例如:

```js
const libA = require("./lib-a");

console.log(libA.foo); // "foo"
```

### 模块标识

在 CommonJS 模块系统中，模块标识可以是相对路径或绝对路径。例如：

```js
// 自己的模块
const myModule = require("./myModule");
// 引入第三方模块
const myModule = require("third-party-module");
```

## NodeJS 的模块实现

NodeJS 在实现中并非完全按照规范实现，而是对模块规范进行了一定的取舍，同时也增加了少许自身需要的特性。

在 Node 中引入模块，需要经历如下四个步骤：

- 缓存查找
- 路径分析
- 文件定位
- 模块编译执行

同时，在 Node 中，模块分为两类：

- 核心模块： Node 内置的模块，如 fs、http 等, 核心模块的代码在 Node 源码编译的过程中编译成了二进制文件，在 Node 进程启动时，部分核心模块就被直接加载进内存中，所以这部分核心模块引入时，文件定位和编译执行这两个步骤可以省略掉，并且在路径分析中优先判断，所以它的加载速度是最快的。

- 文件模块： 用户编写的模块，它的加载速度比核心模块慢，因为它需要经历路径分析、文件定位和编译执行这三个步骤，同时它的加载速度还受到文件系统的影响。

### 缓存查找

为了提高性能，CommonJS 采用了模块缓存机制。一旦模块被加载，它会被缓存起来，与浏览器不同的地方浏览器仅仅缓存文件，而 Node 缓存的是编译和执行之后的对象。

下次再次引入相同的模块时，不会重新加载，而是直接使用缓存的版本。

### 路径分析与文件定位

当执行 require 时，Node.js 会对模块的标识符进行路径分析，以确定模块的位置。有以下类型的模块标识符：

- 核心模块标识符（Core Modules）： 核心模块是 Node.js 内置的模块，可以直接通过模块名引入

  - require('fs')

- 文件模块标识符：
  - 相对路径： 相对路径是以 . 或 .. 开头的路径，例如 require('./myModule')。
  - 绝对路径： 绝对路径是以 / 开头的路径，例如 require('/home/user/myModule')。
  - 非核心模块标识符： 非核心模块是非 Node.js 内置的模块，例如 require('lodash')。

当处理文件模块时，Node.js 会执行以下步骤进行路径分析和文件定位：

- 核心模块： 如果标识符是核心模块，因为已经提前编译好，所以可以直接返回核心模块，无需路径分析。

- 文件模块： 如果标识符是文件模块，则继续下一步路径分析。

  - 绝对路径则直接使用该路径。

  - 相对路径： 如果标识符是相对路径，则将其解析为绝对路径。Node.js 会根据当前执行脚本的路径进行解析。

  - 非核心模块标识符: 如果标识符不是绝对路径或相对路径，Node.js 会在模块路径中查找。模块路径是一个由多个目录组成的数组，包括当前模块所在的目录和所有父目录。Node.js 会按照数组顺序查找模块。

我们可以通过 module.paths 属性查看模块路径。

比如有一段代码:

```js
// my-script.js
console.log("module", module.paths);
```

执行结果如下：

```
module [
  '/Users/chenxiaoyao/Desktop/demo/personal-notes/docs/Webpack/_demo/commonJS/node_modules',
  '/Users/chenxiaoyao/Desktop/demo/personal-notes/docs/Webpack/_demo/node_modules',
  '/Users/chenxiaoyao/Desktop/demo/personal-notes/docs/Webpack/node_modules',
  '/Users/chenxiaoyao/Desktop/demo/personal-notes/docs/node_modules',
  '/Users/chenxiaoyao/Desktop/demo/personal-notes/node_modules',
  '/Users/chenxiaoyao/Desktop/demo/node_modules',
  '/Users/chenxiaoyao/Desktop/node_modules',
  '/Users/chenxiaoyao/node_modules',
  '/Users/node_modules',
  '/node_modules'
]

```

可以看到，模块路径是一个数组，包含了当前模块所在的目录和所有父目录。

#### 文件扩展名处理

如果标识符没有指定扩展名，Node.js 在尝试加载文件时会根据文件扩展名的规则进行匹配。

- .js: JavaScript 源码文件。
- .json: JSON 格式文件。
- .node: 由 C/C++编写的二进制模块。

#### 目录处理

如果路径指向一个目录而非文件，Node.js 会尝试查找目录下的 package.json 文件，从中读取 main 字段指定的入口文件。

如果没有 package.json 或没有 main 字段，Node.js 会默认查找目录下的 index.js 文件作为入口文件。

```js
const libADep = require("./lib-a-dep");
```

### 编译执行

在 Node 中，每个文件模块都是一个对象，它的定义如下：

```js
function Module(id, parent) {
  this.id = id;
  this.exports = {};
  this.parent = parent;
  if (parent & parent.children) {
    parent.children.push(this);
  }
  this.filename = null;
  this.loaded = false;
  this.children = [];
}
```

编译和执行是引入文件模块的最后一个阶段。定位到具体的文件后，Nod 会新建一个模块对
象，然后根据路径载入并编译。对于不同的文件扩展名，其载入方法也有所不同，具体如下所示。

- js 文件: 通过 fs 模块同步读取文件后编译执行。
- .node 文件:这是用 C/C++编写的扩展文件，通过 dlopen()方法加载最后编译生成的文件。
- json 文件: 通过 fs 模块同步读取文件后，用 JSON.parse() 解析返回结果。
- 其余扩展名文件。它们都被当做 js 文件载入。

每一个编译成功的模块都会将其文件路径作为索引缓存在 Module.cache 对象上，以提高二次引入的性能。

在确定文件的扩展名之后，Nod 将调用具体的编译方式来将文件执行后返回给调用者。

#### Javascript 的模块编译

回到 CommonJS 模块规范，我们知道每个模块文件中存在着 require、exports、module 这 3 个变量，但是它们在模块文件中并没有定义，那么从何而来呢？甚至在 Node 的 API 文档中，我们知道每个模块中还有 filename、dirname 这两个变量的存在，它们又是从何而来的呢？如果我们把直接定义模块的过程放诸在浏览器端，会存在污染全局变量的情况。

事实上，在编译的过程中，Node 对获取的 JavaScript 文件内容进行了头尾包装。

类似这样

```js
const wrapped = `
(function(exports,require,module, filename,\_dirname){
  // 你的代码
})`;
```

最终， 一个正常的 JavaScript 文件会被包装成如下的样子：

```js
(function (exports,require,module,_filename,dirname){
  var math =  require('math');
  exports.area =  function (radius)
  return Math.PI radius radius;
});
```

这样每个模块文件之间都进行了作用域隔离。包装之后的代码会通过原生模块的 runInThisContext 方法执行（类似 eval,只是具有明确上下文，不污染全局），返回一个具体的 function 对象。最后，将当前模块对象的 exports 属性、require()方法、module(模块对象自身)，以及在文件定位中得到的完整文件路径和文件目录作为参数传递给这个 function()执行。

这就是这些变量并没有定义在每个模块文件中却存在的原因。在执行之后，模块的 exports 属性被返回给了调用方。exports 属性上的任何方法和属性都可以被外部调用到，但是模块中的
其余变量或属性则不可直接被调用。

对应的源码在： https://github.com/nodejs/node/blob/main/lib/internal/modules， 感兴趣的可以看看。

如果你观察 webpack 打包后的代码，你会发现它也是这样的。

```js
(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";
  eval(
    '__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (/* binding */ sum)\n/* harmony export */ });\nfunction sum (a,b) {\n    return a + b;\n}\n\n//# sourceURL=webpack://webpack-basic-bundle/./src/sum.js?'
  );
};
```

## 进阶

### exports 与 module.exports 的区别

初学 Nodejs 的时候曾经纠结过为何存在 exports 的情况下，还存在 module.exports。理想情况下，只要赋值给 exports 即可：

```js
exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
};
```

而是这样

```js
exports.add = (a, b) => a + b;
exports.subtract = (a, b) => a - b;
```

又或者这样

```js
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
};
```

两者还不能混用，如果你使用 exports 为模块导出内容，然后又直接给 module.exports 赋值，最终导出的是 module.exports 的值，而不是 exports 的值。

```js
exports.add = (a, b) => a + b; // 不会被导出

module.exports = {
  subtract: (a, b) => a - b,
};
```

让我们来简化下 Nodejs 的模块加载编译过程

```js
function require(path) {
  if (require.cache[path]) {
    return require.cache[path].exports;
  }
  var src = fs.readFileSync(path);
  // ----- NodeJS包裹并执行代码, 开始 --------
  var code = new Function("exports, module", src);
  var exports = {},
    module = { exports: exports };
  code(module.exports, module);
  require.cache[path] = module;
  // ------ NodeJS包裹并执行代码, 结束 ---
  return module.exports;
}
require.cache = Object.create(null);
```

exports,对象是通过形参的方式传入的，直接赋值形参会改变形参的引用，但并不能改变作用域外的值。

比如下面的测试文件：

```js
var _exports = {
  a: 1,
};
const _module = {
  _exports: _exports,
};

function change(_exports, _module) {
  _exports = {
    a: 2,
  };

  _module._exports.a = 3;

  console.log("_module in change function", _module);

  console.log("_exports in change function", _exports);
}

change(_exports, _module);

console.log("_module outside change function", _module);
console.log("_exports outside change function", _exports);
```

执行的结果如下

```
_module in change function { _exports: { a: 3 } }
_exports in change function { a: 2 }
_module outside change function { _exports: { a: 3 } }
_exports outside change function { a: 3 }
```

### 循环依赖的情况

```js
// a.js
console.log("a starting");
exports.done = false;
const b = require("./b.js");
console.log("in a, b.done = %j", b.done);
exports.done = true;
console.log("a done");

// b.js
console.log("b starting");
exports.done = false;
const a = require("./a.js");
console.log("in b, a.done = %j", a.done);
exports.done = true;
console.log("b done");

// main.js
console.log("main starting");
const a = require("./a.js");
const b = require("./b.js");
console.log("in main, a.done = %j, b.done = %j", a.done, b.done);
```

> 代码在： /Webpack/\_demo/commonJS/\_others/mutual-reference

执行结果如下：

```
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done = true, b.done = true
```

执行过程分析：

```
- 执行 main.js，打印 main starting
- main.js 执行 require('./a.js')，发现 a.js 还没有加载，所以会加载 a.js
- a.js 执行， 打印 a starting， 运行到 exports.done = false， 此时 exports 对象为 {done: false}
- a.js 执行 require('./b.js')，发现 b.js 还没有加载，所以会加载 b.js
- b.js 执行， 打印 b starting，
- b.js 执行 require('./a.js')，发现 a.js 已经加载，所以不会重复加载，直接返回 exports 对象，此时 a.js 的 exports 对象为 {done: false}
- b.js 执行完毕，打印 b done，返回， 此时 b.js exports 对象为 {done: true}
- a.js 执行，打印 b.done = true,
- a.js 执行 exports.done = true，返回，此时 a.js 的 exports 对象为 {done: true}
- main.js 执行，打印 in main, a.done = true, b.done = true
```

### 前后端通用性与 browserify

Browserify 是一个用于在浏览器环境中使用 CommonJS 模块的工具。它的基本原理是将 Node.js 风格的模块（采用 CommonJS 规范）转换为浏览器可以理解和执行的代码。

```bash
npm install browserify --save-dev
```

文件创建

```js
// module.js
module.exports = function (message) {
  console.log("Hello, " + message);
};

// main.js
var myModule = require("./module");
myModule("World");
```

执行打包

```bash
npx browserify src/main.js -o dist/bundle.js --debug
```

打包结果如下:

```js
(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw ((a.code = "MODULE_NOT_FOUND"), a);
        }
        var p = (n[i] = { exports: {} });
        e[i][0].call(
          p.exports,
          function (r) {
            var n = e[i][1][r];
            return o(n || r);
          },
          p,
          p.exports,
          r,
          e,
          n,
          t
        );
      }
      return n[i].exports;
    }
    for (
      var u = "function" == typeof require && require, i = 0;
      i < t.length;
      i++
    )
      o(t[i]);
    return o;
  }
  return r;
})()(
  {
    1: [
      function (require, module, exports) {
        // main.js
        var myModule = require("./module");
        myModule("World");
      },
      { "./module": 2 },
    ],
    2: [
      function (require, module, exports) {
        // module.js
        module.exports = function (message) {
          console.log("Hello, " + message);
        };
      },
      {},
    ],
  },
  {},
  [1]
);
```

> 代码在：[ Webpack/\_demo/commonJS/\_others/browserify](https://github.com/chenxiaoyao6228/fe-notes/tree/main/Webpack/_demo/commonJS/_others/browserify)

#### Browserify 打包的基本原理:

- 依赖解析： 当你使用 require 导入一个模块时，Browserify 会进行依赖解析。它会递归查找模块的所有依赖关系，并构建一个依赖图
- 打包： 一旦依赖图形成，Browserify 将这些模块打包到一个单独的文件中。这个文件包含了所有的模块代码，以及必要的代码来处理模块之间的依赖关系。
- 转换为浏览器可执行的代码： Browserify 会对打包后的代码进行一些转换，以确保它能够在浏览器环境中正确执行。这可能包括对 require 的替换和其他一些浏览器不支持的 Node.js 特性的处理。
- 输出： 最终，Browserify 生成一个可以在浏览器中运行的 JavaScript 文件。你可以在 HTML 文件中引入这个生成的文件，使得你的 CommonJS 模块能够在浏览器中正常工作。

其实可以看到，无论是 browserify, webpack 还是 rollup， 打包的基本原理都是一样的，只是实现的方式不同。

> 本文首发于个人 Github[前端开发笔记](https://github.com/chenxiaoyao6228/fe-notes)，由于笔者能力有限，文章难免有疏漏之处，欢迎指正
