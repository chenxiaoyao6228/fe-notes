## 前言

本文总结了一些关于 Vite 的工作原理，以及一些实现细节。

> 本节对应的 demo 在\_demo/mini-vite 目录下

## 什么是 Vite

Vite 是一个基于浏览器原生 ES imports 的开发服务器。利用浏览器去解析 imports，在服务器端按需编译返回，完全跳过了打包这个概念，服务器随起随用。

## 实现步骤

- 项目搭建
- 实现 cli
- 起静态服务器, nodemon 监听文件修改，执行 vite 命令
- 处理 index.html
- 处理 js，处理 node_modules 的引入
- 中间件拆分
- 处理 react 文件

## 项目结构

├── \_example
├── cli
│ └── index.js
├── src
│ └── index.js

\_example 通过 npx create-vite-app 创建的 vite 项目， 用于和 mini-vite 对比

```bash
npx create-vite _example --template react
```

## 实现 cli

新建 cli/index.js

```bash
#! /usr/bin/env node
console.log("mini-vite!");
```

mini-vite/package.json

```json
{
  "bin": "cli/index.js"
}
```

通过 yarn link 将 cli 链接到全局

```bash
#  _demo/mini-vite目录
yarn link
```

在 \_example 中 link

```bash
#  _demo/mini-vite/_example目录
yarn link mini-vite
```

在 package.json 中添加命令

```json
{
  "scripts": {
    "dev:mini-vite": "mini-vite"
  }
}
```

跑下 dev:mini-vite 命令，可以看到控制台已经打印出 mini-vite!

## 起静态服务器

依赖安装

```bash
yarn add koa koa-static
```

在 src 目录下新建 index.js

```js
// src/index.js
const Koa = require("koa");
const KoaStatic = require("koa-static");

const app = new Koa();

// 执行命令时的路径
const rootPath = process.cwd();
app.use(KoaStatic(rootPath));

app.listen(8000, () => {
  console.log("mini-vite server启动成功！");
});
```

同时，在\_example 中的 package.json 中添加命令

```json
{
  "scripts": {
    "dev:mini-vite": "nodemon -w ../ --exec mini-vite",
    "mini-vite": "mini-vite"
  }
}
```

并安装 nodemon

```bash
# mini-vite/_example
yarn add nodemon -D
```

执行，可以看到控制台打印出 mini-vite server 启动成功！同时在浏览器中打开 http://localhost:8000/ 可以看到项目已经跑起来了。(这里的端口号是 8000，是因为 create-vite-app 默认的端口号是 3000，所以这里我们用 8000)

同时修改 index.js 也可以看到 terminal 中打印出修改成功。

![](../../cloudimg/2024/mini-vite-static-server.png)

## 处理 jsx

现在我们已经可以返回静态文件了，但是在返回 index.html 中后，浏览器随即发起了 src/main.jsx 的请求

```html
<script type="module" src="/src/main.jsx"></script>
```

然后就报错了，因为浏览器无法解析 jsx 文件，所以我们需要对.jsx 进行处理，将 src/main.jsx 改为 src/main.js

> main.jsx:1 Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/jsx". Strict MIME type checking is enforced for module scripts per HTML spec.

首先是 jsx 的转换

在 mini-vite 目录安装依赖：

```bash
# mini-vite
yarn add  @babel/core @babel/plugin-transform-react-jsx
```

添加 transformJsx 函数

```js
function transformJsx(jsxCode) {
  const babel = require("@babel/core");

  const options = {
    // presets: ['@babel/preset-env'], // 注意这里不要使用 @babel/preset-env，因为它会将所有的代码都转换成 ES5，包括import
    plugins: [
      [
        "@babel/plugin-transform-react-jsx",
        {
          pragma: "React.createElement",
          pragmaFrag: "React.Fragment",
        },
      ],
    ],
  };

  const { code } = babel.transform(jsxCode, options);

  return code;
}
```

修改 src/index.js 的代码， 进行了一点重构， 添加中间件的机制

```js
// index.js
const Koa = require("koa");
const KoaStatic = require("koa-static");

function createServer() {
  const app = new Koa();

  const context = {
    app,
    rootPath: process.cwd(),
  };
  const resolvePlugins = [moduleRewirePlugin, serverStaticPlugin];

  resolvePlugins.forEach((plugin) => plugin(context));
}

createServer();

function serverStaticPlugin({ app, rootPath }) {
  app.use(KoaStatic(rootPath));
  app.use(KoaStatic(rootPath, "/public"));

  app.listen(8000, () => {
    console.log("mini-vite server启动成功！");
  });
}

function moduleRewirePlugin({ app, context }) {
  app.use(async (ctx, next) => {
    await next();
    if (ctx.body && ctx.response.is("jsx")) {
      // 初始的 ctx.body 是一个 Readable 流，需要转换成字符串
      const jsxCode = await readBody(ctx.body);
      // 通过babel转换jsx代码
      const transformedCode = transformJsx(jsxCode);

      ctx.type = "application/javascript";
      ctx.body = transformedCode;
    }
  });
}

function transformJsx(jsxCode) {
  const babel = require("@babel/core");

  const options = {
    // presets: ['@babel/preset-env'], // 注意这里不要使用 @babel/preset-env，因为它会将所有的代码都转换成 ES5，包括import
    plugins: [
      [
        "@babel/plugin-transform-react-jsx",
        {
          pragma: "React.createElement",
          pragmaFrag: "React.Fragment",
        },
      ],
    ],
  };

  const { code } = babel.transform(jsxCode, options);

  return code;
}

function readBody(stream) {
  return new Promise((resolve, reject) => {
    if (!stream.readable) {
      resolve(stream);
    } else {
      let res = "";
      stream.on("data", (data) => {
        res += data;
      });
      stream.on("end", () => {
        resolve(res);
      });
      stream.on("error", (err) => {
        reject(err);
      });
    }
  });
}
```

可以看到此时浏览器已经成功请求到了 main.js， 并且我们的 jsx 语法也被转换成了 React.createElement

![](../../cloudimg/2024/mini-vite-transformed-jsx.png)

但此时浏览器报错了

> Uncaught TypeError: Failed to resolve module specifier "react". Relative references must start with either "/", "./", or "../".

原因是我们在 main.js 中引入了 react，但是浏览器无法解析 node_modules 中的模块，所以我们需要对 node_modules 中的模块进行处理。

## 处理 node_modules

添加自定义的 babel 插件

```js
module.exports = function ({ types: t }) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const { node } = path;
        const id = node.source.value;
        // 简化场景： 不是以 / . 开头的，都是第三方模块，不考虑alias等其他情况
        if (/^[^\/\.]/.test(id)) {
          node.source = t.stringLiteral("/@modules/" + id);
        }
      },
    },
  };
};
```

服务端做对应的处理

```js
const customAliasPlugin = require("./babel-plugin-custom-alias");

const regex = /^\/@modules\//;
function moduleResolvePlugin({ app, context }) {
  app.use(async (ctx, next) => {
    if (!regex.test(ctx.path)) {
      return next();
    }
    const id = ctx.path.replace(regex, "");
    console.log("id", id);

    const mapping = {
      // 从package.json中读取esm读出来的字段，这里只是简化了一下，正常应该从package.json中读取esm导出
      react: path.resolve(process.cwd(), "node_modules/react/index.js"),
      "react-dom/client": path.resolve(
        process.cwd(),
        "node_modules/react-dom/client.js"
      ),
    };

    ctx.type = "application/javascript";

    const content = fs.readFileSync(mapping[id], "utf-8");

    ctx.body = content;
  });
}
```

上述操作遇到一个问题就是，react 没有提供 esm 的版本！

看了下 React 官方的 package.json 的 export 字段

```json
{
  "exports": {
    ".": {
      "react-server": "./react.shared-subset.js",
      "default": "./index.js"
    },
    "./package.json": "./package.json",
    "./jsx-runtime": "./jsx-runtime.js",
    "./jsx-dev-runtime": "./jsx-dev-runtime.js"
  }
}
```

找到对应的 index.js

```js
"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./cjs/react.production.min.js");
} else {
  module.exports = require("./cjs/react.development.js");
}
```

这里也提到了：https://segmentfault.com/q/1010000043780457

两种方案

- 1. 找一个有 esm 的版本，比如 https://github.com/esm-bundle/react
- 2. 还是原来的包，但是需要在服务端做一些处理，将 cjs 的包转换成 esm 的包

看看 vite-plugin-react 是如何这个问题的, 还是回到浏览器，查看正常 vite 打包出来的文件

```js
import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=78b1e259";
const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=78b1e259";
const React = __vite__cjsImport1_react.__esModule
  ? __vite__cjsImport1_react.default
  : __vite__cjsImport1_react;
import __vite__cjsImport2_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=78b1e259";
const ReactDOM = __vite__cjsImport2_reactDom_client.__esModule
  ? __vite__cjsImport2_reactDom_client.default
  : __vite__cjsImport2_reactDom_client;
import App from "/src/App.jsx";
// ReactDOM.createRoot(document.getElementById("root")).render
```

看了下 node_modules/.vite/deps/react.js，确实是把代码 copy 了一份，然后把 cjs 的包转换成了 esm 的包，这个过程在 vite 中称为 optimizeDeps

![](../../cloudimg/2024/mini-vite-react-plugin-import.png)

## 处理 commonJS

vite 内部用了 esbuild 去处理，这里我们就不用 esbuild 了，直接用 babel 去处理

```bash
yarn add @babel/core @babel/plugin-transform-modules-commonjs

```

我们在启动服务的时候，添加一个 setupDevDepsAssets 的过程

```js
setupDevDepsAssets(process.cwd());
```

```js
/**
 * 依赖预构建，将react, react-dom, scheduler等第三方库转换成ES Module， 写入开发临时文件夹
 * @param {*} rootPath
 */
function setupDevDepsAssets(rootPath) {
  //查看node_modules/.mini-vite
  const tempDevDir = path.resolve(rootPath, "node_modules", ".mini-vite");

  if (!fs.existsSync(tempDevDir)) {
    fs.mkdirSync(tempDevDir);
  }

  // 将项目中的 react, react-dom, scheduler 等第三方库转换成 ES Module，写入到 node_modules/.mini-vite 目录下
  // 这里只是简化，实际上要从index.html中开始递归查找依赖，然后再转换
  const mapping = {
    react: {
      sourcePath: path.resolve(
        rootPath,
        "node_modules/react/cjs/react.development.js"
      ),
      targetPath: path.resolve(tempDevDir, "react.js"),
    },
    "react-dom/client": {
      sourcePath: path.resolve(
        rootPath,
        "node_modules/react-dom/cjs/react-dom.development.js"
      ),
      targetPath: path.resolve(tempDevDir, "react-dom.js"),
    },
    scheduler: {
      sourcePath: path.resolve(
        rootPath,
        "node_modules/scheduler/cjs/scheduler.development.js"
      ),
      targetPath: path.resolve(tempDevDir, "scheduler.js"),
    },
  };

  Object.keys(mapping).forEach((key) => {
    const { sourcePath, targetPath } = mapping[key];
    transformCjsToEsm(sourcePath, targetPath);
  });

  /**
   * 将 CommonJS 转换成 ES Module，部分三方库没有提供 ES Module 版本，比如React
   * @param {*} sourcePath
   * @param {*} targetPath
   */
  function transformCjsToEsm(sourcePath, targetPath) {
    const content = fs.readFileSync(sourcePath, "utf-8");
    const babel = require("@babel/core");

    // 转换CommonJS代码为esm
    const transformedCode = babel.transform(content, {
      plugins: ["transform-commonjs"],
    }).code;

    // 路径重写，将 require('react') 转换成 require('/@modules/react')
    // TODO: 两段代码合并
    const pathRewritedCode = babel.transform(transformedCode, {
      plugins: [customAliasPlugin],
    }).code;

    fs.writeFileSync(targetPath, pathRewritedCode);
  }
}
```

添加之后查看网络请求，可以看到已经成功请求到了 react.js 和 react-dom.js

看到控制台有报错，原因是在 App.js 中没有引入 React

![](../../cloudimg/2024/mini-vite-react-auto-import-in-comp.png)

## React 自动引入

熟悉 React 的朋友都知道，在 React17 之前， 我们在使用 React 的时候，需要手动引入 React，原因是 JSX 语法会被转换成 React.createElement。

```js
import React from "react";
function App() {
  return <div>hello world1</div>;
}
```

但是在 React17 之后，我们不需要手动引入 React 了，因为 React 会自动注入到全局中，所以我们需要在 App.js 中添加 React 的引入

## 参考

- [vite-plugin-react](https://github.com/vitejs/vite-plugin-react)
