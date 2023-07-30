## 前言

本文大纲：

- Canvas中的HTML尺寸/CSS 尺寸
- 设备物理像素/设备独立像素/DPI/像素分辨率/Canvas模糊的问题
- Canvas默认尺寸/最大尺寸
- 监听设备的尺寸变化

## HTML尺寸与 CSS 尺寸

```js
<canvas id="myCanvas" width="500" height="500" style="width: 500px, height: 500px"></canvas>
```
### HTML尺寸

Canvas的HTML尺寸可通过HTML的width和height属性设置，也可以通过JavaScript动态设置。

```js
// 在HTML中设置Canvas大小
<canvas id="myCanvas" width="500" height="500"></canvas>

// 在JavaScript中动态设置
const canvas = document.getElementById('myCanvas');
canvas.width = 500;
canvas.height = 500;
```

### CSS 尺寸

## DPI适配与自适应缩放
```js
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const dpi = window.devicePixelRatio;
const width = canvas.clientWidth * dpi; // 可视区域的窗口大小
const height = canvas.clientHeight * dpi;

canvas.width = width;
canvas.height = height;

// 将Canvas上下文的缩放比例设置为dpi
ctx.scale(dpi, dpi);
```

## Canvas默认尺寸/最大尺寸

### 默认尺寸

作为替换元素，canvas默认的宽高为"300*150"

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-default-size.png)

👉 [Github在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demos/canvas-size/default.html)

### 最大尺寸
根据[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas#%E6%9C%80%E5%A4%A7%E7%9A%84%E7%94%BB%E5%B8%83%E5%B0%BA%E5%AF%B8)的描述，canvas有最大的尺寸限制

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-max-size.png)

虽然规范如此，但是不同浏览器不同设备上的表现不同，这里提供一个demo供读者快速测试, 👉 [Github在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demos/canvas-size/max-size.html)

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-max-size-test.png)

尺寸越大，渲染需要的消耗的资源就越多，应用性能就会越差。
