## CommonJS 与 Node.js

CommonJS 是以在浏览器环境之外构建 JavaScript 生态系统为目标而产生的项目，比如在服务器和桌面环境中。

采用同步加载模块的方式，也就是说只有加载完成，才能执行后面的操作。CommonJS 代表：Node 应用中的模块，通俗的说就是你用 npm 安装的模块。

它使用 require 引用和加载模块，exports 定义和导出模块，module 标识模块。使用 require 时需要去读取并执行该文件，然后返回 exports 导出的内容。

## Browserify
