## 前言

本文总结了一些关于 Vite 的工作原理，以及一些实现细节。

> 本节对应的 demo 在\_demo/mini-vite 目录下

## 什么是 Vite

Vite 是一个基于浏览器原生 ES imports 的开发服务器。利用浏览器去解析 imports，在服务器端按需编译返回，完全跳过了打包这个概念，服务器随起随用。

## 实现步骤

- 项目搭建
- 实现 cli
- 起静态服务器
- nodemon 监听文件修改，执行 vite 命令
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

在 src 目录下新建 server.js

```js
// src/server.js
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

![](../../cloudimg/2023/mini-vite-static-server.png)
