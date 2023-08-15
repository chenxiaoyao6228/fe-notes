## 前言

本文简单总结下文本输入中的 Selection 与 Range 事件。

👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/文本输入/_demo/selection/input-textarea-selection.html)

## ::selection && Selection

### 自定义选取颜色

项目中一般有主题色的需求，这时候可以通过 css 中的`::selection`伪类可以自定义选中背景颜色

```css
::selection {
  background: yellow;
}
```

去除第三方的 UI 库的选取选中可能要自定义 css 插件

```js
// 去除antd样式文件中的 ::selection，原因是::selection难以被取消
module.exports = function runtime(params) {
  return params.replace(/::selection \{[^}]+\}/g, "");
};
```

Selection 对象表示用户选择的文本范围或插入符号的当前位置。它代表页面中的文本选区，可能横跨多个元素。文本选区由用户拖拽鼠标经过文字而产生.

```js
var selObj = window.getSelection();
var range = selObj.getRangeAt(0);
```

selObj 被赋予一个 Selection 对象, range 被赋予一个 Range 对象

### selection 事件

```js
document.addEventListener("selectionchange", () => {
  const selection = window.getSelection();
  if (selection.toString()) {
    const selectedText = selection.toString();
    document.querySelector("#text-selected").textContent = selectedText;
  }
});
```

## 可编辑元素的选中

### 1. 主动选中某一区域

```js
// 主动选中文本框中的一部分文本
function selectText() {
  const inputElement = document.getElementById("text-input");
  inputElement.setSelectionRange(2, 4);
  inputElement.focus();
}
```

### 2. 聚焦到某一位置

```js
// 将光标聚焦到Textarea元素的指定位置
function focusCursor() {
  const textareaElement = document.getElementById("textarea");
  textareaElement.focus();
  textareaElement.setSelectionRange(10, 10); // 聚焦到第10个字符
}
```

### 3. 在指定选区插入（替换）内容

```js
// 在Textarea的指定选区位置插入文本
function insertText() {
  const textareaElement = document.getElementById("textarea");
  const selectionStart = textareaElement.selectionStart;
  const selectionEnd = textareaElement.selectionEnd;
  const textToInsert = "被插入的文本";

  // 插入文本
  const currentValue = textareaElement.value;
  const newValue =
    currentValue.substring(0, selectionStart) +
    textToInsert +
    currentValue.substring(selectionEnd, currentValue.length);

  textareaElement.value = newValue;
}
```

## 普通元素的选取选中

由于普通元素的选中夹杂了富文本，处理起来会相对麻烦一点，有时间再开一篇。

## 参考

- [Selection ](https://developer.mozilla.org/zh-CN/docs/Web/API/Selection)
- [Web 中的“选区”和“光标”](https://segmentfault.com/a/1190000041457245)
- [划词评论与 Range 开发若干经验分享](https://www.zhangxinxu.com/wordpress/2022/09/js-selection-range/)
- [selectionchange 事件](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/selectionchange_event)
