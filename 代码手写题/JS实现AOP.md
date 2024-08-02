## 前言

在 js 中实现 AOP，主要是通过装饰器模式来实现的，装饰器模式的核心是通过装饰器函数来包装原函数，从而实现对原函数的增强。

```js
Function.prototype.before = function (func) {
  const _self = this;
  return function () {
    if (func.apply(this, arguments) === false) {
      return false;
    }
    return _self.apply(this, arguments);
  };
};

Function.prototype.after = function (func) {
  const _self = this;
  return function () {
    if (_self.apply(this, arguments) === false) {
      return false;
    }
    return func.apply(this, arguments);
  };
};
```

使用示例

```js
function exampleFunction() {
  console.log("执行主要逻辑");
  return "主要逻辑结果";
}

// 在示例函数执行前添加逻辑
const functionWithBefore = exampleFunction.before(function () {
  console.log("执行前置逻辑");
  // 返回 false 可以中止主要逻辑的执行
  // return false;
});

// 在示例函数执行后添加逻辑
const functionWithAfter = exampleFunction.after(function () {
  console.log("执行后置逻辑");
});

console.log("调用原始函数：");
const result1 = exampleFunction();
console.log("\n----------------\n");

console.log("调用添加前置逻辑的函数：");
const result2 = functionWithBefore();
console.log("\n----------------\n");

console.log("调用添加后置逻辑的函数：");
const result3 = functionWithAfter();
```

输出结果

```
调用原始函数：
执行主要逻辑

----------------

调用添加前置逻辑的函数：
执行前置逻辑
执行主要逻辑

----------------

调用添加后置逻辑的函数：
执行主要逻辑
执行后置逻辑
```

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/代码手写题/_demo/AOP/index.html), 查看示例代码请点击[此处](https://github.com/chenxiaoyao6228/fe-notes/blob/main/代码手写题/_demo/AOP/index.html)
