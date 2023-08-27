## 前言

canvas的文本API很鸡肋。

大纲：

- canvas文本的基础 API 以及问题
- 如何实现文本坐标轴
- 如何在 canvas 中实现多行文本
- 如何实现文本的两端对齐效果
- 如何实现文本自动换行
- 如何实现删除线的功能

## Canvas文本 API

canvas文字绘制主要有两个API:

- 文本绘制：[ctx.fillText(text, x, y [, maxWidth])](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText)
- 文本描边：[ctx.strokeText(text, x, y [, maxWidth])](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeText)


## 实现删除线

```js
if (element.textDecoration === TEXT_DECORATION.lineThrough) {
  context.textBaseline = "alphabetic";

  const text = lines[index];
  const x = horizontalOffset;
  const y = index * lineHeightPx + lineHeightPx / 2;
  const textWidth = context.measureText(text).width;

  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + textWidth, y);
  context.strokeStyle = element.strokeColor;
  context.lineWidth = getLineThrough(element.fontSize);
  context.stroke();
}
```

## 参考


- [深入理解 CSS：字体度量、line-height 和 vertical-align](https://juejin.cn/post/6844903538745671694)

- https://stackoverflow.com/questions/67672635/why-the-text-in-canvas-cant-be-centered-vertically

- [MDN TextMetrics](https://developer.mozilla.org/zh-CN/docs/Web/API/TextMetrics)

- [canvas text](https://www.npmjs.com/search?q=text%20canvas)

- [canvas-hypertxt](https://www.npmjs.com/package/canvas-hypertxt)

- https://stackoverflow.com/questions/4627133/is-it-possible-to-draw-text-decoration-underline-etc-with-html5-canvas-text

- [canvas 文本绘制自动换行、字间距、竖排等实现](https://www.zhangxinxu.com/wordpress/2018/02/canvas-text-break-line-letter-spacing-vertical/)

- [TextMetrics](https://developer.mozilla.org/zh-CN/docs/Web/API/TextMetrics)

- [中文到底有没有基线（baseline）的概念](https://www.zhihu.com/question/22183501)
