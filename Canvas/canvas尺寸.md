## 前言

本文大纲：

- HTML 属性尺寸
- CSS 尺寸
- Canvas 模糊的问题(设备物理像素/设备独立像素/DPI/像素分辨率/)

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

canvas 作为替换元素，很多样式表现和 img 元素是一致的。

举个例子，一张 300 * 150 的图片，通过 css 设置它的宽高分别为 1200*1200，就会发现图片变形得厉害。在 CSS 中有一个[object-fit 属性](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)可以很好地解释, 其共有 5 个值, 默认值为`fill`

> fill: 中文释义“填充”。默认值。替换内容拉伸填满整个 content box, 不保证保持原有的比例

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/replaced-element-object-fill-fit.png)

同理，当使用 css 对 canvas 宽高进行设置的时候，canvas 会按照宽高\**各自*的数值进行缩放，也不保证原先的尺寸, 因此，对于 canvas 的最佳实践是： 保持 HTML 属性尺寸和 CSS 尺寸一致。(在不考虑 DPI 的情况下)

```html
<canvas
  id="myCanvas"
  width="600"
  height="300"
  style="width: 600px; height:300px"
></canvas>
```

相应的对比效果请看 👉 [Github 在线效果预览](./_demos/canvas-size/html-css-size-1.html)

## DPI 适配与自适应缩放

在设置 HTML 属性尺寸和 CSS 尺寸一致，能够避免我们的 canvas 应用绘制变形的问题，但还有另外一个常见的问题就是绘制模糊的问题(对比下下面绿色的 css 边框与中间 canvas 绘制的长方形)

```html
<canvas id="myCanvas" width="300" height="150"></canvas>
<script>
  const canvas = document.querySelector("#myCanvas");
  const ctx = canvas.getContext("2d");

  ctx.strokeStyle = "red";
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, 100, 100);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineWidth = 1;

  ctx.lineTo(300, 150);
  ctx.stroke();
</script>
```

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-size-blur.png)

👉 [Github 在线效果预览](./_demos/canvas-size/html-css-size-2.html)

影响因素是设备的像素比。根据 [MDN 的定义](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio),

window.devicePixelRatio 返回当前显示设备的物理像素分辨率与 CSS 像素分辨率之比。此值也可以解释为像素大小的比率：一个 CSS 像素的大小与一个物理像素的大小。简单来说，它告诉浏览器应使用多少屏幕实际像素来绘制单个 CSS 像素。在屏幕是 Retina 屏的情况下，我们需要更多的像素来绘制。

```js
const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");

const { offsetWidth, offsetHeight } = canvas;
const scale = window.devicePixelRatio;
canvas.width = Math.floor(offsetWidth * scale);
canvas.height = Math.floor(offsetHeight * scale);

ctx.scale(scale, scale); // 缩放修正
```

可以看到，经过调节后，我们的图像已经显示正常了。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-size-blur-2.png)

👉 [Github在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demos/canvas-size/html-css-size-3.html)

## 参考

- [半深入理解 CSS3 object-position/object-fit 属性](https://www.zhangxinxu.com/wordpress/2015/03/css3-object-position-object-fit)
- [Window: devicePixelRatio property](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)
