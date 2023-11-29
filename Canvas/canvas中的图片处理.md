## 前言

本文介绍如何在`canvas`中绘制图片，以及`canvas`中图片的一些操作

一些应用场景:

- 图片放大镜效果、添加水印(图层合并)、图片裁剪
- 图片滤镜
- canvas 绘制视频帧

## web 中的图片加载以及跨域问题

在使用 canvas 绘制图片之前，我们需要通过网络请求将图片加载到浏览器中，然后再通过 canvas 绘制到页面上，目前主要有两种方式：1. img 标签 2. ajax/fetch 请求

1. Img 标签加载图片

```js
const img = new Image();
img.src = "https://example.com/image.jpg";
img.crossOrigin = "anonymous";
img.onload = function () {
  // 图片加载完成后的处理逻辑,可以将图片添加到页面上或执行其他操作
  document.body.appendChild(img);
};
img.onerror = function (error) {
  console.error("Error fetching image:", error);
};
```

在此过程中，浏览器内部主要做了以下几件事情：

- 发起网络请求： 浏览器开始向指定的图片 URL 发起网络请求，请求图片资源。

- 接收图片数据： 一旦服务器响应，浏览器开始接收图片的数据。

- 解析图片数据： 浏览器解析接收到的图片数据，根据图片格式（如 JPEG、PNG、GIF 等）进行解码。

- 构建图像对象： 浏览器将解码后的图片数据构建成一个图像对象（Image Object），这个对象包含了图像的宽度、高度等信息。

- 触发 onload 事件： 当整个图像加载和解析完成后，浏览器触发 img.onload 事件。这表示图像已经可以在页面中使用了。

- 执行 onload 处理函数： 与 img.onload 事件相关联的处理函数（回调函数）会被执行。在这个函数中，你可以执行任何你想要在图像加载完成后进行的操作，例如将图像添加到页面上，更新页面的其他元素等。

2.  ajax/fetch

```js
fetch("https://example.com/image.jpg", {
  method: "GET",
  mode: "cors", // 必须设置为 'cors'，以启用跨域请求
  credentials: "omit", // 不发送凭据
})
  .then((response) => response.blob())
  .then((blob) => {
    // 处理获取到的图片二进制数据, 可以将其显示在页面上或进行其他操作
  })
  .catch((error) => {
    console.error("Error fetching image:", error);
  });
```

3. 资源跨域

浏览器默认对 img，style, script 等资源允许跨域访问的(注意这里的访问仅仅指的是可以渲染在页面上，如果进一步获取数据则会失败)，而 ajax/fetch 请求则不允许跨域访问. 除非显式设置响应头

> `Access-Control-Allow-Origin: *`，

以下列两张图片为例：

一是 jsdelivr 的图片资源，设置了跨域响应头

> https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/wireshark-setting.png

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/assets-cross-orgin-server-setting.png)

二是 youtue 视频的封面图，没有设置响应头

> https://img.youtube.com/vi/yWI61kpFEAA/0.jpg

比如上述的 img 标签加载图片，如果图片资源服务器设置了跨域，那么就可以正常加载图片，但是如果是 ajax/fetch 请求，那么就需要设置跨域响应头，否则会报错。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/img-cross-origin-firefox-error.png)

可以看到，红色框住的部分对应的图片无法显示
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/image-fetch-cross-origin.png)

重点来了：

**绘制图片到 Canvas 上是一种相对宽松的操作，而直接访问图像数据则受到同源策略的限制。**

**而对于 canvas.drawImage 而言, 只要能够加载到图片资源，就可以正常绘制**

**但是如果通过 canvas.getImageData、canvas.toDataURL 等 API 获取图片数据的时候， 就需要满足两个条件**

1. 图片资源服务器设置了跨域响应头

2. 在请求跨域资源的过程中，添加以下代码表示请求的资源应该用匿名身份进行访问，不发送用户凭据（例如 cookie）：

```js
img.crossOrigin = "anonymous";
```

对于 ajax, 可以通过`withCredentials: false`来达到同样的效果, 而对于 fetch 请求，可以通过设置`credentials: "omit"`来达到同样的效果

如果没有正确处理，就会出现`tainted canvas`的错误

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/tainted-canvas-error.png)

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/image-cross-origin/taint-canvas.html), 查看示例代码请点击[此处](./_demo/image-cross-origin/taint-canvas.html)

## Canvas 中的绘图 API

- drawImage
- getImageData/putImageData
- createImageData
- toDataURL

## canvas 中绘制 img

基本 API 如下：

```js
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var img = new Image();
// 设置图像源
img.src = "https://example.com/image.jpg";
// 等待图像加载完成后绘制到 Canvas
img.onload = function () {
  // 在 Canvas 上绘制图像
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};
```

完整的 demo 请看👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/draw-image/draw-image.html), 查看示例代码请点击[此处](./_demo/draw-image/draw-image.html)

## Canvas 中绘制 svg

思路也是一样的，只是需要将 svg 字符串转换成 base64 编码的数据 URL，然后再绘制到 canvas 上

```js
function drawSvgOnCanvas(canvas, svgString) {
  var context = canvas.getContext("2d");
  var img = new Image();
  // 启用跨域资源共享（CORS）以加载图片
  img.crossOrigin = "anonymous";
  // 对SVG字符串进行Base64编码
  var base64Svg = btoa(svgString);
  // 从Base64编码的SVG字符串创建数据URL
  var dataURL = "data:image/svg+xml;base64," + base64Svg;
  img.src = dataURL;
  // 等待图像加载完成，然后在Canvas上绘制
  img.onload = function () {
    context.drawImage(img, 0, 0);
  };
}

document.addEventListener("DOMContentLoaded", function () {
  // 注意：xmlns属性是必需的，不能省略
  var svgString =
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /></svg>';

  var canvas = document.getElementById("myCanvas");

  drawSvgOnCanvas(canvas, svgString);
});
```

这里需要介绍下`btoa`函数，它是`Base64`编码函数，它的作用是将字符串转换成`Base64`编码的字符串，比如：

```js
var base64String = btoa(binaryString);
```

完整的 demo 请看👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/draw-image/draw-svg.html), 查看示例代码请点击[此处](./_demo/draw-image/draw-svg.html)

## Canvas 中绘制 canvas

```js
document.addEventListener("DOMContentLoaded", function () {
  // 获取第一个Canvas的上下文
  var context1 = document.getElementById("canvas1").getContext("2d");

  // 在第一个Canvas上绘制一个矩形
  context1.fillStyle = "lightblue";
  context1.fillRect(10, 10, 180, 180);

  // 获取第二个Canvas的上下文
  var context2 = document.getElementById("canvas2").getContext("2d");

  // 将第一个Canvas的内容绘制到第二个Canvas上
  context2.drawImage(document.getElementById("canvas1"), 0, 0);
});
```

完整的 demo 请看👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/draw-image/draw-canvas.html), 查看示例代码请点击[此处](./_demo/draw-image/draw-canvas.html)

## 更多阅读

- https://www.zhangxinxu.com/wordpress/2023/09/js-jpg-png-compress-tinyimg-mini/
- https://github.com/eduardolundgren/tracking.js/
- [UPNG.js](https://github.com/photopea/UPNG.js)
- [基于 HTML5 的专业级图像处理开源引擎](https://github.com/AlloyTeam/AlloyImage)
- [图片裁剪 cropper.js](https://fengyuanchen.github.io/cropper/)
