## 前言

本文会尝试回答以下问题：

- js 模块化的发展历程
  - IIFE + namespace
  - CJS(CommonJS)
    - package.json 中各种乱七八糟的字段: main, module, exports, browser
    - nodejs 是如何查找模块的
  - CMD(requireJS)
  - AMD(seaJS)
  - UMD
    - webpack 的实现也受到 umd 的启发
  - ESM
  - 模块混用
    - (如 esm 中 import UMD, UMD import ESM, ESM import umd) => 模块加载器会自己去查找，但是写法要注意
    - nodejs 查找
    - webpack 中的查找
    - 浏览器的 esm 查找
- 三方构建工具相关(webpack, rollup, vite)
  - webpack
    - webpack 中和模块有关的字段: resolve, module
    - webpack 中的模块查找
    - webpack，rollup 等打包工具是如何支持多种模块规范的，模块是如何加载的 => 内置自己的模块解析工具
    - webpack 中的 require.resolve
    - 如何打包一个 react 应用作为 npm package => webpack umd 格式
    - 如何替 node_module 里面的三方库打包 => 通过配置 loader 的正则，对 node_module 里面的文件 include/exclude
  - rollup
    - 插件机制
  - Vite
    - 浏览器支持 esm, 但是还是不支持 vue 语法

CJS(CommonJS), AMD, UMD, ESM

### webpack 配置 UMD

要配置 Webpack 以同时导出 ECMAScript 模块（ESM）、CommonJ 和 UMD（通用模块定义）格式，请使用 output.library 和 output.libraryTarget 选项与 externals 选项结合使用。

```js
const path = require("path");

module.exports = {
  mode: "production", // 或 'development' 用于开发模式
  entry: "./path/to/your/module.js", // 替换为你的模块的入口文件路径
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    library: {
      type: "umd",
      name: "YourLibraryName",
    },
    environment: {
      arrowFunction: false,
      const: false,
    },
  },
  module: {
    rules: [
      // 添加任何必要的规则来处理你的模块代码（例如，使用Babel进行转译）
    ],
  },
  externals: {
    // 指定不应包含在捆绑包中的任何外部依赖项
    // 示例：'lodash': 'lodash' 将'moment'标记为外部依赖项
  },
};
```

其中：

- 将 library 选项设置为一个包含 type: 'umd'和 name: 'YourLibraryName'的对象。这将确保输出的捆绑包与 UMD 格式兼容。
- 使用 environment 选项来禁用某些可能与特定环境不兼容的功能。在示例中，禁用了箭头函数和 const 声明，以确保更广泛的兼容性。
- 在 module 部分中配置任何必要的规则，以处理模块代码的转译或处理（例如，使用 Babel）。
- 使用 externals 选项来指定不应包含在捆绑包中的任何外部依赖项。这些依赖项应该在使用者的环境中可用。例如，如果你的模块依赖于'lodash'，可以添加'lodash': 'lodash'以将其标记为外部依赖项。

完成 Webpack 的配置后，运行构建命令：

```sh
npx webpack --config webpack.config.js
```

Webpack 将在指定的输出路径（示例配置中的./dist/bundle.js）生成捆绑包，其中包括 UMD 格式的模块以及 ESM 和 CJS 格式的必要导出。

模块的使用者可以根据其环境选择适当的格式。例如，在 ESM 环境中：

```js
import YourLibraryName from "your-library";
```

在 CommonJS 环境中：

```js
const YourLibraryName = require("your-library");
```

以及在兼容 UMD 的环境中：

```js
const YourLibraryName = window.YourLibraryName;
```

## CJS(CommonJS)

具体的模块定义已经在前言中，故不再赘述。下面来看下对 commonJS 的规范实现

### Nodejs 中的 commonJS 支持

### angularJS 中的模块化规范

```js
angular.module("myApp", ["ngRoute"]);
```

感兴趣的朋友可以看看 《build-your-own-angular-cp10》

### webpack 中的 commonJS 支持

## ESM

### 规范

### webpack 中对 esm 语法支持

以上打包后的 add 模块代码中依然还是 ES6 语法，在低端的浏览器中不支持。这是因为没有对应的 loader 去解析 js 代码，webpack 把所有的资源都视作模块，不同的资源使用不同的 loader 进行转换。

### 模块混用

```js
const lib = require("lib ").default;
```

这是因为在支持 ECMAScript Modules 规范的环境中（如 Node.js 8.5.0 及以上版本），我们可以使用 import 和 export 进行模块导入和导出。而在 CommonJS 规范下，我们则是使用 require 和 module.exports。由于两种规范导入和导出的方式不同，因此在使用不同模块化方式编写的模块进行混用时，就需要进行转换。

对于使用 ECMAScript Modules 编写的模块，我们可以使用 Babel 将 import 和 export 转换成 CommonJS 规范下的 require 和 module.exports。这样在使用该模块的环境中，就可以像使用 CommonJS 模块一样通过 require 进行导入。

而 const lib = require('lib').default 的代码则是通过 babel-plugin-transform-es2015-modules-commonjs 插件将使用 import 进行导入的模块转换成 CommonJS 模块。在使用该模块的环境中，就可以使用 require 进行导入并获取其 default 导出值。

以下是一个使用 Babel 进行转换的示例代码：

```js
// 使用 ECMAScript Modules 方式编写的模块
// ./src/module.js
export default function add(a, b) {
  return a + b;
}

// 使用 CommonJS 规范进行导出
// ./lib/module.js
("use strict");

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;

function add(a, b) {
  return a + b;
}

var _default = add;
exports.default = _default;

// 使用 CommonJS 规范进行导入
// ./index.js
const add = require("./lib/module").default;

console.log(add(1, 2));
```

如果你的 webpack 项目使用的是 Babel 7 及以上版本的话，那么 babel-plugin-transform-es2015-modules-commonjs 插件是不需要的。因为在 Babel 7 中，它对应用 CommonJS 规范导出模块的方式进行了内建的支持。你只需要配置 Babel 的 preset-env，并将 modules 选项设置为"commonjs"，就可以使 Babel 自动地将使用 ES 模块语法编写的模块转换成 CommonJS 模块。以下是一个示例代码：

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/env", { modules: "commonjs" }]],
          },
        },
      },
    ],
  },
  // ...
};
```

这样，就可以像使用 CommonJS 模块一样，使用 require 来导入使用 ES 模块语法编写的模块了。以下是一个示例代码：

```js
// index.js
const add = require("./src/module").default;

console.log(add(1, 2));
```

### 为什么有了 webpack 还需要 babel 进行模块转化？

Q: webpack 内部不是有 enhanced-resolver 作为模块加载器吗？

A: 虽然 webpack 提供了一个模块加载器 enhanced-resolver，但是它针对的是模块解析和查找的问题，而不能直接解决模块转化的问题。所以为了能够将使用 ES2015 Modules 语法编写的模块转换成 CommonJS 模块，我们还需要使用 Babel 工具进行转换。Babel 的 preset-env 插件配合 modules: 'commonjs' 选项可以自动将 ES Modules 转换为 CommonJS 模块的语法，从而可以在 Node.js 中运行。

### rollup 如何做解析？

如果您使用 Rollup，转换 ES2015 模块到 CommonJS 的方法也非常简单。可以使用 @rollup/plugin-commonjs 插件来实现。以下是一个使用 Rollup 和 @rollup/plugin-commonjs 的配置示例：

```js
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.js",
  plugins: [nodeResolve(), commonjs()],
  output: {
    file: "dist/bundle.js",
    format: "cjs",
  },
};
```

commonjs() 函数处理 ES2015 模块并将其转换为 CommonJS 格式，以便进行打包。

### @rollup/plugin-commonjs 的实现原理？

@rollup/plugin-commonjs 插件的实现原理是将 ES2015 模块化的代码转换成 CommonJS，以便于 Rollup 进行打包处理。它主要做两件事情：

1.扫描代码中的 import 和 require 语句，找出它们所引用模块的位置和名称，以便能将其正确转换成 CommonJS 格式；

2.将 ES2015 模块的导入语句转换成 CommonJS 的 require 语句，实现模块化的引入和导出。

与 Babel 不同，@rollup/plugin-commonjs 仅仅做模块的格式转换，并不会进行代码的编译和转换。Babel 则相对复杂，它可以将 ES2015、TypeScript、JSX 等代码转换成浏览器可识别的代码，同时也可以将最新的 ECMAScript 版本转换成 ES5 版本。两者的作用并不重合。

### package.json 中的 main 字段

在 package.json 文件中，main 字段用于指定 CommonJS 规范下的入口文件位置，该文件是该软件包的主要代码文件。通常情况下，该文件应该位于包的根目录，且文件名为 index.js。如果你的软件包按照 CommonJS 或 Node.js 的规范进行编写，在使用该软件包时，main 文件会被自动加载和执行。但是，在支持 ECMAScript Modules（简称 ESM）规范的环境中（如 Node.js 8.5.0 及以上版本），import 语句将会优先使用 package.json 文件中的 module 字段来指定入口文件。如果在 package.json 文件中同时定义了 main 和 module，那么，这两个字段都会被使用。

### package.json 中的 module

在 package.json 文件中，module 字段用于指定 ES modules 规范下的入口文件位置，即用于在支持 ES modules 的浏览器或 Node.js 版本中使用的代码文件。这个字段是在支持 ECMAScript Modules 的 Node.js 8.5.0 版本中首次引入的。

通常情况下，如果你的库或组件同时支持 CommonJS 和 ES modules 规范，你可以在 package.json 文件中同时定义 module 和 main 字段，以便在不同的环境中被正确地导入和使用。例如：

```json
{
  "main": "lib/index.js",
  "module": "esm/index.js"
  // ...
}
```

在这个例子中，lib/index.js 是用于 CommonJS 规范的入口文件路径，而 esm/index.js 则是用于 ES modules 规范的入口文件路径。当用户使用支持 ES modules 规范的环境时，例如使用了 Webpack 2 或以上版本的浏览器，会自动地从 module 字段定义的路径中导入代码；否则，会从 main 字段定义的路径中导入。

总之，module 字段为 JavaScript 库和组件的开发者提供了一种更加规范和灵活的方式来管理不同规范下的入口文件位置和导入方式。

### package.json 中的 exports

```json
"exports": {
    ".": {
      "react-server": "./react.shared-subset.js",
      "default": "./index.js"
    },
    "./package.json": "./package.json",
    "./jsx-runtime": "./jsx-runtime.js",
    "./jsx-dev-runtime": "./jsx-dev-runtime.js"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/facebook/react.git",
    "directory": "packages/react"
  },
```

在 package.json 文件中，export 字段用于定义 ES modules 和 CommonJS 模块的入口文件。这个字段是在支持 ECMAScript Modules 的 Node.js 12.16.0 版本中添加的。

在 export 字段中，可以指定多个入口文件，每个入口文件都对应着一个模块名称。这些模块名称可以在导入时使用，例如：

```js
import { default as myModule } from "my-library";
```

```js
{
  "exports": {
    "./path/to/module.js": "./path/to/module.js",
    "./path/to/another.js": {
      "import": "./path/to/another.js",
      "require": "./path/to/another.cjs"
    },
    "./path/to/third.js": {
      "import": "./path/to/third.js",
      "require": false
    }
  }
}
```

在这个示例中，我们可以看到有三个入口文件，它们各自对应一个模块名称。其中第二个入口文件支持同时导出 CommonJS 和 ES modules 格式。

总之，export 字段可以让我们更加灵活地定义我们的模块入口，这对于构建可重用的 JavaScript 库和组件非常有用。

### package.json 中的 browser 字段

### package.json 中的 umd:main 字段

### webpack 是如何支持多种文件格式打包的

webpack 根据 webpack.config.js 中的入口文件，在入口文件里识别模块依赖，不管这里的模块依赖是用 CommonJS 写的，还是 ES6 Module 规范写的，webpack 会自动进行分析，并通过转换、编译代码，打包成最终的文件。最终文件中的模块实现是基于 webpack 自己实现的 webpack_require（es5 代码），所以打包后的文件可以跑在浏览器上。
同时以上意味着在 webapck 环境下，你可以只使用 ES6 模块语法书写代码（通常我们都是这么做的），也可以使用 CommonJS 模块语法，甚至可以两者混合使用。因为从 webpack2 开始，内置了对 ES6、CommonJS、AMD 模块化语句的支持，webpack 会对各种模块进行语法分析，并做转换编译。

webpack 将这部分解析的操作封装成了`enhanced-resolver`这个包

### webpack 中的 require.resolve 是如何工作的

在 Webpack 中，require.resolve 函数是通过 Node.js 的模块解析机制来查找模块的。它接受一个模块名作为参数，并返回解析后的模块路径。具体解析过程如下：

获取模块名称，从当前目录开始，递归查找 node_modules 文件夹，直到找到模块或者全部查找完毕。

如果在当前目录的 node_modules 中找到了模块，则直接返回该模块的路径。

如果在当前目录的 node_modules 中没有找到模块，则继续向上递归查找父级目录的 node_modules 文件夹，直到找到模块或者已经到达根目录。

如果在任一级 node_modules 中都没有找到模块，则在全局模块路径下查找该模块。

如果还是没有找到模块，则抛出错误。

在 Webpack 中，require.resolve 可以在 webpack 配置文件中使用，比如可以使用 require.resolve 来获取某个模块的绝对路径，然后在配置中使用该路径。例如：

const path = require('path');

module.exports = { entry: path.resolve(**dirname, 'src/index.js'), output: { path: path.resolve(**dirname, 'dist'), filename: 'bundle.js' } };

在上面的示例中，path.resolve 用来找到 src/index.js 的绝对路径，然后在 entry 中使用该路径。

### webpack 中的 dynamic import 的原理

### 作为一个库的作者，该导出什么格式？

作为一个库的作者，你应该同时导出 CommonJS 和 ES6 模块。对于 CommonJS 模块，可以使用 module.exports，对于 ES6 模块，可以使用 export 或 export default。这样，将可以在 Node.js 和浏览器中使用你的库。同时，在 package.json 中使用 main 字段指定 CommonJS 模块的入口，使用 module 字段指定 ES6 模块的入口。如果你的库支持 UMD，可以额外使用 browser 字段指定浏览器端的入口。一个示例的 package.json 文件可以如下所示：

```js
{
  "name": "my-module",
  "main": "lib/index.js",
  "module": "esm/index.js",
  "browser": "dist/my-module.js"
}
```

### 如何导出一个 React 项目作为 npm 包

```js
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: "umd",
    umdNamedDefine: true,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-proposal-class-properties"],
          },
        },
      },
    ],
  },
  externals: {
    react: "react",
    "react-dom": "react-dom",
  },
  plugins: [new webpack.optimize.ModuleConcatenationPlugin()],
};
```

### 一个 Vue 项目如何做打包导出

webpack.config.js

```js
const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "my-library.js",
    library: "MyLibrary",
    libraryTarget: "umd",
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
};
```

rollup.config.js

```js
import vue from "rollup-plugin-vue";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/my-library.js",
      format: "umd",
      name: "MyLibrary",
      exports: "named",
      sourcemap: true,
      globals: {
        vue: "Vue",
      },
    },
    {
      file: "dist/my-library.esm.js",
      format: "esm",
      exports: "named",
      sourcemap: true,
    },
  ],
  plugins: [
    vue(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
    terser(),
  ],
  external: ["vue"],
};
```

对应的 package.json

```jsonc
{
  "name": "my-vue-library",
  "version": "1.0.0",
  "description": "My Vue component library",
  "main": "dist/my-library.js",
  "module": "dist/my-library.esm.js",
  "files": ["dist", "src", "README.md"],
  "peerDependencies": {
    "vue": "^2.6.12"
  }
  // ... 其他配置 ...
}
```

### webpack strictExportPresence 参数

### webpack 中的 require.context

```js
function loadLocalesInDev() {
  function loadLocalesInDevHelper(context) {
    const localesMap = {};
    context.keys().forEach((key) => {
      const lang = key.match(/\.\/([a-zA-Z-]+)\.json$/)[1];
      localesMap[lang] = context(key);
    });
    return localesMap;
  }
  const context = require.context("../locales/", false, /\.json$/);
  const localMapOfLocaleData = loadLocalesInDevHelper(context);
  return localMapOfLocaleData;
}
```
