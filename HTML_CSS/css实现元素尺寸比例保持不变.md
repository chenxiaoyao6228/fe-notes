## 前言

在日常的网页开发中，经常会遇到需要保持元素宽高比例不变的需求，尤其是在屏幕宽度调整或容器尺寸变化的情况下，比如要保持图片的宽高比例不变。

👉[在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/HTML_CSS/_demo/css-keep-ratio/index.html)

## 实现

这个效果可以通过 CSS 中的 padding-top 属性实现，当将其设置为百分比时，这个百分比值相对于元素的宽度来计算。例如，假设元素的宽度为 100px，如果我们设置元素的 padding-top 为 100%，那么实际的 padding-top 值就是 100px。这样一来，随着元素宽度的变化，其高度会按照原始宽高比例进行自适应调整。

```html
<div class="container">
  <div class="content"></div>
</div>
```

```css
.container {
  width: 400px;
  /* 初始宽度 */
  position: relative;
}

.content {
  width: 100%;
  padding-top: 75%;
  /* 宽高比例为 4:3 (即 300px * 0.75 = 225px) */
  background-color: #4287f5;
  /* 随便设置一个背景色方便查看效果 */
}
```
