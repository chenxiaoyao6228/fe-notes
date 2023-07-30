## 前言

本文大纲：

- HTML 属性尺寸
- CSS 尺寸
- Canvas 模糊的问题(设备物理像素/设备独立像素/DPI/像素分辨率/)
- 设置尺寸变化的 React hooks

## HTML 尺寸

作为替换元素，canvas 默认的宽高为"300\*150"

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-default-size.png)

👉 [Github 在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demos/canvas-size/default.html)

Canvas 的 HTML 属性尺寸可通过 HTML 的 width 和 height 属性设置，也可以通过 JavaScript 动态设置。

```js
// 在HTML中设置Canvas大小
<canvas id="myCanvas" width="500" height="500"></canvas>;

// 在JavaScript中动态设置
const canvas = document.querySelector("#myCanvas");
canvas.width = 500;
canvas.height = 500;
```

## CSS 尺寸

canvas作为替换元素，很多样式表现和img元素是一致的。比如使用css控制canvas的样式，当高度或者宽度缺省的时候，canvas元素依然会保持原来的宽高比300:150, 也就是2: 1

![](../../cloudimg/2023/canvas-html-css-size-2.png)

👉 [Github在线效果预览](./_demos/canvas-size/html-css-size-2.html)

而当宽高都进行设置的时候，canvas会按照宽高各自的数值进行缩放

举个例子，在没有设置canvas宽高的情况下，我们在内部绘制了一个100*100的矩形，

```html
<div class="container">
  <p>用来参考的div元素</p>
  <div class="div"></div>
  <p>canvas元素内部绘制一样大的矩形</p>
  <canvas id="myCanvas"></canvas>
</div>
<script>
  const canvas = document.querySelector("#myCanvas");
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, 100, 100);
</script>
```
效果如下
![](../../cloudimg/2023/canvas-size-html-css-size-1.png)

👉 [Github在线效果预览](./_demos/canvas-size/html-css-size-1.html)

## DPI 适配与自适应缩放

```js
const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");
const dpi = window.devicePixelRatio;
const width = canvas.clientWidth * dpi; // 可视区域的窗口大小
const height = canvas.clientHeight * dpi;

canvas.width = width;
canvas.height = height;

// 将Canvas上下文的缩放比例设置为dpi
ctx.scale(dpi, dpi);
```

## React Hooks