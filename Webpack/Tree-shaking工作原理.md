## 前言

Tree Shaking 是一种用于优化 JavaScript 代码的技术，旨在消除未使用的代码，减小最终打包文件的大小, 从而提升网页的加载速度。

## ES6 模块的静态性质

在 ES6 模块中，模块的结构（包括导出和导入的内容）是在代码的编译阶段确定的，而不是在运行时, 且在编写 ES6 模块时，import 和 export 语句必须位于模块的顶层，而不能出现在条件语句、循环或函数内部。

这使得编译器可以在这个阶段静态地分析模块之间的依赖关系，并进一步优化代码。

比如下面的代码中，minus 函数永远不会被调用，因此编译器可以在编译阶段就删除这个函数。

```js
// math.js

export function sum(a, b) {
  return a + b;
}

export function minus(a, b) {
  return a - b;
}

// index.js

import { sum } from "./math";
console.log(sum(1, 2));
```

## Webpack 配置 tree-shaking

webpack 默认在生产模式下会开启 tree-shaking，但是在开发模式下不会开启，因此需要手动配置。

```js
// webpack.config.js
module.exports = {
  entry: "./src/index.js",
  devtool: "source-map",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  // 开发环境配置tree-shaking
  mode: "development",
  optimization: {
    usedExports: true,
  },
};
```

> ps: 代码在\_demo/\_webpack/tree-shaking

可以看到打包出来的 math.js 模块中，minus 函数已经被标记了`/* unused harmony export minus */`。

```js
var __webpack_modules__ = {
  /***/ "./src/math.js": /***/ (
    __unused_webpack_module,
    __webpack_exports__,
    __webpack_require__
  ) => {
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
      /* harmony export */ sum: () => /* binding */ sum,
      /* harmony export */
    });
    /* unused harmony export minus */
    function sum(a, b) {
      return a + b;
    }

    function minus(a, b) {
      return a - b;
    }
  },
};
```

### sideEffects

## 参考

- https://webpack.js.org/guides/tree-shaking/
