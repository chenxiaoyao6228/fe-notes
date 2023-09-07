## 通过 CDN 使用 React

在 Vue 中，自带了 rumtime compiler, 这使得我们可以很容易的通过新建 html 文件验证我们的想法

React 之中使用的 jsx, 且不自带运行时的编译器， 浏览器并不能直接识别， 在进行本地 demo 演示的时候会比较麻烦。

但是实际上也是可以通过 CDN 的方式来使用的.

[代码片段见这里](./_demo/react-with-cdn/index.html)

## 如何查看三方库的umd导出的变量名

直接打开三方库cdn链接，查看源码，一般都会有注释

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/thrid-party-lib-cdn-umd.png)

## 参考
- https://babeljs.io/docs/babel-standalone.html