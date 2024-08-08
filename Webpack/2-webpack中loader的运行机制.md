---
title: "深入理解 Webpack Loader 的工作原理和实现"
date: "2024-01-06"
tags: ["Webpack", "Bundler", "Loader"]
summary: "本文详细探讨了 Webpack 中 Loader 的基本原理和实现细节。内容包括 Loader 的定义、常见类型及其作用，Loader 与 Plugin 的区别，Loader 的输入和输出方式，如何编写同步和异步 Loader，以及 Loader 的执行顺序。"
draft: false
authors: ["default"]
---

## 前言

本节主要介绍这些插件的基本原理并手写一些常用的 Loader。

> 本节对应的 demo 可以在[这里](https://github.com/chenxiaoyao6228/fe-notes/tree/main/Webpack/_demo/mini-webpack-loaders)找到。

## 什么是 Loader

在 Webpack 中，Loader 是用于对模块的源代码进行转换的工具。Webpack 将一切视为模块，而这些模块可能是各种类型的文件，如 JavaScript、CSS、图片等。Loader 负责处理这些文件，将它们转换成 Webpack 可以处理的模块。

常用的 Loader 有：

| Loader                 | 作用                                                |
| ---------------------- | --------------------------------------------------- |
| `babel-loader`         | 将现代 JavaScript 转译为较旧版本                    |
| `style-loader`         | 将样式注入到 DOM 中                                 |
| `css-loader`           | 在 JavaScript/TypeScript 中解析和导入 CSS 文件      |
| `file-loader`          | 将文件复制到输出目录                                |
| `url-loader`           | 类似于 `file-loader`，但可以将小文件转换为 Data URL |
| `sass-loader`          | 将 SASS/SCSS 文件加载并编译为 CSS                   |
| `less-loader`          | 将 LESS 文件加载并编译为 CSS                        |
| `ts-loader`            | 将 TypeScript 转译为 JavaScript                     |
| `postcss-loader`       | 使用 PostCSS 插件处理 CSS                           |
| `eslint-loader`        | 在 JavaScript/TypeScript 文件上运行 ESLint          |
| `vue-loader`           | 加载和编译 Vue.js 组件                              |
| `raw-loader`           | 将文件内容作为字符串加载                            |
| `image-webpack-loader` | 优化和压缩图像文件                                  |

完整的列表可以参考 [Webpack 官方文档](https://webpack.js.org/loaders/)。

### Loader 与 Plugin 的区别

|            | 作用                                                                       | 工作方式                                                                          | 示例                                                                         |
| ---------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Loader** | 用于处理模块文件，将它们转换成可以被添加到依赖图中的有效 JavaScript 代码。 | 沿着文件的加载链应用，按照规定的顺序一个接一个地处理模块文件。                    | Babel Loader 用于将 ECMAScript 2015+ 代码转换为向后兼容的 JavaScript 版本。  |
| **Plugin** | 用于执行更广泛范围的任务，例如打包优化、资源管理、注入环境变量等。         | 通过钩子机制与 Webpack 构建过程的不同阶段交互，允许你在构建流程中执行自定义操作。 | HtmlWebpackPlugin 用于生成 HTML 文件，并自动将打包后的脚本文件引入 HTML 中。 |

简而言之，Loader 处理模块文件的转换，而 Plugin 用于执行各种构建过程的自定义任务。Loader 是一个文件级别的处理器，而 Plugin 更关注整个构建流程。在配置文件中，我们会配置一系列 Loader 来处理特定类型的文件，而 Plugin 通常是一个实例，通过 plugins 数组添加到配置中。

## Loader 的输入和输出

默认情况下，资源文件会被转化为 UTF-8 字符串，然后传给 loader。通过设置 raw 为 true，loader 可以接收原始的 Buffer。

```js
// loader.js
module.exports = function (content) {
  // 对输入源进行处理，这里简单地在源代码前面添加一行注释
  const processedSource = `// This is a custom loader\n${source}`;

  // 返回处理后的结果
  return processedSource;
};

module.exports.raw = true;
```

loader 的输出内容必须是 String 或 Buffer 类型。

## 同步 Loader 和异步 Loader

### 同步 Loader

同步 loader 是最常见的 loader 类型。它们按照 webpack 的默认处理流程，依次处理每个模块。每个同步 loader 都会在一个模块的代码被转换之后，再将结果传递给下一个 loader。这种 loader 的编写和配置非常简单。

### 异步 Loader

异步 loader 具有更灵活的处理方式，它们可以在处理一个模块时进行一些异步操作，例如从网络请求数据，然后在异步操作完成后继续处理模块。

为了创建异步 loader，需要使用 this.async() 方法。这个方法返回一个回调函数，当异步操作完成时，你需要手动调用这个回调函数，将处理结果传递给下一个 loader。

以下是一个简单的异步 loader 的例子，假设它通过网络请求获取模块内容：

```js
// async-loader.js
module.exports = function (source) {
  // 获取 loader 上下文，this 对象
  const callback = this.async();

  // 模拟一个异步操作（例如，从网络请求数据）
  setTimeout(() => {
    const simulatedData = { message: "这是模拟的异步数据" };
    const transformedSource = source.replace(
      "/* async-data-placeholder */",
      JSON.stringify(simulatedData)
    );

    // 调用回调函数，将处理后的源代码传递给下一个 loader
    callback(null, transformedSource);
  }, 1000); // 模拟异步操作耗时 1 秒钟
};
```

## Loader 的工作原理和执行顺序

在 Webpack Loader 的执行过程中，有两个重要的阶段， pitch 阶段和 normal 阶段。

假设我们有以下三个 Loader：Loader1、Loader2、Loader3，对应的配置如下:

```js
// webpack.config.js
module: {
  rules: [
    {
      test: /\.js$/,
      use: ['loader3', 'loader2', 'loader1'],
    },
  ],
}
```

对应的 webpack 执行阶段如下图

Pitch 阶段：

- 如果存在 pitch 方法：

  - 首先执行 loader3 的 pitch 方法。
  - 接着执行 loader2 的 pitch 方法。
  - 最后执行 loader1 的 pitch 方法。
    Normal 阶段：

- 如果存在 normal 方法：
  - 首先执行 loader1 的 normal 方法。
  - 接着执行 loader2 的 normal 方法。
  - 最后执行 loader3 的 normal 方法。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/webpack-loader-pitch.png)

#### enforce 属性的作用：

enforce: "pre" 属性将 loader1 设置为预处理 Loader，这意味着在正常的 Loader 执行前，会先执行 loader1 的 pitch 方法和 normal 方法。这用于在正式加载模块之前执行一些预处理操作，例如代码静态分析或代码风格检查。

#### Pitch 阶段的作用：

如果某个 Loader 的 pitch 方法返回了非 undefined、非 null 或非空字符串的结果，Webpack 将停止执行 Pitch 阶段，并从该 Loader 开始执行 Normal 阶段。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/webpack-loader-pitch2.png)

## Loader 的配置

在 Webpack 配置文件中，使用 module.rules 配置项来定义 Loader 的规则。每个规则是一个对象，包含两个主要属性：test 和 use。

- test: 用于匹配需要被 Loader 处理的文件类型的正则表达式。
- use: 用于指定应用哪些 Loader，可以是字符串或数组，按照从右到左的顺序执行。

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/, // 匹配以.js结尾的文件
        use: ["babel-loader"], // 使用babel-loader进行处理
        options: {
          presets: ["@babel/preset-env"],
        },
      },
      {
        test: /\.css$/, // 匹配以.css结尾的文件
        use: ["style-loader", "css-loader"], // 先用css-loader处理，然后再用style-loader
      },
    ],
  },
};
```

### loader 的三种引入方式

1. 直接在配置文件中使用 Loader 名称：

在 Webpack 配置文件中，可以直接使用 Loader 的名称，Webpack 会自动查找并使用这些 Loader。

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

2. 使用完整的模块路径：

也可以使用 Loader 的完整模块路径，这样可以确保使用的是项目中指定的 Loader 版本。

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [require.resolve("babel-loader")],
      },
      {
        test: /\.css$/,
        use: [require.resolve("style-loader"), require.resolve("css-loader")],
      },
    ],
  },
};
```

3. 通过 require 导入 Loader：

在配置文件中，你还可以使用 require 导入 Loader，并将其传递给 use 数组。

```js
// webpack.config.js
const babelLoader = require.resolve("babel-loader");
const styleLoader = require.resolve("style-loader");
const cssLoader = require.resolve("css-loader");

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [babelLoader],
      },
      {
        test: /\.css$/,
        use: [styleLoader, cssLoader],
      },
    ],
  },
};
```

## 常用的 Loader 实现

手写 loader 首先还是关注官方指南 [编写一个 Loader](https://webpack.js.org/contribute/writing-a-loader/)。

### 最简单的 loader

最简单的 loader 就是将源代码原封不动的返回，例如：

```js
module.exports = function (source) {
  return source;
};
```

### babel-loader

主要通过使用 @babel/parser 解析源代码，然后通过 @babel/traverse 遍历 AST（抽象语法树），最后使用 @babel/generator 重新生成代码。

首先安装依赖：

> npm install @babel/parser @babel/traverse @babel/generator

然后，创建一个简单的 Babel Loader 文件, 代码如下：

```js
const { transform } = require("@babel/core");

function loader(source) {
  // 获取 Loader 配置的选项
  const options = this.getOptions();

  console.log("babel-loader: ", options);

  // 使用 Babel 转换代码
  const transformedCode = transform(source, {
    ...options,
    sourceMap: true,
  }).code;

  return transformedCode;
}

module.exports = loader;
```

然后，在 Webpack 配置中使用这个手写的 Babel Loader：

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["./babel-loader"],
      },
    ],
  },
};
```

### less-loader

首先需要安装 less 包：

```bash
 npm install less
```

主要代码如下：

```js
const less = require("less");

module.exports = function (source) {
  // 使用 less 包解析 LESS 代码
  less.render(source, (error, result) => {
    if (error) {
      this.emitError(error); // 将错误传递给 Webpack 处理
      return;
    }

    // 返回转换后的 CSS 代码
    this.callback(null, result.css, result.map);
  });
};
```

### css-loader

css-loader 的作用主要是解析 css 文件中的@import 和 url 语句,处理 css-modules,并将结果作为一个 js 模块返回。

```js
module.exports = function (source) {
  console.log("css-loader source: ", source);

  const classRegex = /(?<=\.)(.*?)(?={)/g; // 获取字符串所有类名的正则
  const classKeyMap = Object.fromEntries(
    source.match(classRegex).map((str) => [str.trim(), str.trim()])
  ); // 取出字符串中原始 CSS 类名
  return `/**__CSS_SOURCE__${source}*//**__CSS_CLASSKEYMAP__${JSON.stringify(
    classKeyMap
  )}*/`;
};
```

### style-loader

经过 css-loader 的转译,我们已经得到了完整的 css 样式代码,style-loader 的作用就是将结果以 style 标签的方式插入 DOM 树中, 主要源码如下：

```js
module.exports = function (source) {
  console.log("style-loader", source);

  const cssSource = source.match(/(?<=__CSS_SOURCE__)((.|\s)*?)(?=\*\/)/g); // 获取 CSS 资源字符串
  const classKeyMap = source.match(
    /(?<=__CSS_CLASSKEYMAP__)((.|\s)*?)(?=\*\/)/g
  ); // 获取 CSS 类名 Map

  console.log("classKeyMap", classKeyMap);

  const script = `
    var style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(cssSource)};
    document.head.appendChild(style);
    
    // Export classKeyMap if available
    ${classKeyMap !== null ? `module.exports = ${classKeyMap}` : ""}
  `;

  return script;
};
```

### file-loader && url-loader

file-loader 和 url-loader 是 webpack 中的两个常用的 loader，它们都用于处理资源文件的加载和处理，但是它们有一些不同点。

file-loader 主要用于处理文件资源，将资源文件输出到指定的目录中，并返回一个资源文件的 url 地址，可以通过设置 outputPath 参数来指定资源文件的输出目录，也可以通过设置 publicPath 参数来指定资源文件的 url 地址的前缀，它会将资源文件复制到指定目录中，并且返回一个字符串路径，以便在代码中使用。

url-loader 和 file-loader 相比，它可以将较小的文件直接转换成 base64 编码格式的字符串，以减少网络请求，而不需要将文件加载到本地，可以通过 limit 参数来控制需要转换成 base64 格式的文件大小，可以通过 fallback 参数来设置在文件转换失败时使用的备用加载器。

先来看一下 file-loader 的实现：

```js
const loaderUtils = require("loader-utils");

function fileLoader(source) {
  // 使用 loader-utils 的 interpolateName 函数根据内容生成一个文件名
  const filename = loaderUtils.interpolateName(this, "[name].[hash].[ext]", {
    content: source,
  });

  // this.emitFile(filename, source): 用于将文件输出到输出目录。它接受文件名和文件内容作为参数。这确保文件包含在输出中，并可以被构建过程中的其他部分引用。
  this.emitFile(filename, source);

  return `module.exports="${filename}"`;
}

// 将 loader 的 raw 属性设置为 true，表示该 loader 处理二进制数据。在这里，这意味着文件内容被读取并作为 Buffer 输出。
fileLoader.raw = true;

module.exports = fileLoader;
```

再看看 url-loader 的实现：

```js
function urlLoader(source) {
  console.warn("url-loader: ", source.size);

  // 获取 loader 的 options（配置）
  const options = this.getOptions() || { limit: 20480 };

  // 如果文件大小小于指定的阈值，则转为 Data URL
  if (options.limit && source.length < options.limit) {
    const base64 = Buffer.from(source, "binary").toString("base64");
    return `module.exports="data:${
      this.resourceMimeType || "application/octet-stream"
    };base64,${base64}"`;
  }

  // 否则，使用file-loader处理
  return require("../file-loader").call(this, source);
}

urlLoader.raw = true;
module.exports = urlLoader;
```

对应的 webpack 配置

```js
{
  test: /\.(png|jpg)$/,
  use: [
    {
      loader: "./loaders/url-loader",
      options: {
        limit: 20480, // 小于 20kb 的图片转成 base64
      },
    },
  ],
}
```

最终效果如下：

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/mini-webpack-loader.png)

## 一些业务实践

1. 去除 antd 中的 selection

```js
// rm-selection-loader.js
// 去除样式文件中的 ::selection，原因是::selection难以被取消
module.exports = function runtime(params) {
  return params.replace(/::selection \{[^}]+\}/g, "");
};

// config.js
config.module
  .rule("less-in-node_modules")
  .use("custom")
  .before("css-loader")
  .loader(path.resolve(__dirname, "./rm-selection-loader.js"));
```

> 本文首发于个人 Github[前端开发笔记](https://github.com/chenxiaoyao6228/fe-notes)，由于笔者能力有限，文章难免有疏漏之处，欢迎指正
