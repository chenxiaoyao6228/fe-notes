## 前言

canvas的文本API很鸡肋，很多功能都需要自己去实现，比如文本垂直居中、删除线、两端对齐等等，本文将会介绍如何实现这些功能。

大纲：

- canvas文本的基础 API 以及问题
- 如何实现文本垂直居中显示
- 如何实现删除线的功能
- 如何实现文本的两端对齐效果
- 如何在 canvas 中实现多行文本

## Canvas文本 API

canvas文字绘制主要有两个API:

- 文本绘制：[ctx.fillText(text, x, y [, maxWidth])](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText)
- 文本描边：[ctx.strokeText(text, x, y [, maxWidth])](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeText)

文字的绘制坐标与(x,y)，textAlign，textBaseline息息相关

> textAlign 的值为 center 时候文本的居中是基于你在 fillText 的时候所给的 x 的值，也就是说文本一半在 x 的左边，一半在 x 的右边（可以理解为计算 x 的位置时从默认文字的左端，改为文字的中心，因此你只需要考虑 x 的位置即可）

下面列举了不同的textAlign和textBaseline的组合，以及对应的效果：

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-textAlign-textBaseline.png)

> 示例来自《CoreHTMLCanvas》

完整的 demo 请看👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/canvas-text/canvas-textAlign-textBaseline.html), 查看示例代码请点击[此处](./_demo/canvas-text/canvas-textAlign-textBaseline.html)

## 实现文本垂直居中效果


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

- [MDN TextMetrics](https://developer.mozilla.org/zh-CN/docs/Web/API/TextMetrics)

- [canvas text](https://www.npmjs.com/search?q=text%20canvas)

- [canvas-hypertxt](https://www.npmjs.com/package/canvas-hypertxt)


- https://stackoverflow.com/questions/4627133/is-it-possible-to-draw-text-decoration-underline-etc-with-html5-canvas-text

- [canvas 文本绘制自动换行、字间距、竖排等实现](https://www.zhangxinxu.com/wordpress/2018/02/canvas-text-break-line-letter-spacing-vertical/)
