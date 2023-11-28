## 前言

本文介绍如何在`canvas`中绘制图片，以及`canvas`中图片的一些操作

一些应用场景:

- 图片放大镜效果
- 图片添加水印(图层合并)
- 图片裁剪

## Canvas 中的绘图 API

## drawImage

## getImageData/putImageData

## toDataURL

## canvas 中绘制 img

- 通过`drawImage`方法绘制`img`，`img`的`url`必须同源，否则会报错

## Canvas 中绘制 svg

- 通过`canvas`的`drawImage`方法绘制`svg`，但是`svg`的`url`必须同源，否则会报错
- xmlns="http://www.w3.org/2000/svg"
- svg 的模糊问题

## fetch 与 new Image 获取图片数据的区别

里面的方法虽多，根据我多年的实践，还是服务器设置 Access-Control-Allow-Origin 运行访问，前端 fetch 或 XMLHttpRequest 获取图片数据的策略最好用。

以 fetch 举例，想要获得一个图片地址是 imgUrl 的图像数据，可以这么处理：

```js
fetch(imgUrl)
  .then((res) => res.blob())
  .then((blob) => {
    var reader = new FileReader();
    reader.onload = function () {
      // this.result 就是图片的base64地址
    };
    reader.readAsDataURL(blob);
  });
```

## 离屏 Canvas

## 更多阅读

- https://www.zhangxinxu.com/wordpress/2018/02/crossorigin-canvas-getimagedata-cors/
- https://www.zhangxinxu.com/wordpress/2023/06/js-canvas-jspdf-export-pdf/
- https://www.zhangxinxu.com/wordpress/2023/09/js-jpg-png-compress-tinyimg-mini/
- https://github.com/eduardolundgren/tracking.js/
- [UPNG.js](https://github.com/photopea/UPNG.js)
- [基于HTML5的专业级图像处理开源引擎](https://github.com/AlloyTeam/AlloyImage)
- [图片裁剪 cropper.js](https://fengyuanchen.github.io/cropper/)