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


ctx.fillText(text, x, y [, maxWidth])，文字的绘制坐标与(x,y)，ctx.textAlign，ctx.textBaseline息息相关


下面列举了不同的(textAlign/textBaseline)的组合，以及对应的效果：


![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-textAlign-textBaseline.png)

完整的 demo 请看👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/canvas-text/canvas-textAlign-textBaseline.html), 查看示例代码请点击[此处](https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/canvas-text/canvas-textAlign-textBaseline.html)。

其中，黄色的小方格代表的是传入fillText的x,y坐标绘制出来的图形。 

可以看到，当`textAlign=middle`, `verticalAlign=middle`时，文本的中心点与黄色小方格的中心点重合。

## 真的垂直居中了吗？


经过测试，不同的字体会影响垂直居中的效果。观察下图可以看到，在不同的字体下，中间线并不一定准确穿过字母 X 的中点

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-textBase-middle-in-different-font.png)

完整的 demo 请看👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/canvas-text/canvas-textBaseline-middle.html), 查看示例代码请点击[此处](https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/canvas-text/canvas-textBaseline-middle.html)

看来`textBaseline:middle`无法满足我们的需求，那么有没有其他的方法呢？

## ctx.measureText

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-text-vertical-align-with-measure-text.png)

完整的 demo 请看👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/canvas-text/vertical-align-with-text-measure.html), 查看示例代码请点击[此处](https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/canvas-text/vertical-align-with-text-measure.html)



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
