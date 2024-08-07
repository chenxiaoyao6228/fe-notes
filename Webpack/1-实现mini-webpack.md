---
title: "实现一个简单的打包器mini-webpack"
date: "2023-12-12"
summary: "本文详细介绍了如何实现一个简单的打包器mini-webpack，包括需求分析、代码实现、AssetsMap的生成与esm支持等步骤，帮助读者理解打包器的基本原理和实现方法。"
tags: ["前端", "打包器", "JavaScript", "webpack"]
draft: false
authors: ["default"]
---

## 前言

本文总结如何实现一个简单的打包器 mini-webpack

> 本节对应的 demo 可以在[这里](https://github.com/chenxiaoyao6228/fe-notes/tree/main/Webpack/_demo/mini-webpack)找到。

## 需求分析

假设我们有一个 index.js 文件，内容如下：

```js
const { add } = rquire("./add.js");
console.log(add(1, 2));
```

对应的 add.js 文件内容如下：

```js
function add(a, b) {
  return a + b;
}

module.exports = {
  add,
};
```

我们需要将这两个文件打包成一个文件，可以在 index.html 中引入并在浏览器运行，该如何做到呢?

## 代码实现

一种简单的实现方式是，将 index.js 和 add.js 文件内容拼接成一个字符串。

```js
// src/index.js
const { add } = rquire("./add.js");
console.log(add(1, 2));

// src/add.js
function add(a, b) {
  return a + b;
}

module.exports = {
  add,
};
```

但是这样会存在一些问题:

- 浏览器中并不支持 require 语法
- 原先文件天然对变量进行了隔离，合并成一个文件后变量没有隔离，容易造成命名冲突

因此我们可以考虑在外面加一层自执行函数，将 require 语法转换成浏览器支持的语法，同时将变量隔离起来。

```js
// src/index.js
function Index(require, module, exports) {
  const { add } = rquire("./add.js");
  console.log(add(1, 2));
}

function Add(require, module, exports) {
  // src/add.js
  function add(a, b) {
    return a + b;
  }

  module.exports = {
    add,
  };
}

// 定义require函数
function rquire(filePath) {
  // ...
}
```

接下来要解决的问题是：

- require 函数如何实现
- 入口文件如何执行

require 函数如哪里查找文件呢？显然代码打包了之后，我们不能像在 nodejs 环境中通过文件路径去查找文件了，因此必须要用字符串保存原来的代码

同时我们需要定义一个 map，将文件路径和文件内容对应起来，这样就可以根据文件路径找到文件内容了。

```js
var assetsMap = {
  "src/index.js": {
    path: "src/index.js", // 文件路径
    code: `const { add } = require("src/add.js"); console.log(add(1, 2));`,
  },
  "src/add.js": {
    path: "src/add.js", // 文件路径
    code: `function add(a, b) {return a + b;}  exports.add = add;`,
  },
};
```

回到我们的 require 函数

```js
var assetsMap = {
  "src/index.js": {
    path: "src/index.js", // 文件路径
    code: `const { add } = require("src/add.js"); console.log(add(1, 2));`,
  },
  "src/add.js": {
    path: "src/add.js", // 文件路径
    code: `function add(a, b) {return a + b;}  exports.add = add;`,
  },
};

function require(filePath) {
  // 1. 从 map 中找到对应的文件内容
  var file = assetsMap[filePath];

  // 2. 定义一个函数，用于解析文件内容
  function localRequire(relativePath) {
    // 2.1 根据模块路径在 map 中找到对应的模块
    return require(relativePath);
  }

  // 3. 定义一个对象，用于存储文件执行结果
  var exports = {};
  var module = { exports };

  // 4. 执行文件内容, 为了让文件内容能够执行，我们需要将代码转换成函数
  // 执行完成之后，exports对象中就有了保存到了对应的结果
  var code = `
            (function(require, module, exports) {
            ${eval(file.code)}
            })(localRequire, module, exports)
        `;
  // 5. 返回文件执行结果, 这样被引用的文件就可以拿到对应的结果了
  return exports;
}

require("src/index.js");
```

> ps: 觉得绕的朋友可以去新建一个 index.html 文件，将上面的代码复制进去，然后在浏览器中打开，打开控制台，然后在代码中加入 debugger，然后一步一步的执行，就可以看到整个执行过程了。

### AssetsMap 的生成与 esm 支持

接下来的问题是，我们该如何生成 assetsMap 呢？ 显然我们需要根据入口文件去生成，因为入口文件中会引用其他文件，我们需要将入口文件和入口文件引用的文件都加入到 assetsMap 中。

这里我可以借助 `acorn`或者`@babel/parser` 来解析代码，然后再根据解析出来的结果去生成 assetsMap。(webpack 内部依赖的是 acorn)

```js
function parseImports(code) {
  const imports = [];
  const ast = acorn.parse(code, { sourceType: "module" });

  acorn.walk.simple(ast, {
    ImportDeclaration(node) {
      imports.push(node.source.value);
    },
  });

  return imports;
}
```

## 完整实现

```js
const fs = require("fs");
const path = require("path");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const { transformFromAstSync } = require("@babel/core");

function miniWebpack(config) {
  const { entry, output } = config;

  // 获取文件名，读取文件内容，解析文件内容，获取依赖关系，转换代码
  let ID = 0;
  function createAsset(filename) {
    const content = fs.readFileSync(filename, "utf-8");

    const ast = parse(content, {
      sourceType: "module",
    });

    const dependences = [];

    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        dependences.push(node.source.value);
      },
    });

    console.log(dependences);
    const id = ID++;

    const { code } = transformFromAstSync(ast, null, {
      presets: ["@babel/preset-env"],
    });

    return {
      id,
      filename,
      dependences,
      code,
    };
  }

  function createGraph(entry) {
    const mainAsset = createAsset(entry);
    const queue = [mainAsset];

    for (const asset of queue) {
      const dirname = path.dirname(asset.filename);

      asset.mapping = {};

      asset.dependences.forEach((relativePath) => {
        const absolutePath = path.join(dirname, relativePath);

        const child = createAsset(absolutePath);

        asset.mapping[relativePath] = child.id;

        queue.push(child);
      });
    }

    console.log("queue", queue);

    return queue;
  }

  function bundle(graph) {
    let modules = "";

    graph.forEach((mod) => {
      modules += `${mod.id}: [
      function(require, module, exports) { ${mod.code} },
      ${JSON.stringify(mod.mapping)}
    ],`;
    });

    const result = `
    (function(modules){
      function require(id) {
        const [fn, mapping] = modules[id];

        function locateRequire(relativePath) {
          return require(mapping[relativePath]);
        }

        const module = { exports: {} };
        fn(locateRequire, module, module.exports);
        return module.exports;
      }
      require(0);
    })({${modules}})
  `;

    return result;
  }

  // 生成依赖图
  const graph = createGraph(entry);
  // 生成代码
  const result = bundle(graph);
  // 写入文件
  fs.writeFileSync(output, result);
}

miniWebpack({
  entry: "./src/index.js",
  output: "./dist/bundle.js",
});
```

> 本文首发于个人 Github[前端开发笔记](https://github.com/chenxiaoyao6228/fe-notes)，由于笔者能力有限，文章难免有疏漏之处，欢迎指正
