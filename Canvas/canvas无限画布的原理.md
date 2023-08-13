## 前言

本节我们来了解下如何实现无线画布的定点缩放以及绘制矩形的功能。涉及的知识点如下

- 什么是无线画布以及定点缩放功能
- 了解两个基础的 API： context.translate，context.scale
- 了解如何实现无线画布的定点缩放
  - 坐标原点 O 偏移到 A1
  - 坐标 A1 偏移到 A2
- 矩形绘制以及导出

## Canvas 坐标变换

Canvas 坐标是一个默认 300px \* 150px 的矩形，原点(0, 0)在左上角，x 轴正方向向右，y 轴正方向向下。并可通过以下三种方式进行变换

- 平移：context.translate(x, y)
- 缩放：context.scale(x, y)
- 旋转：context.rotate(angle)

### context.translate

那么，为什么需要坐标操作呢？理由是可以极大地简化绘制的复杂度。

比如我们需要绘制一个矩形，如果不进行坐标变换，那么我们需要计算出矩形的四个顶点的坐标，然后再进行绘制。而如果进行坐标变换，我们只需要计算出矩形的左上角的坐标，然后再进行绘制即可。

又比如需要斜 45 度画一条线，如果不进行坐标变换，我们需要计算出线的两个端点的坐标，然后再进行绘制。而如果进行坐标变换，我们只需要计算出线的起点的坐标，然后再进行绘制即可。

无变换的情况绘制 45 度线段:

```js
// 绘制斜45度线段（需要计算两个端点的坐标）
ctxWithoutTransform.beginPath();
ctxWithoutTransform.moveTo(200, 100);
ctxWithoutTransform.lineTo(
  200 + 100 * Math.cos(Math.PI / 4),
  100 - 100 * Math.sin(Math.PI / 4)
); // 需要自己计算点的坐标
ctxWithoutTransform.strokeStyle = "green";
ctxWithoutTransform.stroke();
```

有变换的情况绘制 45 度线段:

```js
// 坐标的变换
ctxWithTransform.translate(200, 100);
ctxWithTransform.rotate(-Math.PI / 4);

ctxWithTransform.beginPath();
ctxWithTransform.moveTo(0, 0);
ctxWithTransform.lineTo(100, 0);
ctxWithTransform.strokeStyle = "green";
ctxWithTransform.stroke();

// 恢复坐标的变换
ctxWithTransform.rotate(-Math.PI / 4);
ctxWithTransform.translate(-200, -100);
```

可以看到，坐标变换可以极大地简化绘制的复杂度，因此在绘制的时候，我们可以先进行坐标变换，然后再进行绘制，最后再恢复坐标变换。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-translate.png)


完整的 demo 请看👉 [Github在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/canvas-translate/index.html), 查看示例代码请点击[此处](./demo/canvas-translate/index.html)


### context.scale


## 如何实现无线画布的定点缩放

首先我们假定初始的缩放比例为 1， 通过一个 zoom 值来记录。对于画布上的一点 A(x, y), 放大 n1 倍后的坐标为 A1(x1, y1), 那么有如下关系：

x1 = n1 \* x

y1 = n1 \* y

由于我们需要实现的是定点缩放，因此对于缩放后的 A1， 我们需要对齐进行平移至原来的 A 点：

x 轴的偏移量：offsetA1 = x1 - x = n1 \* x - x
y 轴的偏移量：offsetA1 = y1 - y = n1 \* y - y



1. 不考虑 canvas offset 的情况下，canvas 的坐标系如下图所示
2. canvas 的缩放是以 canvas 的左上角为原点进行缩放的，所以在缩放的时候，需要将 canvas 的原点移动到缩放的中心点，然后再进行缩放，缩放完毕后，再将 canvas 的原点移动回来。如下图所示
3. 绘制完成后，需要将 canvas 的原点移动回来，然后再进行导出。如下图所示
