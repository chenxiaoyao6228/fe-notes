## 前言

本节主要介绍这些插件的基本原理并手写一些常用的 Loader。

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

## Loader 的工作原理和执行顺序

Loader 的工作原理基于管道（pipeline）的概念。当 Webpack 加载一个模块时，它会按照从**右到左**的顺序链式调用一系列的 Loader，每个 Loader 对模块进行一些处理。每个 Loader 都会将处理后的模块传递给下一个 Loader，最终生成最终的代码。

执行顺序示例：

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

上述配置中，当处理以.js 结尾的模块时，Webpack 会先使用 loader1，然后是 loader2，最后是 loader3。这个顺序是从右到左执行的，loader3 先对模块进行处理，然后传递给 loader2，最终传递给 loader1。

### enforce

在 Webpack 中，还可以使用 enforce 属性来改变 Loader 的执行顺序。enforce 属性有两个可选的值："pre" 和 "post"，用于指定 Loader 的执行顺序是在普通 Loader 之前还是之后。

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["loader3", "loader2", "loader1"],
        enforce: "pre", // 将 loader1 设置为预处理 Loader
      },
    ],
  },
};
```

以下三种情况可以考虑使用 enforce 属性：

- 语法检查（linting）： 在构建前对代码进行语法检查，提前发现和修复潜在的代码质量问题。

- 性能优化： 在主要编译完成后，对代码进行性能优化或其他复杂操作，确保优化不影响主要编译的速度。

- Polyfill 添加： 在构建过程中，提前为目标环境添加必要的 Polyfill，以确保代码在目标环境中正常运行。

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

> npm install less

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

## 最终效果

![](../../cloudimg/2023/mini-webpack-loader.png)
