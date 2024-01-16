## 前言

本文总结 package.json 中与模块化相关的，包括：

- `main`
- `browser`
- `module`
- `jsnext:main`
- `exports`

## main

之前文章提到过，npm 包的发布是基于 CommonJS 规范的， 我们在发布 npm 包时默认会包括 package.json，license，README 和 main 字段里指定的文件。忽略 node_modules，lockfile 等文件。

main 字段用于指定一个模块的入口文件。这个字段告诉 Node.js 模块系统在引入一个包时应该从哪个文件开始执行。

```json
{
  "main": "dist/index.js"
}
```

Webpack 等打包工具 会根据 main 字段的值，将其作为入口文件进行打包。

## browser

但是我们发布的包可能会被用于浏览器环境，里面可能依赖了浏览器特有的功能或 API， 单纯一个 main 无法满足我们的需求， 这时候就需要用到 browser 字段了。

```json
{
  "main": "dist/index.js",
  "browser": "dist/index.browser.js"
}
```

## type

在 nodeJS 支持 esm 之后，如果在 commonJS 中混用 esm，我们需要将文件后缀改为 .mjs， 当然，如果你想在想在项目里面全面启用 esm, 那就需要在 package.json 中指定 type 字段。

```jsonc
{
  "type": "module" //  “commonjs”
}
```

此时，如果项目中依然有 commonJS 的代码，那么就需要将文件后缀改为 .cjs。

## module

module 字段允许包作者明确指定在使用 ES module 时应该加载的文件。如果没有指定 module 字段，那么在使用 ES module 时，会默认使用 main 字段指定的文件。

```json
{
  "module": "dist/module.esm.js"
}
```

Webpack 在构建项目时，默认的 target 是 'web'，即用于构建在浏览器环境中运行的代码， 在这种情况下，如果一个包中同时存在 browser, module 和 main 字段, 那么解析的优先级分别是: browser > module > main, 具体可以看[官方文档-resolvemainfields](https://webpack.js.org/configuration/resolve/#resolvemainfields)

## jsnext:main

一个过时的字段，最初用于指定在使用 ES module 时的入口文件。它在过去用于支持通过 ES module 导入的模块，已经不再推荐使用。

## exports

exports 字段是在 Node.js 14 及更新版本中引入的，用于定义模块的导出方式。它提供了一种更灵活和强大的方法来指定模块的导出方式，可以定义多个入口文件和条件导出。

exports 字段的优先级高于 main、module 字段，如果同时存在，exports 字段的配置将生效。

```jsonc
{
  "exports": {
    ".": {
      "import": "./src/index.js", // 支持esm
      "require": "./lib/main.js" // 支持commonJS
    },
    "./helpers": "./src/helpers.js",
    "./utils": {
      "require": "./lib/utils.js"
    }
  }
}
```

在这个例子中，.（点）子字段指定了默认的导出方式，根据导入方式选择不同的文件。同时，还为特定的路径 ./helpers 和 ./utils 指定了导出方式。
