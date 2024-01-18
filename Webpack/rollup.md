### @rollup/plugin-commonjs 的实现原理？

@rollup/plugin-commonjs 插件的实现原理是将 ES2015 模块化的代码转换成 CommonJS，以便于 Rollup 进行打包处理。它主要做两件事情：

1.扫描代码中的 import 和 require 语句，找出它们所引用模块的位置和名称，以便能将其正确转换成 CommonJS 格式；

2.将 ES2015 模块的导入语句转换成 CommonJS 的 require 语句，实现模块化的引入和导出。

与 Babel 不同，@rollup/plugin-commonjs 仅仅做模块的格式转换，并不会进行代码的编译和转换。Babel 则相对复杂，它可以将 ES2015、TypeScript、JSX 等代码转换成浏览器可识别的代码，同时也可以将最新的 ECMAScript 版本转换成 ES5 版本。两者的作用并不重合。
