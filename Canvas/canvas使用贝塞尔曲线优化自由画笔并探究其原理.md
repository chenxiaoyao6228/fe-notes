## 前言

大纲：

- 自由画笔的实现
- 贝塞尔曲线优化书写
- 贝塞尔曲线的原理，控制点，曲线方程，二次与三次贝塞尔曲线的实现
- 实现一个贝塞尔曲线控制器
- 贝塞尔曲线优化折线图

## 自由画笔的实现

自由画笔的实现原理：监听鼠标事件，将鼠标移动的轨迹记录下来，然后将这些点连成线，就可以实现自由画笔了。

```js
drawingCanvas.addEventListener("pointerdown", (e) => {
  updatePointCounter(0);
  drawing = true;
  points = [];
  addPoint(e);
});

drawingCanvas.addEventListener("pointermove", (e) => {
  if (drawing) {
    addPoint(e);
    renderFreedraw(drawingCtx, points);
  }
});

drawingCanvas.addEventListener("pointerup", () => {
  drawing = false;
  createElement(points);
});
```

渲染自由绘制路径的方法只是简单地调用`ctx.lineTo`将所有的点连接起来。

```js
function renderFreedraw(ctx, points) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 20;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    const { x, y } = points[i];
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}
```

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/freedraw/freedraw.html), 查看示例代码请点击[此处](./_demo/freedraw/freedraw.html)

ps: 注意例子中用了两层画布去优化性能, 避免了重复绘制已有但未变化的图形。

## 使用贝塞尔曲线优化书写

刚刚演示的方式依赖于点的采集的密集程度，性能相对较低，另一种方案则使用相对较少的点，辅助贝塞尔曲线圆滑的方式处理。

其余的代码不变，我们需要做的只是将渲染的方法改为使用贝塞尔曲线的方式。

```js
function renderFreedraw(ctx, points) {
  if (points.length < 2) {
    return;
  }
  ctx.strokeStyle = "black";
  ctx.lineWidth = 20;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    // 计算控制点, 这里取两点中点作为控制点
    const xc = (points[i].x + points[i - 1].x) / 2;
    const yc = (points[i].y + points[i - 1].y) / 2;
    // 调用贝塞尔曲线的方法
    ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
  }

  ctx.stroke();
}
```

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/freedraw/freedraw-with-bezier.html), 查看示例代码请点击[此处](./_demo/freedraw/freedraw-with-bezier.html)

可以看到，经过贝塞尔曲线拟合的曲线更加平滑了。

那么， 为什么贝塞尔曲线可以用来优化书写？

## 贝塞尔曲线的原理

贝塞尔曲线的生成由起点，终点，控制点决定。下面一图展示了曲线的生成过程。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/bezier-curve-generation.png)
## 线性插值

当你指向两个物体中的另外一个物体时，你就用到了线性插值。它就是很简单的“选出两点之间的一个点”。

贝塞尔曲线是插值方程（就像所有曲线一样），这表示它们取一系列的点，生成一些处于这些点之间的值。这些点被称为控制点，它们决定了曲线的形状。

中间控制点：将两个点的中点作为控制点的选择通常用于创建平滑的曲线，这是因为这种方法可以确保曲线通过两个点并且在两个点之间有一个平滑的拐角。这种方法的依据是曲线的切线在控制点处与曲线的切线在两个点的中点处平行，从而使曲线过渡更加平滑。

## 参考

- [Wikipedia Bézier_curve](https://en.wikipedia.org/wiki/B%C3%A9zier_curve)

- [MDN cubic-bezier_function](https://developer.mozilla.org/zh-CN/docs/Web/CSS/easing-function#using_the_cubic-bezier_function)

- [bezierinfo - 细致全面的 bezier 介绍教程](https://pomax.github.io/bezierinfo/zh-CN)

由于笔者能力有限，文章难免有疏漏之处，欢迎指正, 最后欢迎关注[我的博客](https://chenxiaoyao.cn)，一起交流学习
