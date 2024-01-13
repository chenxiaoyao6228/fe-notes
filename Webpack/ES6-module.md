## 前言

本文总结下 ESM(ES6 Module) 的相关知识点

## ESM 的基本语法

模块功能主要由两个命令构成：export 和 import。export 命令用于规定模块的对外接口，import 命令用于输入其他模块提供的功能。

### export 命令

```js
// 在模块中定义变量
const myVariable = 42;

// 导出变量
export { myVariable };

// -------------------------

// 在模块中定义函数
export function myFunction() {
  // 函数逻辑
}

// 在模块中定义类
export class MyClass {
  // 类逻辑
}

// -------------------------
// 导出模块的默认值
const defaultValue = "Default Value";
export default defaultValue;
```

### import 命令

```js
// 导入默认导出的值
import defaultValue from "./myModule";

// 导入模块中的所有导出
import * as myModule from "./myModule";

// 导入并重命名
import { myVariable as aliasVariable } from "./myModule";

// 导入并忽略未使用的导入项
import { usedItem } from "./myModule";
```

### import() 函数

`import()` 函数的出现主要是为了解决 ECMAScript 模块（ESM）中的动态导入需求，以及支持异步加载模块的场景。在传统的静态 import 语句中，模块路径必须是静态的字符串，这在某些情况下限制了灵活性。`import()` 函数通过允许动态传入模块路径，提供了更灵活的异步加载模块的方式。

```js
if (conditionIsTrue) {
  import("./myModule.js")
    .then((module) => {
      // 使用导入的模块
    })
    .catch((error) => {
      // 处理加载失败的情况
    });
}
```

## 浏览器加载 ESM 的过程

### sccript 加载

当浏览器解析到 `<script>` 标签时，会立即下载并执行脚本，阻塞页面的解析和渲染，直到脚本执行完毕.

比如下面一段代码

```html
<script>
  window.env = {
    version: "production",
  };
</script>
```

上面的代码的处理顺序如下:

> 1. 浏览器解析到 script 标签时，会暂停 DOM 的解析
> 2. 加载并执行 script 中的代码
> 3. 执行完毕后，触发 script 的 load 事件
> 4. 继续 DOM 的解析

为了解决这个问题，浏览器允许脚本异步加载:

- async: 当`<script>` 标签带有 async 属性时，脚本的下载和页面的解析是异步进行的。这意味着浏览器会继续解析和渲染页面，而不等待脚本的加载和执行。脚本加载完成后立即执行，可能会中断页面解析。
- defer: 类似于 async，但有一个关键区别。带有 defer 属性的脚本会在页面解析完毕后按照顺序执行，而不会中断解析过程。多个带有 defer 属性的脚本会按照它们在页面中的顺序依次执行。(**一个使用场景是二级页面需要依赖一个很大的 js 库，且该页面有很大概率被打开，这种情况下可以 deferj 插在**)

### `<script type="module">`

在 ES6 之后，浏览器原生支持了模块化，可以使用`<script type="module">`标签来加载模块。

还是之前的例子

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ESM加载展示</title>
    <script type="module" src="./scripts/my-script.js"></script>
  </head>
  <body></body>
</html>
```

```js
// 注意import要加对应的.js后缀
import libA from "./lib-a.js";

function logMsg() {
  var a = libA.foo; // "foo"
  alert(a + "-" + libA.bar);
}

var button = document.createElement("button");
button.innerHTML = "Click me and look at the console!";
button.onclick = logMsg;
document.body.appendChild(button);
```

具体代码在[这里](./_demo/esm/browser-load/)

页面加载顺序如下:

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/esm-script-loading.png)

这里有几个需要注意的点：

- import 要加对应的.js 后缀
- 目前只能加载 js 模块，因此正常的 web 项目还是需要打包的

下面看看浏览器在解析`<script type="module" src="./scripts/my-script.js"></script>`这行代码的时候做了什么

- 发起网络请求：浏览器会根据 src 属性的值（"./scripts/my-script.js"）发起网络请求，请求指定的 JavaScript 文件。

- 异步加载文件：`<script type="module">` 标签默认是异步加载的，因此浏览器会继续解析 HTML 和执行后续的代码，而不等待 JavaScript 文件的加载和执行。

- 下载 JavaScript 文件：浏览器下载指定的 JavaScript 文件。这个文件应该是一个 ECMAScript 模块，因为 type="module" 属性指示这是一个模块脚本。

- 解析模块：浏览器对下载的 JavaScript 文件进行词法和语法分析，生成抽象语法树（Abstract Syntax Tree，AST）。

- 模块依赖解析：如果模块中存在 import 语句，浏览器会解析这些语句，识别模块之间的依赖关系。

- 并行加载依赖：浏览器并行地开始加载模块的依赖关系，这些依赖可能是其他模块或资源文件。这是异步加载模块的体现，可以提高性能。

- 执行模块代码：一旦所有依赖关系加载完成，浏览器开始执行模块的代码。模块中的代码会按照语法规则执行，包括变量声明、函数定义等。

- 完成加载：当模块代码执行完毕，浏览器完成了对这个模块的加载和执行过程。如果有其他模块有依赖关系，浏览器可能会继续加载这些依赖的模块。

## NodeJS 中的 ESM 处理

Node.js 利用 V8 引擎的支持，实现了对 ECMAScript 模块的解析和执行。V8 负责词法和语法分析，模块导入和导出的处理，以及模块代码的执行。Node.js 提供了一些额外的机制和标志来支持 ESM 的特性。

在 Node.js 中，ESM 文件的扩展名通常是 .mjs，以区分 CommonJS 文件（通常使用 .js 扩展名）。Node.js 13.2.0 版本及更新版本支持 ESM，但需要使用 .mjs 扩展名。

`--experimental-modules 标志`

在 Node.js 中启用 ESM 需要使用 --experimental-modules 标志，

还是之前的例子

```
├── lib-a-dep.mjs
├── lib-a.mjs
└── my-script.mjs
```

执行

> node --experimental-modules my-script.mjs

输出结果如下：

> foo-bar

具体代码在[这里](./_demo/esm/node-mjs/)

或者在 package.json 中的 "type" 字段中设置为 "module"：

```json
{
  "type": "module"
}
```

这样 nodejs 就会默认将模块当成 esm 来处理了，不需要加 --experimental-modules 标志， 也不需要加 .mjs 后缀

## ES6 模块与 CommonJS 模块的差异

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
- CommonJS 模块的 require()是同步加载模块，ES6 模块的 import 命令是异步加载，有一个独立的模块依赖的解析阶段。

## 模块 harmony

### CommonJS 模块加载 ES6 模块

### ES6 模块加载 CommonJS 模块

### 如何同时支持

## package.json 中模块相关的字段详解
