## 前言

UMD（Universal Module Definition）是一种通用的模块定义规范，旨在使同一个模块能够在不同的环境中使用，包括浏览器、Node.js 等。它采用一种灵活的方式，既支持类似 CommonJS 的模块加载方式，也支持类似 AMD 的异步加载方式，同时兼容浏览器全局变量的使用。

UMD 模块通常通过一定的判断逻辑来确定当前的模块加载环境，从而决定采用何种加载方式。这种灵活性使得开发者能够编写一次模块代码，然后在不同的环境中使用，无需修改代码。

## UMD 模块的基本结构

UMD 模块通常采用一种通用的结构，用于在不同的加载环境中判断和执行。以下是一个简单的 UMD 模块结构示例：

```js
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD
    define(["dependency"], factory);
  } else if (typeof define === "function" && define.cmd) {
    // CMD 环境
    define(function (require, exports, module) {
      module.exports = factory(require("dependency"));
    });
  } else if (typeof exports === "object") {
    // Node.js/CommonJS
    module.exports = factory(require("dependency"));
  } else {
    // Browser globals
    root.YourModule = factory(root.Dependency);
  }
})(typeof self !== "undefined" ? self : this, function (Dependency) {
  // 你的模块代码
  return YourModule; // 暴露模块
});
```

此结构中，通过判断 define、exports 和全局对象，确定当前所处的环境，从而选择合适的加载方式。

## React 中的 UMD 模块

React 是一个流行的 JavaScript 库，用于构建用户界面。React 库也支持 UMD 格式，使得它可以在浏览器和 Node.js 等环境中使用。

在浏览器中使用 React 的 UMD 模块的示例:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>React Demo template</title>
    <script src="https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.development.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.development.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.22.13/babel.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dayjs/dayjs.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/antd/dist/antd.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      const { render } = ReactDOM; // ReactDOM的UMD对象
      const { useEffect } = React;
      const { Button } = antd; // antd的UMD对象
      //  App
      function App(props: { name: string }) {
        return (
          <div>
            <h1>Hello, {props.name}!</h1>
            <Button type="primary">click me</Button>
          </div>
        );
      }
      // ----------------------------------------------------
      render(<App name="App" />, document.getElementById("root"));
    </script>
  </body>
</html>
```

注意上述的代码中使用了 `type="text/babel"`，这是因为 React 使用了 JSX 语法，需要使用 Babel 进行转换。如果不使用 JSX 语法，可以将 `type="text/babel"` 去掉。

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Webpack/_demo/umd/browser-demo/react.html), 查看示例代码请点击[此处](./_demo/umd/browser-demo/react.html)

回到 React， 其 UMD 模块基本结构如下：

```js
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? factory(exports)
    : typeof define === "function" && define.amd
    ? define(["exports"], factory)
    : ((global = global || self), factory((global.React = {}))); // 我们可以从这里看出，React 的 UMD 模块实际上是将 React 挂载到全局对象上
})(this, function (exports) {
  "use strict";

  // React 导出的代码
  exports.Component = Component;
  exports.createElement = createElement;
  exports.createContext = createContext;

  // ... (其他导出的React功能)
});
```

## 手动实现一个 UMD 模块

假设你实现了一个 Hello 模块, 代码如下

```js
function sayHello() {
  console.log("Hello!");
}
```

第一步，准备一个 factory 函数，用于在不同的环境中执行，代码如下：

```js
function () {
    function sayHello() {
        console.log('Hello!');
    }

    return {
        sayHello: sayHello
    };
}
```

第二步: 全局兼容

```js
(function (root, factory) {
  console.log("-----global环境--------");
  root.Hello = factory();
})(this, function () {
  function sayHello() {
    console.log("Hello!");
  }
  return {
    sayHello: sayHello,
  };
});
```

在这一步中，我们简单地将模块挂载到全局对象 this 上。这样，你可以在浏览器环境中通过 YourModule 来访问模块。

执行结果如下：

> -----global 环境--------
> Hello.js:6 Hello!

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Webpack/_demo/umd/Hello-umd-test/global/index.html), 查看示例代码请点击[此处](./_demo/umd/Hello-umd-test/global/index.html)

第三步: CommonJS 兼容

```js
(function (root, factory) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    console.log("-----commonJS环境--------");
    module.exports = factory();
  } else {
    console.log("-----global环境--------");
    root.Hello = factory();
  }
})(this, function () {
  function sayHello() {
    console.log("Hello!");
  }
  return {
    sayHello: sayHello,
  };
});
```

我们通过判断 module 和 module.exports 的存在，确定当前环境是否支持 CommonJS。如果是 CommonJS 环境，我们将模块导出，否则继续挂载到全局对象。

执行结果如下：

> -----commonJS 环境--------
> Hello!

查看示例代码请点击[此处](./_demo/umd/Hello-umd-test/commonjs/index.js)

第四步: AMD

```js
(function (root, factory) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    console.log("-----commonJS环境, 如nodeJS--------");
    module.exports = factory();
  } else if (typeof define === "function" && define.cmd) {
    console.log("-----CMD环境, 如seaJS--------");
    define([], factory);
  } else if (typeof define === "function" && define.amd) {
    console.log("-----AMD环境, 如requireJS--------");
    define([], factory);
  } else {
    console.log("-----global环境--------");
    root.Hello = factory();
  }
})(this, function () {
  function sayHello() {
    console.log("Hello!");
  }
  return {
    sayHello: sayHello,
  };
});
```

在这一步中，我们通过判断 define 函数的存在，确定当前环境是否支持 AMD。如果是 AMD 环境，我们通过 define 函数来定义模块，否则继续挂载到全局对象。

输出结果如下:

> -----AMD 环境, 如 requireJS--------
> hello.js:17 Hello!

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Webpack/_demo/umd/Hello-umd-test/amd/index.html), 查看示例代码请点击[此处](./_demo/umd/Hello-umd-test/amd/index.html)

第五步： CMD 支持

```js
(function (root, factory) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    console.log("-----commonJS环境, 如nodeJS--------");
    module.exports = factory();
  } else if (typeof define === "function" && define.cmd) {
    console.log("-----CMD环境, 如seaJS--------");
    define([], factory);
  } else if (typeof define === "function" && define.amd) {
    console.log("-----AMD环境, 如requireJS--------");
    define([], factory);
  } else {
    console.log("-----global环境--------");
    root.Hello = factory();
  }
})(this, function () {
  function sayHello() {
    console.log("Hello!");
  }
  return {
    sayHello: sayHello,
  };
});
```

输出结果如下：

> -----CMD 环境, 如 seaJS--------
> Hello.js:17 Hello!

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Webpack/_demo/umd/Hello-umd-test/cmd/index.html), 查看示例代码请点击[此处](./_demo/umd/Hello-umd-test/cmd/index.html)
