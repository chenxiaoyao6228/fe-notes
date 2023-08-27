## 前言

ctx.fillText(text, x, y [, maxWidth])，文字的绘制坐标与(x,y)，ctx.textAlign，ctx.textBaseline息息相关


下面列举了不同的(textAlign/textBaseline)的组合，以及对应的效果：


![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-textAlign-textBaseline.png)

完整的 demo 请看👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/canvas-text/canvas-textAlign-textBaseline.html), 查看示例代码请点击[此处](./_demo/canvas-text/canvas-textAlign-textBaseline.html)。

其中，黄色的小方格代表的是传入fillText的x,y坐标绘制出来的图形。 

可以看到，当`textAlign=middle`, `verticalAlign=middle`时，文本的中心点与黄色小方格的中心点重合。

## 真的垂直居中了吗？

❗❗❗❗❗: 不一定要穿过字母 X 的中点才算垂直居中。

经过测试，不同的字体会影响垂直居中的效果。观察下图可以看到，在不同的字体下，中间线并不一定准确穿过字母 X 的中点

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-textBase-middle-in-different-font.png)

完整的 demo 请看👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/canvas-text/canvas-textBaseline-middle.html), 查看示例代码请点击[此处](./_demo/canvas-text/canvas-textBaseline-middle.html)

看来`textBaseline:middle`无法满足我们的需求，那么有没有其他的方法呢？

## ctx.measureText

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-text-vertical-align-with-measure-text.png)

完整的 demo 请看👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/canvas-text/vertical-align-with-text-measure.html), 查看示例代码请点击[此处](./_demo/canvas-text/vertical-align-with-text-measure.html)

