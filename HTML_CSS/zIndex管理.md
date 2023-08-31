## 前言

在大型前端项目中，管理 z-index（层叠顺序）是一个重要的任务，因为它可以影响页面元素的叠放顺序。当项目逐渐变得复杂时，合理地管理 z-index 可以避免出现混乱和难以调试的问题。

## 方案

- 制定约定或规范：在项目中，定义一个 z-index 的规范。例如，分配一定的范围给不同的层级，如负数用于背景元素，正数用于前景元素等。这有助于保持一致性，并减少冲突(这部分需要**推动设计师一起完成**)

- 对于统一的 Modal 等，需要定义唯一的 z-index，避免重复使用，这样的好处是，当同时打开多个弹窗的时候，后者会覆盖前者，而不是被前者覆盖。

- 使用变量或常量：在 CSS 中，可以使用变量或常量来表示 z-index 的值。这样如果需要调整层叠顺序，只需在一个地方更新该值，而不必逐个修改所有的使用处。

- 模块化组织：将前端项目分割成模块化的组件，每个组件内部的 z-index 管理是相对独立的。

- 文档说明：为复杂的 z-index 设置提供文档说明，解释其用途、预期行为以及如何调整。这可以帮助其他团队成员更好地理解和维护代码

## js 处理 zIndex

```js
// 获取根样式
function getRootStyle(variableName) {
  const rootStyles = getComputedStyle(document.documentElement);
  return rootStyles.getPropertyValue(variableName);
}

// 修改根样式
function changeRootStyle(variableName, newValue) {
  const rootStyles = document.documentElement.style;
  rootStyles.setProperty(variableName, newValue);
}
```
