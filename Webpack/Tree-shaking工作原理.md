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

现在开启下 production 模式

```js
module.exports = {
  entry: "./src/index.js",
  devtool: false,
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "production",
};
```

看看打包出来的文件, 可以看到，minus 函数相关的内容已经被删除了。

```js
(() => {
  "use strict";
  document.body.appendChild(
    (function () {
      const e = document.createElement("button");
      return (
        (e.innerHTML = "Hello webpack"),
        e.addEventListener("click", () => {
          console.log(Number(Math.random().toFixed(1)) + 2);
        }),
        e
      );
    })()
  );
})();
```

### sideEffects

sideEffects 字段用于向 Webpack 提供有关模块副作用的提示。它可以是文件通配符或特定文件路径的数组。如果一个模块在 sideEffects 数组中列出，Webpack 会假定该模块具有副作用，因此在 tree shaking 过程中不会将其消除。

## Webpack tree-shaking 工作原理

### 代码静态分析，标注代码使用情况

通过搜索 webpack 源码，包含 harmony export 的部分，发现对 used export 和 unused export 的标注具体实现：

```js
//  lib/dependencies/HarmoneyExportInitFragment.js

class HarmonyExportInitFragment extends InitFragment {
  /**
   * @param {string} exportsArgument the exports identifier
   * @param {Map<string, string>} exportMap mapping from used name to exposed variable name
   * @param {Set<string>} unusedExports list of unused export names
   */
  constructor(
    exportsArgument,
    exportMap = EMPTY_MAP,
    unusedExports = EMPTY_SET
  ) {
    super(undefined, InitFragment.STAGE_HARMONY_EXPORTS, 1, "harmony-exports");
    this.exportsArgument = exportsArgument;
    this.exportMap = exportMap;
    this.unusedExports = unusedExports;
  }

  merge(other) {
    let exportMap;
    if (this.exportMap.size === 0) {
      exportMap = other.exportMap;
    } else if (other.exportMap.size === 0) {
      exportMap = this.exportMap;
    } else {
      exportMap = new Map(other.exportMap);
      for (const [key, value] of this.exportMap) {
        if (!exportMap.has(key)) exportMap.set(key, value);
      }
    }
    let unusedExports;
    if (this.unusedExports.size === 0) {
      unusedExports = other.unusedExports;
    } else if (other.unusedExports.size === 0) {
      unusedExports = this.unusedExports;
    } else {
      unusedExports = new Set(other.unusedExports);
      for (const value of this.unusedExports) {
        unusedExports.add(value);
      }
    }
    return new HarmonyExportInitFragment(
      this.exportsArgument,
      exportMap,
      unusedExports
    );
  }

  /**
   * @param {GenerateContext} generateContext context for generate
   * @returns {string|Source} the source code that will be included as initialization code
   */
  getContent({ runtimeTemplate, runtimeRequirements }) {
    runtimeRequirements.add(RuntimeGlobals.exports);
    runtimeRequirements.add(RuntimeGlobals.definePropertyGetters);

    const unusedPart =
      this.unusedExports.size > 1
        ? `/* unused harmony exports ${joinIterableWithComma(
            this.unusedExports
          )} */\n`
        : this.unusedExports.size > 0
        ? `/* unused harmony export ${
            this.unusedExports.values().next().value
          } */\n`
        : "";
    const definitions = [];
    for (const [key, value] of this.exportMap) {
      definitions.push(
        `\n/* harmony export */   ${JSON.stringify(
          key
        )}: ${runtimeTemplate.returningFunction(value)}`
      );
    }
    const definePart =
      this.exportMap.size > 0
        ? `/* harmony export */ ${RuntimeGlobals.definePropertyGetters}(${
            this.exportsArgument
          }, {${definitions.join(",")}\n/* harmony export */ });\n`
        : "";
    return `${definePart}${unusedPart}`;
  }
}
```

### 添加 harmoney export

getContent 处理 exportMap，对原来的 export 进行 replace

```js
const definePart =
  this.exportMap.size > 0
    ? `/* harmony export */ ${RuntimeGlobals.definePropertyGetters}(${
        this.exportsArgument
      }, {${definitions.join(",")}\n/* harmony export */ });\n`
    : "";
return `${definePart}${unusedPart}`;
```

### 处理 unExportMap

getContent 处理 unExportMap，对原来的 export 进行 replace

```js
const unusedPart =
  this.unusedExports.size > 1
    ? `/* unused harmony exports ${joinIterableWithComma(
        this.unusedExports
      )} */\n`
    : this.unusedExports.size > 0
    ? `/* unused harmony export ${
        this.unusedExports.values().next().value
      } */\n`
    : "";
```

### replace 替换

声明 used 和 unused，调用 harmoneyExportInitFragment 进行 replace 掉源码里的 export。

```js
// lib/dependencies/HarmonyExportSpecifierDependency.js

HarmonyExportSpecifierDependency.Template = class HarmonyExportSpecifierDependencyTemplate extends (
  NullDependency.Template
) {
  /**
   * @param {Dependency} dependency the dependency for which the template should be applied
   * @param {ReplaceSource} source the current replace source which can be modified
   * @param {DependencyTemplateContext} templateContext the context object
   * @returns {void}
   */
  apply(
    dependency,
    source,
    { module, moduleGraph, initFragments, runtimeRequirements, runtime }
  ) {
    const dep = /** @type {HarmonyExportSpecifierDependency} */ (dependency);
    const used = moduleGraph
      .getExportsInfo(module)
      .getUsedName(dep.name, runtime);
    if (!used) {
      const set = new Set();
      set.add(dep.name || "namespace");
      initFragments.push(
        new HarmonyExportInitFragment(module.exportsArgument, undefined, set)
      );
      return;
    }

    const map = new Map();
    map.set(used, `/* binding */ ${dep.id}`);
    initFragments.push(
      new HarmonyExportInitFragment(module.exportsArgument, map, undefined)
    );
  }
};
```

### getExports

传入 moduleGraph 获取所有 export 的 name 值

```js
// lib/dependencies/HarmonyExportSpecifierDependency.js
    /**
     * Returns the exported names
     * @param {ModuleGraph} moduleGraph module graph
     * @returns {ExportsSpec | undefined} export names
     */
    getExports(moduleGraph) {
        return {
            exports: [this.name],
            terminalBinding: true,
            dependencies: undefined
        };
    }
```

### 建立 moduleGraph

lib/ModuleGraph.js (该处代码量过多，不作展示)

```js
class ModuleGraph {
    constructor() {
        /** @type {Map<Dependency, ModuleGraphDependency>} */
        this._dependencyMap = new Map();
        /** @type {Map<Module, ModuleGraphModule>} */
        this._moduleMap = new Map();
        /** @type {Map<Module, Set<ModuleGraphConnection>>} */
        this._originMap = new Map();
        /** @type {Map<any, Object>} */
        this._metaMap = new Map();

        // Caching
        this._cacheModuleGraphModuleKey1 = undefined;
        this._cacheModuleGraphModuleValue1 = undefined;
        this._cacheModuleGraphModuleKey2 = undefined;
        this._cacheModuleGraphModuleValue2 = undefined;
        this._cacheModuleGraphDependencyKey = undefined;
        this._cacheModuleGraphDependencyValue = undefined;
    }
// ...
```

在不同的处理阶段调用对应的 ModuleGraph 里面的 function 做代码静态分析，构建 moduleGraph 为 export 和 import 标注等等操作做准备。

### Compilation

lib/Compilation.js （部分代码） 在 编译阶段 中将分析所得 的 module 入栈到 ModuleGraph。

```js
    /**
     * @param {Chunk} chunk target chunk
     * @param {RuntimeModule} module runtime module
     * @returns {void}
     */
    addRuntimeModule(chunk, module) {
        // Deprecated ModuleGraph association
        ModuleGraph.setModuleGraphForModule(module, this.moduleGraph);

        // add it to the list
        this.modules.add(module);
        this._modules.set(module.identifier(), module);

        // connect to the chunk graph
        this.chunkGraph.connectChunkAndModule(chunk, module);
        this.chunkGraph.connectChunkAndRuntimeModule(chunk, module);

        // attach runtime module
        module.attach(this, chunk);

        // Setup internals
        const exportsInfo = this.moduleGraph.getExportsInfo(module);
        exportsInfo.setHasProvideInfo();
        if (typeof chunk.runtime === "string") {
            exportsInfo.setUsedForSideEffectsOnly(chunk.runtime);
        } else if (chunk.runtime === undefined) {
            exportsInfo.setUsedForSideEffectsOnly(undefined);
        } else {
            for (const runtime of chunk.runtime) {
                exportsInfo.setUsedForSideEffectsOnly(runtime);
            }
        }
        this.chunkGraph.addModuleRuntimeRequirements(
            module,
            chunk.runtime,
            new Set([RuntimeGlobals.requireScope])
        );

        // runtime modules don't need ids
        this.chunkGraph.setModuleId(module, "");

        // Call hook
        this.hooks.runtimeModule.call(module, chunk);
    }
```

## 总结分析

- webpack 在编译阶段将发现的 modules 放入 ModuleGraph
- HarmoneyExportSpecifierDependency 和 HarmoneyImportSpecifierDependency 识别 import 和 export 的 module
- HarmoneyExportSpecifierDependency 识别 used export 和 unused export
- used 和 unused
  - 把 used export 的 export 替换为 ` / *harmony export ([type])* /`
  - 把 unused export 的 export 替换为 ` / *unused harmony export [FuncName]* /`

# 总结

1.  使用 ES6 模块语法编写代码，这样 tree shaking 才能生效
2.  工具类函数尽量单独输出，不要集中成一个对象或类，避免打包对象和类为使用的部分

## 参考

- https://webpack.js.org/guides/tree-shaking/
