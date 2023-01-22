---
title: prettier-eslint-vscode-实现前端代码格式化
categories:
  - tech
tags:
  - javascript
date: 2020-04-06
permalink: 2020-04-06-prettier-eslint-vscode-for-code-formatting
---

## 前言

随着前端开发工程化的日渐成熟, eslint, prettier 等工具已成为前端代码规范化的必备工具, 本文主要记录两者的基本概念以及相应的配置, 方便后续回顾的时候可以直接参考 🎸

- ESLint // ide lint 报错/warning 要靠它
- Prettier - Code formatter // 格式化 html/css/less/scss etc…
- Vetur // 这里只用来语法提示，代码格式化交给 eslint（npm）

首先要明确的是, eslint, prettier 都是基于 node 开发的工具, 可以直接在命令行中进行使用, 比如使用 eslint 格式化 src 文件夹下的所有文件

```js
eslint src/**
```

但是每次写完都要调用这些命令是很麻烦的事情,我们希望的是在编写代码的过程中每次进行保存时候或者提交之前能够对代码进行格式化. 总体而言有三种思路

1. 编辑器(如 vscode) + eslint/prettier + eslint/prettier 的编辑器扩展(eslint-vscode)，每次修改代码保存后编辑器会自动调用 eslint/prettier 工具，这种依赖每个人安装自己的编辑器插件并且进行配置
2. webpack + eslint/prettier + eslint/prettier-loader: webpack 代替编辑器调用 eslint 工具, 好处是如果团队内成员的编辑器没有安装相应的集成插件也可以实现实时格式化.
3. lint-staged + script 脚本： 编辑的时候不会进行代码格式化，但是在提交的时候会格式化一遍

三者同时使用会有更好的效果. 但无论哪种方法, 底层调用 eslint/prettier 命令行的时候都是通过读取工具的配置文件进行处理的,

## 一. eslint

https://cn.eslint.org/docs/user-guide/getting-started

### 安装

```js
// 局部安装使用
yarn add eslint -D // 安装到项目中

./node_modules/.bin/eslint --init // 生成配置文件

./node_modules/.bin/eslint src/** // 命令行使用

// 全局安装使用

yarn global add eslint

eslint --init

eslint
```

### 配置文件

eslint 的配置文件有很多选项, 下面重点介绍 rules, extends, plugin

#### rules 和 extends

eslint 中所有的规则默认都是禁用的。可通过 rules 和 extends 进行开启
**rules**
rules 定义了 eslint 的规则

```js
"rules": {
    "indent": ["error", 4],
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
}
```

**extends**

可共享配置，也就是一些常用的推荐的 rules 集合, 使用 "extends": "eslint:recommended" 来启用推荐的规则.

[eslint-config-standard](https://www.npmjs.com/package/eslint-config-standard): standard 的 config 配置

[ eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier): 用来关闭 eslint 中所有和代码无关的格式化规则

👉 更多请看这个[awesome-list](https://github.com/dustinspecker/awesome-eslint)

**extends 的写法**
extend 的来源有三种, eslint 的官方配置, 单独的配置包, 安装的插件的配置(有些插件会将配置单独发包)

对于`eslint-config-xx`开头的单独包, 写的时候可以直接忽略,写成`xxx`

```js
  "extends": [
    "eslint:recommended", // eslint内置的标准配置
    "standard", // eslint-config-standard
    "plugin:vue/recommended" // eslint-plugin-vue的配置
  ],
```

#### plugin

**插件的命名**
在配置文件里配置插件时，可以使用`plugins`关键字来存放插件名字的列表。插件使用`eslint-plugin-<plugin-name>`的形式进行命名, 也可以省略`eslint-plugin-`前缀。

```js
{
    "plugins": [
        "plugin1",
        "eslint-plugin-plugin2"
    ]
}
```

**插件配置**
在写插件的时候, 允许导出**多个**相应的 rules 配置

```js
module.exports = {
    configs: {
        myConfig: {
            plugins: ["myPlugin"],
            env: ["browser"],
            rules: {
                semi: "error",
                "myPlugin/my-rule": "error",
                "eslint-plugin-myPlugin/another-rule": "error"
            }
        },
        myOtherConfig: {
            plugins: ["myPlugin"],
            env: ["node"],
            rules: {
                "myPlugin/my-rule": "off",
                "eslint-plugin-myPlugin/another-rule": "off"
                "eslint-plugin-myPlugin/yet-another-rule": "error"
            }
        }
    }
};

```

👉 假设上面的插件名为 eslint-plugin-myPlugin, 那么对应的 myConfig 和 myOtherConfig 在 eslint 中的配置应该为`"plugin:myPlugin/myConfig"`和`"plugin:myPlugin/myOtherConfig"`, 了解了这个就知道上面的`eslint-plugin-vue`等插件的 rules 为什么这么写了.

有些插件会将自己的配置单独发包, 如`eslint-config-prettier`(eslint-plugin-prettier 的配置), 有些则不会, 如`eslint-plugin-jest`

```js
{
  "extends:{
     "plugin:vue/recommended", // eslint-config-vue(eslint-plugin-vue的rules配置)
      "plugin:prettier/recommended", // eslint-config-prettier(eslint-plugin-prettier的配置)
      "plugin:jest/recommended", // eslint-plugin-jest
      "prettier/vue",
  }
}
```

常见的插件:

- [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)
- [eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest)
- [eslint-plugin-vue](https://www.npmjs.com/package/eslint-plugin-vue)
- [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)

👉[关于插件如何工作的更多说明](https://cn.eslint.org/docs/developer-guide/working-with-plugins)

### eslint 集成 webpack

安装`eslint-loader`

```js
yarn add eslint-loader -D
```

更改配置

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        enforce: 'pre', // 确保eslint-loader跑在babel-loader前面
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
```

### eslint 集成 vscode

1. 全局安装`eslint`(给 vscode 使用), 并且在项目中安装`eslint`, 然后在你的项目中创建`eslintrc`文件,

```js
yarn global add eslint && yarn add eslint -D && ./node_modules/.bin/eslint --init
```

当然你也可以使用`eslint --init`为你所有的项目搞一个 eslint 配置放在全局, 然后通过制定 vscode 使用特定的文件, 但对于多人协作的项目而言, 还是写在项目里稳妥.

2. 在 vscode 中`extension`项(command+shift+p)搜索`eslint`并安装
3. 更改 vscode 的配置: 在项目中创建`.vscode/setting.json`文件,

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }
}
```

[👉 更多配置请见 vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## 二. prettier

⚠ **看自己的需要是否需要 prettier, 因为两者存在功能重叠, 会出现规则冲突的情况**

在使用的时候需要考虑两点：

1. 代码无关的规则使用 prettier: 如是使用 tab 还是 space, 2 个还是 4 个

2. 代码相关的规则使用 eslint: 比如不允许使用 var, 不能显式指定全局变量等

### 安装使用

```js
yarn add eslint eslint-config-prettier eslint-plugin-prettier prettier -D
```

其中

1. eslint-config-prettier 用来关闭和 eslint 冲突的选项, [👉 更多请看](https://github.com/prettier/eslint-config-prettier)

2. prettier-eslint 与 prettier-eslint-cli: 运行`prettier`之后, 运行`eslint --fix`, [👉 更多请看](https://github.com/prettier/prettier-eslint-cli)

修改.eslintrc

```js
{
  "extends": ["plugin:vue/essential", "plugin:prettier/recommended"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}

```

```js
{
  "scripts": {
      "format": "prettier --write src/**/*.js && eslint --fix  src/**/*.js",
  }
}

```

### 生成配置文件

prettier 并不提供[自动生成.prettierrc 的命令](https://github.com/prettier/prettier-vscode/issues/4), 因此需要手动创建

部分参考选项

```js
{
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true
}

```

完整的 prettier 配置规则请看附录一

### prettier 集成 vscode 使用

在 vscode 中安装`eslint`, `prettier`, 然后在.vscode/setting.json`中开启下列选项

```js
{
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }
}
```

同时设置默认的 codeFormatter 为 prettier, (ctrl + shift + P 👉format document with 👉 set default formatter 👉 prettier)

### prettier 集成 webpack

### Prettier-eslint 集成 git

```js
yarn add --dev prettier pretty-quick husky
```

package.json

```json
{
  "scripts"{
      "lint": "pretty-quick --staged && eslint --ext .js,.vue src --fix",
  },
  "husky": {
    "hooks": {
      "pre-commit": "yarn lint"
    }
  }
}
```

## 三.附录

### 附录一: prettier + eslint 的完整配置

下面只针对纯 js 文件的配置, 如果需要其他, 请另外搜索, 最好使用 vue/cli, create-react-app 等脚手架工具, 避免重复劳作

安装包

```js
yarn add eslint eslint-config-prettier eslint-plugin-prettier prettier pretty-quick husky -D && yarn global add eslint prettier
```

.eslintrc

```js
{
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": ["eslint:recommended", "plugin:prettier/recommended"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
    // "no-console": ["error", { "allow": ["warn"] }]
  }
}

```

.prettierrc

```js
{
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true
}
```

vscode: 安装 prettier, eslint 插件

配置.vscode/setting.json

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }
}
```

### 附录二: prettier 规则列表

```json
{
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true
}
```

### 附录三: eslint 规则列表
