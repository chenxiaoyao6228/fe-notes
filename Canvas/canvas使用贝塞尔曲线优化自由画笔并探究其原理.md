---
permalink: 2023-09-01-canvas使用贝塞尔曲线优化自由画笔并探究其原理
title: canvas使用贝塞尔曲线优化自由画笔并探究其原理
date: 2023-09-01
categories:
  - tech
tags:
  - canvas
---

## 前言

大纲：

- 贝塞尔曲线的原理，控制点，曲线方程，二次与三次贝塞尔曲线的推导实现
- 自由画笔的实现
- 贝塞尔曲线优化书写

## 曲线方程

曲线方程是一种数学表达式，用于描述平面或三维空间中的曲线形状。可以包括弧线、圆、椭圆、抛物线、双曲线等各种曲线类型。**而曲线的绘制，就是根据曲线方程求出一系列的点，然后将这些点连接起来。**

曲线方程有不同的表示方式，比如直角坐标方程，参数方程，极坐标方程等。

比如我们高中学过的圆：

它可以使用平面直角坐标系中的 x 和 y 坐标来表示圆的几何特性

```css
x^2 + y^2 = r^2
```

在这个方程中，(x, y) 表示平面上的任意点的坐标，r 是圆的半径。这个方程表达了一个以原点 (0, 0) 为中心，半径为 r 的圆的几何特性.

圆还可以用参数方程来表示:

```css
x(t) = r * cos(t)
y(t) = r * sin(t)
```

**在这里，(x(t), y(t)) 表示圆上的点的坐标，r 是圆的半径，t 是参数，通常在 0 到 2π（一圈）之间变化。 这个参数方程描述了圆上的点如何根据参数 t 和半径 r 来变化。**


## 贝塞尔曲线

贝塞尔曲线（Bezier Curve）是一种数学曲线，它由法国工程师皮埃尔·贝塞尔（Pierre Bézier）在 20 世纪上半叶首次引入。

它解决了以下问题：

- 曲线建模和控制：贝塞尔曲线解决了平滑曲线的建模和控制问题。它们允许用户轻松创建平滑曲线、路径和形状，通过调整控制点的位置来精确控制曲线的形状。
- 动画路径：贝塞尔曲线用作动画路径，使对象可以沿着平滑的轨迹移动，创建平滑的动画效果。
- 可用于数据插值，将数据点之间的曲线连接起来，用于数据可视化和数学建模。

**总的来说， 相比特定形状的曲线方程，贝塞尔曲线的成功在于提供了一个通用、可定义、精确和灵活的方式来描述不规则曲线**

贝塞尔曲线的生成由两部分决定：

- 锚点：起点，终点 (一些说法会将锚点一同归为控制点，本文使用分开的方式)
- 控制点

比如我们要在 AC 两个点之间画一条曲线, 那么我们可以在 锚点 AC 之间取一个点 B 作为控制点，然后画出曲线 ABC。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/bezier-curve-line-1.png)

可以把 B 想象成一个拉力点，它会将原本 AC 线段拉成一条曲线。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/bezier-curve-pull.gif)

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/freedraw/qudraic-bezier-visulizer.html), 查看示例代码请点击[此处](./_demo/freedraw/qudraic-bezier-visulizer.html)

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/bezier-curve-line-2.png)

控制可以有多个，比如我们可以在 AD 之间去点 B C 作为控制点，然后画出曲线 ABCD。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/bezier-curve-line-3.png)

控制点的个数决定了**贝塞尔曲线的阶数**。

- 0 个控制点的贝塞尔曲线称为线性贝塞尔曲线(linear Bézier curve)
- 1 个控制点的贝塞尔曲线称为二次贝塞尔曲线(quadratic Bézier curve)
- 2 个控制点的贝塞尔曲线称为三次贝塞尔曲线(cubic Bézier curve)


### 线性贝塞尔曲线

而要理解线性贝塞尔曲线，我们需要先理解**线性插值**这个概念。

在贝塞尔曲线中，线性插值可以用来计算曲线上介于起始点和结束点之间的任意点。

线性插值的原理是根据参数 t 的取值（通常在 0 到 1 之间），通过以下公式计算曲线上的点 B：

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/linear-bezier-formula.png)

其中，B(t)是曲线上的点，P0 是起始点，P1 是结束点，P1-P0 代表两者间的距离，t 是取值在 0 到 1 之间的参数。

代码表示如下：

```js
function lerp(start, end, t) {
  return start + (end - start) * t;
}
```

用了 lerp 函数，我们可以很容易地描绘出线性贝塞尔曲线。

```js
function renderPoint(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
}
function renderScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  for (let t = 0; t <= 1; t += 0.05) {
    let x = lerp(p0.x, p1.x, t);
    let y = lerp(p0.y, p1.y, t);
    renderPoint(x, y, 2);
  }
}

renderScene();
```

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/linear-lerp.png)

当我们把 t += 0.05 改为 t += 0.01 时，就可以看到更加平滑的曲线了。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/linear-lerp.gif)

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/freedraw/linear-bezier-curve.html), 查看示例代码请点击[此处](./_demo/freedraw/linear-bezier-curve.html)

### 二次贝塞尔曲线

对于二阶贝塞尔曲线，我们需要三个点，起点 p0，控制点 p1,终点 p2。

我们分别通过线性插值计算出 p0 和 p1 之间的点 B1，p1 和 p2 之间的点 B2，然后再计算出 B1 和 B2 之间的点 B。

其中：

```css
B1 = p0 + (p1 - p0) * t
B2 = p1 + (p2 - p1) * t
B = B1 + (B2 - B1) * t = p0 + (p1 - p0) * t + (p1 + (p2 - p1) * t - (p0 + (p1 - p0) * t)) * t
```

展开后的多项式如下:
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/quadratic-bezier-formula.png)

用 lerp 函数代入公式中，可以得到：

```css
B1 = lerp(p0, p1, t)
B2 = lerp(p1, p2, t)
B = lerp(B1, B2, t) = lerp(lerp(p0, p1, t), lerp(p1, p2, t), t)
```

让我们把上面的例子稍作修改

```js
function renderScene(step) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  for (let t = 0; t <= 1; t += step) {
    const x1 = lerp(p0.x, p1.x, t);
    const y1 = lerp(p0.y, p1.y, t);
    const x2 = lerp(p1.x, p2.x, t);
    const y2 = lerp(p1.y, p2.y, t);
    const x = lerp(x1, x2, t);
    const y = lerp(y1, y2, t);
    renderPoint(x, y, 2);
  }
}
```

再加上鼠标事件去改变控制点的位置，就可以看到二次贝塞尔曲线了。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/quadratic-bezier-curve-lerp.gif)

重点来了, 如果我们在在渲染的时候连接 B1 和 B2，就可以看到神奇的网格了。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/quadratic-bezier-curve-2.png)

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/freedraw/quadratic-bezier-curve.html), 查看示例代码请点击[此处](./_demo/freedraw/quadratic-bezier-curve.html)

### 三次贝塞尔曲线

三阶贝塞尔曲线同样如法炮制，我们需要四个点，起点 p0，控制点 p1,控制点 p2,终点 p3。

我们需要在原来二次的基础上再次进行插值。为了代码简洁，我们先抽象出 quadratic 函数

```js
function quadratic(p0, p1, p2, t) {
  const x1 = lerp(p0.x, p1.x, t);
  const y1 = lerp(p0.y, p1.y, t);
  const x2 = lerp(p1.x, p2.x, t);
  const y2 = lerp(p1.y, p2.y, t);
  const x = lerp(x1, x2, t);
  const y = lerp(y1, y2, t);
  return { x, y };
}
```

最终实现是这样的

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/quadratic-bezier-curve.gif)

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/freedraw/cubic-bezier-curve.html), 查看示例代码请点击[此处](./_demo/freedraw/cubic-bezier-curve.html)

我们可以抽取出一个对应的 cubic 函数

```js
function cubic(p0, p1, p2, p3, t) {
  const v1 = quadratic(p0, p1, p2, t);
  const v2 = quadratic(p1, p2, p3, t);
  const x = lerp(v1.x, v2.x, t);
  const y = lerp(v1.y, v2.y, t);
  return { x, y };
}
```

对应的 rnderScene 修改如下

```js
for (let t = 0; t <= 1.0000001; t += step) {
  const { x, y } = cubic(p0, p1, p2, p3, t);
  renderPoint(x, y, 2);
}
```

上面的展开后的公式如下:
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/cubic-bezier-formula.png)

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

可以看到，经过贝塞尔曲线拟合的曲线更加平滑了。

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/freedraw/freedraw-with-bezier.html), 查看示例代码请点击[此处](./_demo/freedraw/freedraw-with-bezier.html)

**将两个点的中点作为控制点的选择通常用于创建平滑的曲线**，该方法可以确保曲线通过两个点并且在两个点之间有一个平滑的拐角。方法的依据是曲线的切线在控制点处与曲线的切线在两个点的中点处平行，从而使曲线过渡更加平滑。

## 参考

- [bezierinfo - 细致全面的 bezier 介绍教程](https://pomax.github.io/bezierinfo/zh-CN)

- [Wikipedia Bézier_curve](https://en.wikipedia.org/wiki/B%C3%A9zier_curve)

- [MDN cubic-bezier_function](https://developer.mozilla.org/zh-CN/docs/Web/CSS/easing-function#using_the_cubic-bezier_function)


由于笔者能力有限，文章难免有疏漏之处，欢迎指正, 查看更多文章欢迎关注[前端开发笔记](https://github.com/chenxiaoyao6228/fe-notes)，一起交流学习


 
 
 > 本文首发于个人博客[前端开发笔记](https://github.com/chenxiaoyao6228/fe-notes)，由于笔者能力有限，文章难免有疏漏之处，欢迎指正