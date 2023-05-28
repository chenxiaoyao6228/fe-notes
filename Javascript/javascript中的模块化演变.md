---
date: 2023-05-24
permalink:  modular-in-javascript
title: javascript中的模块化演变
categories: 
  - tech
tags:
  - javascript
---
## 前言

在工作中时常会遇到打包相关的问题，其中涉及到JS模块化相关的知识， 就想着整合一下作为记录，本文会尝试回答以下问题：
* 模块化
* IIFE, CJS(CommonJS), AMD, UMD, CMD, ESM的介绍
* 模块规范背后的实现(commonJS, 参考深入浅出nodejs)
* angularJS中的模块化实现
* 模块混用(如esm中import UMD, UMD import ESM)
* package.json中的module字段
* 构建工具相关的配置，以webpack和rollup举例
* 如何替node_module里面的三方库打包
* 业务中涉及到模块化问题的踩坑

## 模块化

由于代码之间会发生大量交互，如果结构不合理，这些代码就会变得逐渐变为一坨大家都不愿意维护的“屎山”， 总的来说，模块化的好处如下：

* 更好的代码组织：模块化编程使得代码可以按照其功能进行划分，并进行适当的分层，使得代码更加清晰易懂，便于维护和扩展。

* 提高代码重用性：通过模块化编程，相同的功能代码可以在多个地方重复使用，避免了代码的重复编写，提高了代码的重用性，也减少了代码量，使得代码更加简洁。

* 更有效的代码维护：模块化编程可以使得代码各个模块分别管理，如果需要维护某个模块，就只需要修复那个模块的代码，而不会影响其他模块的代码，从而提高了代码的可维护性。

* 更容易的协作：模块化编程允许多个开发人员并行开发，不同的模块可以由不同的开发人员开发，从而提高了协作效率和开发速度。

* 更容易的调试：由于代码已经按照模块化进行划分，因此可以根据需要单独调试每个模块的代码，并且可以避免在一个大的代码库中发生命名冲突等问题，从而提高了调试效率。


## 闭包与IIFE

闭包是指能够访问自由变量的函数。自由变量是在函数中使用，但既不是函数参数也不是函数的局部变量的变量。由于函数中的代码可以访问自由变量，因此即使返回函数执行完毕，自由变量的引用仍保留在内存中，这就是闭包。闭包在JS中有着广泛的应用，例如实现私有变量和函数、实现高阶函数等。

IIFE代表立即调用的函数表达式，在JavaScript代码中，它是一种常用的模式，用于创建一个独立的作用域，其中变量不会泄漏到全局作用域中，并且可以封装私有变量和函数，以防止它们被外部代码访问和更改，从而提高代码的可维护性和安全性。

```js
var counter = (function() {
  var count = 0; // 私有变量

  function increment() {
    count++; // 增加计数器
  }

  function getCount() {
    return count; // 返回计数器的值
  }

  return {
    increment: increment, // 将增加计数器的方法暴露给外部
    getCount: getCount // 将获取计数器值的方法暴露给外部
  };
})();

counter.increment(); // 调用增加计数器的方法
console.log(counter.getCount()); // 获取计数器的值并输出

```
以上代码中，我们使用一个IIFE创建了一个counter对象，其中包含了一个私有变量count和两个公共接口increment和getCount，这些接口可以被外部代码使用。由于count是一个私有变量，因此无法直接访问和更改它，只能通过暴露给外部的方法来进行操作。这种封装能力可以有效地保护变量和函数不被外部访问和更改。

## CJS(CommonJS)


## UMD


### webpack配置 UMD

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




## ESM


## 业务踩坑

## 参考
* https://github.com/umdjs/umd/
* https://dev.to/iggredible/what-the-heck-are-cjs-amd-umd-and-esm-ikm
* https://mp.weixin.qq.com/s/PzdDE6EVpfEPZKjbOEr73w