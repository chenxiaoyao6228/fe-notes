## 前言

本节我们来了解下如何实现无限画布的定点缩放以及绘制矩形的功能。涉及的知识点如下

- 什么是无限画布以及定点缩放功能
- 了解两个基础的 API： context.translate，context.scale
- 了解如何实现无限画布的定点缩放
  - 坐标原点 O 偏移到 A1
  - 坐标 A1 偏移到 A2
- 矩形绘制以及导出

## 无限画布

> "HTML 无限画布"通常是指在 HTML 中创建一个似乎无限大的画布，使用户可以通过拖动和滚动在画布上进行绘制、编辑和浏览内容，就像在一个无限大的绘图区域中一样。这种概念在涂鸦应用、绘图工具、地图应用等中很常见，允许用户在一个较小的窗口中绘制和浏览大型内容.

具体产品可以体验开源的[Excalidraw](https://excalidraw.com/)

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
ctxWithTransform.translate(-200,**** -100);
```

可以看到，坐标变换可以极大地简化绘制的复杂度，因此在绘制的时候，我们可以先进行坐标变换，然后再进行绘制，最后再恢复坐标变换。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-translate.png)

完整的 demo 请看 👉 [Github 在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/canvas-translate/index.html), 查看示例代码请点击[此处](./_demo/canvas-translate/index.html)

### context.scale

context.scale(x, y) 用于缩放坐标系，x 为 x 轴的缩放比例，y 为 y 轴的缩放比例。比如 context.scale(2, 2) 表示 x 轴和 y 轴都放大 2 倍。

举个例子就明白了，对于蓝色矩形来说，坐标轴放大的两倍，那么矩形绘制的起点与宽高都有两倍的放大。

```js
function drawSquare() {
  // 1.绘制红色矩形
  ctx.fillStyle = "red";
  ctx.fillRect(50, 50, 50, 50);

  // 2.绘制黄色矩形
  ctx.save(); // 保存初始化状态
  ctx.fillStyle = "yellow";
  ctx.scale(0.5, 0.5); // 缩小坐标轴
  ctx.fillRect(50, 50, 50, 50);
  ctx.restore(); // 恢复初始化状态

  // 3. 绘制蓝色矩形（只需计算左上角的坐标，大小加倍）
  ctx.fillStyle = "blue";
  ctx.scale(2, 2); // 放大坐标轴
  ctx.fillRect(50, 50, 50, 50); // 放大后的矩形
}
```

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-scale.png)

完整的 demo 请看 👉 [Github 在线效果预览](./_demo/canvas-scale/index.html), 查看示例代码请点击[此处](./_demo/canvas-scale/index.html)

## 实现无限画布

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-pan.gif)

如何实现无限画布呢？当我们的鼠标或者双指拖动画布的时候，我们需要记录下画布的偏移量，在绘制的时候需要将这部分偏移量累加到元素本身上去

```js
canvas.addEventListener("pointerdown", (event) => {
  isDragging = true;
  startX = event.clientX;
  startY = event.clientY;
});

canvas.addEventListener("pointermove", (event) => {
  if (!isDragging) return;
  const deltaX = event.clientX - startX;
  const deltaY = event.clientY - startY;
  // 更新滚动距离
  appState.scrollX += deltaX;
  appState.scrollY += deltaY;
  // 重新绘制元素
  drawElements();
  startX = event.clientX;
  startY = event.clientY;
});
```

```js
// 应用状态
const appState = {
  scrollX: 0,
  scrollY: 0,
};

// 元素列表
const elements = [
  { x: 100, y: 100, width: 100, height: 100 },
  { x: 200, y: 200, width: 100, height: 150 },
];

// 绘制元素
function drawElements() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  for (const element of elements) {
    ctx.fillRect(
      element.x + appState.scrollX,
      element.y + appState.scrollY,
      element.width,
      element.height
    );
  }
}
```

完整的 demo 请看👉 [Github在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/infinite-canvas/pan.html), 查看示例代码请点击[此处](./_demo/infinite-canvas/pan.html)



当然，我们也可以使用 ctx.translate 来简化我们的计算

```js
function drawElements() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  for (const element of elements) {
    ctx.save();
    ctx.translate(appState.scrollX, appState.scrollY); // 平移绘制坐标系
    ctx.fillRect(element.x, element.y, element.width, element.height); // 绘制元素, 不需要计算偏移量
    ctx.restore(); 
  }
}
```
完整的 demo 请看👉 [Github在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/infinite-canvas/pan-with-translate.html), 查看示例代码请点击[此处](./_demo/infinite-canvas/pan-with-translate.html)

## 实现无限画布的定点缩放

有了上面的基础知识和铺垫，下面我们进入无限画布的实现。

我们还是以为100*100，坐标为(100,100)的红色div为例, 假设我们的缩放比例为2，那么我们需要将红色div放大2倍，然后再将其左上角的坐标平移到原来的位置

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-zoom.gif)


如何平移呢？

### 初次变换

对于画布上的一点 A(x, y), 放大 n1 倍后的坐标为 A1(x1, y1), 那么有如下关系：

> x1 = n1 \* x
> y1 = n1 \* y

由于我们需要实现的是定点缩放，因此对于缩放后的 A1， 我们需要对其进行平移至原来的 A 点：

> x 轴的偏移量：offsetA1 = x1 - x = n1 \* x - x
> y 轴的偏移量：offsetA1 = y1 - y = n1 \* y - y

如何在画布中显示呢？

### 二次变换


假设，此时已经有缩放倍数为 n1 的矩形，如果我们需要将其放大 n2 倍(比如120%-> 150%)， 那么对于矩形的左上角的坐标 A2(x2, y2) 有如下关系：


### 加入鼠标滚动