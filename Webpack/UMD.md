## umd

UMD 的全称是 Universal Module Definition，即通用模块定义，旨在让你的模块能在 javascript 所有运行环境中发挥作用。

这也就意味着，一个使用 UMD 规范导出的 模块既可以通过 AMD(requireJS) 的方式引入，也可以通过 CommonJS(SeaJS) 的方式引入。

```js
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD环境
    define(["dependencies"], factory);
  } else if (typeof exports === "object") {
    // Node.js环境
    module.exports = factory(require("dependencies"));
  } else {
    // 暴露到全局对象
    root.MyModule = factory(root.Dependencies);
  }
})(typeof self !== "undefined" ? self : this, function (Dependencies) {
  // 将你的代码包裹在这个闭包中
  return {
    // 暴露模块的公共接口
  };
});
```
