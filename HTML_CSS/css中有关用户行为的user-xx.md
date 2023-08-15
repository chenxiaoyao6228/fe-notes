## 前言

css 中有几个有关于用户行为的属性:

- user-select
- user-modify
- user-drag

本文来谈谈这几个 API的用法： 

## user-drag于用户拖拽

当涉及到拖拽元素时，CSS 的 user-drag 属性和 HTML 的 draggable 属性是两个相关但不完全相同的概念。

### user-drag 属性:
- 由 CSS 控制，可以应用于任何元素，不仅限于 a 或 img 等特定元素。
- 支持更细粒度的控制，可以根据需要选择特定元素是否允许拖拽。
- 不需要额外的 HTML 属性，可以直接在样式表中使用。
###  draggable 属性:
- 由 HTML 控制，通常用于特定元素，例如 a 或 img，以指定该元素是否可以被拖拽。
- 支持更广泛的浏览器兼容性，因为在 HTML5 规范中已经定义了该属性。
- 对于通用的拖拽需求，不需要为每个元素设置单独的样式。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/user-drag.png)

👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/HTML_CSS/_demo/user-xx/user-drag.html)

总体而言，user-drag 属性和 draggable 属性都可以用来控制元素的拖拽行为，但在使用时需要根据具体需求和场景来选择。draggable 属性更适合用于简单的拖拽需求和通用的元素，而 user-drag 属性则提供了更灵活的控制方式，适用于更复杂的拖拽交互设计。
