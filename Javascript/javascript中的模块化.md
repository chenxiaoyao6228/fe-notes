---
date: 2023-05-24
permalink:  modular-in-javascript
title: javascript中的模块化
categories: 
  - tech
tags:
  - javascript
---

## 前言

在工作中时常会遇到打包相关的问题，其中涉及到JS模块化相关的知识， 就想着整合一下作为记录，本文会尝试回答问题。
* CommonJS, ESM, AMD, UMD,  IIFE的介绍
* 模块规范背后的实现
* 除了主流模块实现，是否还有其他的实现？
* 模块混用(如esm中import UMD, UMD import ESM)
* 构建工具相关的配置，以webpack和rollup举例
* 如何替node_module里面的三方库打包


## webpack配置 UMD

要配置Webpack以同时导出ECMAScript模块（ESM）、CommonJS（CJS）和UMD（通用模块定义）格式，请使用output.library和output.libraryTarget选项与externals选项结合使用。

```js
const path = require('path');

module.exports = {
  mode: 'production', // 或 'development' 用于开发模式
  entry: './path/to/your/module.js', // 替换为你的模块的入口文件路径
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: {
      type: 'umd',
      name: 'YourLibraryName',
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

* 将library选项设置为一个包含type: 'umd'和name: 'YourLibraryName'的对象。这将确保输出的捆绑包与UMD格式兼容。
* 使用environment选项来禁用某些可能与特定环境不兼容的功能。在示例中，禁用了箭头函数和const声明，以确保更广泛的兼容性。
* 在module部分中配置任何必要的规则，以处理模块代码的转译或处理（例如，使用Babel）。
* 使用externals选项来指定不应包含在捆绑包中的任何外部依赖项。这些依赖项应该在使用者的环境中可用。例如，如果你的模块依赖于'lodash'，可以添加'lodash': 'lodash'以将其标记为外部依赖项。

完成Webpack的配置后，运行构建命令：
```sh
npx webpack --config webpack.config.js
```

Webpack将在指定的输出路径（示例配置中的./dist/bundle.js）生成捆绑包，其中包括UMD格式的模块以及ESM和CJS格式的必要导出。

模块的使用者可以根据其环境选择适当的格式。例如，在ESM环境中：
```js
import YourLibraryName from 'your-library';
```
在CommonJS环境中：
```js
const YourLibraryName = require('your-library');
```

以及在兼容UMD的环境中：
```js
const YourLibraryName = window.YourLibraryName;
```



## 参考
* https://github.com/umdjs/umd/
* https://dev.to/iggredible/what-the-heck-are-cjs-amd-umd-and-esm-ikm