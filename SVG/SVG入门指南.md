## 前言

SVG 是一种使用 XML 描述 2D 图形的语言，与传统前端 DOM 开发比较类似，本文尝试总结一下 SVG 的基本用法。

## 基本图形绘制

与 canvas 不同，svg 使用声明式的方式来绘制图形，比如绘制一个矩形：

```html
<svg width="300" height="180">
  <rect
    x="0"
    y="0"
    width="200"
    height="100"
    style="stroke: #70d5dd; fill: #dd524b"
  />
</svg>
```

上面代码告诉浏览器绘制一个起点为(x,y), 宽高分别为 200， 100 的矩形，边框颜色为 #70d5dd，填充颜色为 #dd524b。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/svg-basic-shape.png)

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/SVG/_demo/svg-basic.html), 查看示例代码请点击[此处](https://github.com/chenxiaoyao6228/fe-notes/blob/main/SVG/_demo/_demo/svg-basic.html)

对比一下 canvas 的绘制方式：

```js
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#dd524b";
ctx.strokeStyle = "#70d5dd";
this.ctx.fillRect(0, 0, 200, 100);
```

当然，对于 canvas 我们也可以用`react-canvas`这样的库来实现声明式的绘制方式。

## 坐标

SVG 坐标系和 Canvas 坐标系完全一样,都是以图像左上角为原点,x 轴向右,y 轴向下的左手坐标系。而且在默认情况下,SVG 坐标与浏览器像素对应,所以 100、50、40 的单位就是 px,也就是像素,不需要特别设置.

在 Canvas 中,为了让绘制出来的图形适配不同的显示设备,我们要设置 Canvas 画布坐标。同理,我们也可以通过给 svg 元素设置 viewBox 属性,来改变 SVG 的坐标系。如果设置了 viewBox 属性,那 SVG 内部的绘制就都是相对于 SVG 坐标系的了.

## 复用

本节了解 SVG 中的复用，包括`<defs>`、`<use>`、`<g>`、`<symbol>`、`<marker>`等。

### use

use 标签可以复用已有的元素，下面的例子中我们定义了一个矩形，然后通过 use 标签复用了这个矩形，这样就可以在页面中重复使用这个矩形了。

```html
<svg viewBox="0 0 30 10" xmlns="http://www.w3.org/2000/svg">
  <circle id="myCircle" cx="5" cy="5" r="4" />

  <use href="#myCircle" x="10" y="0" fill="blue" />
  <use href="#myCircle" x="20" y="0" fill="white" stroke="blue" />
</svg>
```

### group

group 用于组合多个形状。和上面一样，通过元素 id 进行复用

```html
<svg width="300" height="100">
  <g id="myCircle">
    <text x="25" y="20">圆形</text>
    <circle cx="50" cy="50" r="20" />
  </g>

  <use href="#myCircle" x="100" y="0" fill="blue" />
  <use href="#myCircle" x="200" y="0" fill="white" stroke="blue" />
</svg>
```

### defs

defs 用于定义一些形状，然后通过 use 标签进行复用。和上面的 group 不同的是，defs 中的元素不会在页面中显示出来。

```html
<svg width="300" height="100">
  <defs>
    <g id="myCircle">
      <text x="25" y="20">圆形</text>
      <circle cx="50" cy="50" r="20" />
    </g>
  </defs>

  <use href="#myCircle" x="0" y="0" />
  <use href="#myCircle" x="100" y="0" fill="blue" />
  <use href="#myCircle" x="200" y="0" fill="white" stroke="blue" />
</svg>
```

### symbol

symbol 元素提供了另一种组合元素的方式。和g元素不同,symbol 元素永远不会显示,因此我们无需把它放在 defs 规范内。

我们熟悉的 **iconfont.js** 文件中包含一系列 symbol 标签的定义。每个 symbol 标签定义了一个独立的 SVG 图标，通常具有一个唯一的 id 属性，以及图标的路径和其他属性。


![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/svg-symbol-live-example.png)


使用 <symbol> 标签实现 SVG 图标的符号复用、命名空间隔离、可访问性和轻量化，提高页面效率、避免命名冲突、增进可访问性，同时减小文件大小。

## 参考

- [MDN SVG](https://developer.mozilla.org/zh-CN/docs/Web/SVG)
