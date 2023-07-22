# 前言

焦点作为页面交互中的重要一环，涉及到的知识点也比较多，有必要做一个统一的总结。

## HTML 中的可获取焦点的元素

- 具有 href 属性的 HTMLAnchorElement/HTMLAreaElement
- 非禁用态的 HTMLInputElement/HTMLSelectElement/HTMLTextAreaElement/HTMLButtonElement
- HTMLIFrameElement（虽然将其聚焦没有任何有用的效果）
- 具有 tabindex 属性的任何元素。

## 焦点的获取

HTML 规范中将 focus 聚焦性分为三种类型：“编程可聚焦”、“单击可聚焦”和“顺序可聚焦”。

- document 加载完成会获取到焦点
- 用户点击获取焦点
- 通过 js 的 element.focus()方法获取
- 添加了 tabindex 的元素可通过 tab 切换获取焦点

其中，元素上 tabindex 的值设置有一定的考究:

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/html-focus-1.png)

### CSS 中的焦点伪类

这里提一下, 聚焦的元素可以通过 css 中的:focus 与:focus-within 伪类来进行样式调整.

```css
/* 元素获取焦点时的样式 */
input:focus {
  border-color: #ff5733;
  outline: none;
}

/* 容器内有元素获得焦点时的样式 */
.container:focus-within {
  background-color: #f0f0f0;
}
```

[在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/文本输入/_demo/focus-manament/focus.html)

### JS 获取当前聚焦元素

- document.hasFocus(): 判断当前文档是否被聚焦
- document.activeElement: 获取当前文档内的聚焦元素

## 失去焦点

blur()方法的作用是从元素中移走焦点。

- 调用 blur()方法时，并不会把焦点转移到某个特定的元素上；仅仅是将焦点从调用这个方法的元素上面移走而已

- focus 了 A 元素的时候其他元素会自动失去焦点

```js
document.querySelector("#btn1").addEventListener("click", () => {
  document.querySelector("#div1").focus();
});
document.querySelector("#btn2").addEventListener("click", () => {
  document.querySelector("#div1").blur();
});
```

## 焦点事件

不会冒泡的事件: focus, blur
会冒泡的事件： focus-in, focus-out

## 参考

- [HTML 规范: focusing-on-focus](https://blog.whatwg.org/focusing-on-focus)
- [HTML 规范:dom-focus-dev](https://html.spec.whatwg.org/multipage/interaction.html#dom-focus-dev)
- [which-html-elements-can-receive-focus](https://stackoverflow.com/questions/1599660/which-html-elements-can-receive-focus)
- [focus_event](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/focus_event)
- [MDN: Tabindex, 键盘导航的 JavaScript 组件](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets)
- https://segmentfault.com/a/1190000003942014
