---
title: "实现angular手记[零]项目初始化"
date: 2019-07-11
categories:
  - tech
tags:
  - angular
permalink: 2019-07-11-build-your-own-angular-0-project-setup
---

## 一.前言

### 这本书是不是过时了

诚然, 在这个半年就出新东西的前端领域来说,AngularJS 已经过时了,毕竟 Angular 已经升级到了 Angular8

但是我们的目的不是要学习 AngularJS, 对于有 Vue 或者 React 开发经验的人来说, 快速上手 AngularJS 并不是很难的事情.

引用 Reddit 上一位[答主的话](https://www.reddit.com/r/angularjs/comments/cxlf09/how_relevant_is_the_book_build_your_own_angularjs/eyozfzf?utm_source=share&utm_medium=web2x&context=3)

> Don't go with it to learn AngularJS. Do it to learn Javascript, debugging, handling complexity and TDD.

毕竟很多思想都是共通的.

其中一位作者的演讲视频，实现了一个简单的依赖注入框架 di.js

<https://www.youtube.com/watch?v=3ju-32Bcx1Q&ab_channel=ScotlandJS>

**学习一个东西的比较好的方式是造一个初级版的轮子**，深以为然。

### 学完本书可以获得哪些技能

- 深入理解 AngularJS 中,比如双向数据绑定，组件化方案，可以对比 Vue,React 的后起之秀
- 深入理解 JS，this 指向，原型链继承, 正则表达式，闭包。。。
- 学习写一个 parser, 对于没有系统学习过编译原理的同学(比如我)很有帮助
- 实现一个依赖注入框架
- 实现一个完整的 promise
- 实现一个类 axios 的 http 请求库
- angularJS 内部使用了 jQuery(JQLite)
- 实现 hashTable, 对 tree 和 recursion 理解更加深刻
- 了解设计模式在大型框架中的运用，比如发布订阅，单例，装饰器，组合模式等，而不是浮于表面
- 学习 tdd，如何将需求转化为测试用例？怎样写出易于测试的代码？

完成本书之后,你还可以:

- 将项目升级为升级为 Typescript
- 学习重构, 替换 Lodash, Jquery, 同时保证功能的正常运行
- 加入 Virtual DOM
- 研究 API 设计
- 研究开源项目的管理,如版本管理
- ...

当然,这不是一本轻易就能够掌握的书籍, 需要时间来认真消化

### 给自己的目标

为了不让这本书浪费掉，尝试探索更好榨取知识的方式

#### 第一遍：基本

手把手敲，忽略测试编写，熟悉基本的原理，结合《JavaScript 框架设计》了解其中的模块设计

#### 第二遍： TDD 与重构

深入研究 TDD，学习重构技巧，参考《重构》《编写可阅读代码的艺术》《单元测试之道》等书目, 对现有代码进行重构

#### 第三遍：造一个 MVVM

阅读 Vue 源码，希望自己能写出自己的一个简易的 MVVM 框架，作为自己学习成果的检验。

## 二.参考资料

本书实现的是 1.x 的版本, 在后续实现 ng-repeat, ng-model 的时候可以参考官方实现

### 官方

[AngularJS-1.0.x 源码](https://github.com/angular/angular.js/tree/v1.0.x)

### 书目

1. JavaScript 正则小书
2. Javascript 框架设计 2
3. 重构-改善既有代码的设计 2

## 三.配置

### 基础配置

- 代码格式化: eslint + prettier + vscode
- 测试: jest + puppeteer + sinon
- es6+ 语法: babel 编译, 去掉旧项目中的一些依赖如 Lodash
- debug: vscode 的 jest 插件，方便

配置参考在这 👉 个[仓库](https://github.com/chenxiaoyao6228/js-jest-eslint-husky-starter.git)下, 有需要可以去看看

完整配置

.barbelrc

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false
      }
    ]
  ],
  "plugins": [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-transform-destructuring",
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ],
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread"
  ]
}
```

.eslintrc.js

```js
module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 8,
    sourceType: "module",
  },
  plugins: ["babel", "prettier", "jest"],
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:jest/recommended",
    "plugin:you-dont-need-lodash-underscore/compatible",
  ],
  env: {
    es6: true,
    browser: true,
    commonjs: true,
  },
  globals: {
    process: true,
    describe: true,
    test: true,
    __dirname: true,
    expect: true,
    jest: true,
    filter: false,
    register: false,
  },
  rules: {
    "prettier/prettier": "error",
    "no-var": "error",
    "no-unused-vars": "off",
    "prefer-arrow-callback": ["error", { allowNamedFunctions: true }],
  },
};
```

.prettierrc

```js
{
  "singleQuote": true
}
```

.prettierignore

```js
package - lock.json.next;
node_modules;
```

### 调试配置

之所以要单独拿出来，是因为好的调试工具可以大大减小时间损耗与心智损耗

1. 安装 vscose-jest

2. 配置.vscode/launch.json

```
{
    "version": "0.2.0",
    "configurations": [
      {
        "name": "Debug Jest Tests",
        "type": "node",
        "request": "launch",
        "runtimeArgs": [
          "--inspect-brk",
          "${workspaceRoot}/node_modules/.bin/jest",
          "--runInBand"
        ],
        "console": "integratedTerminal",
        "internalConsoleOptions": "neverOpen",
        "port": 9229
      }
    ]
  }
```

3. 在需要的地方打上 debugger, 按 F5 即可开启调试
