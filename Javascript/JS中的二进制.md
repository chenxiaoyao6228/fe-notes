## 前言

本文梳理二进制相关的知识点。

## 计算机中的数据存储

计算机底层是通过 0 和 1 来储存数据的，对于不同文件，计算机会使用不同的编码方式来表示。
### 数字的表示

整数的表示通常是直接的二进制形式。例如，十进制数 9 在二进制中表示为 1001。

对于[浮点数](https://en.wikipedia.org/wiki/Floating-point_arithmetic)，计算机使用 IEEE 754 标准，将数字分成符号位、指数和尾数，以科学计数法的形式表示。浮点数的计算可能会出现[误差](https://en.wikipedia.org/wiki/Floating-point_arithmetic#Accuracy_problems)

### 文本的表示

文本通常使用字符编码标准转换为数字，然后再表示为二进制。

ASCII（美国标准信息交换码）是最早的字符编码，将每个字符映射为一个唯一的数字。

[Unicode](https://developer.mozilla.org/en-US/docs/Glossary/Unicode)是一种更广泛的字符编码，它包括世界上大部分字符的映射。

[UTF-8](https://en.wikipedia.org/wiki/UTF-8)是 Unicode 的一种变体，它使用不同长度的编码表示不同范围的字符。

### 图像的表示

图形通常由像素组成。每个像素都有颜色信息。在计算机中，颜色通常由红色（R）、绿色（G）和蓝色（B）的组合来表示，这就是 RGB 颜色模式。每个颜色通道可以由 8 位（一个字节）表示，这就是常见的 24 位颜色表示法。对于图像文件，则需要额外的元数据，比如图像的宽度和高度。

我们可以将 1px\*1px 的黑色图片转换为二进制数据，然后查看其二进制数据。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/image-binary-representation.png)

- PNG 文件签名： 前 8 个字节 [137, 80, 78, 71, 13, 10, 26, 10] 代表 PNG 文件签名。
- PNG 头信息： 接下来的 25 个字节代表 PNG 头部信息，包括宽度、高度、颜色类型和其他元数据。例如，[0, 0, 0, 13] 表示 IHDR 块的长度，73, 72, 68, 82 表示 ASCII 值为 "IHDR"，[0, 0, 0, 1] 和 [0, 0, 0, 1] 分别表示宽度和高度（在这个例子中都是 1 像素）。
- 图像数据： 后续的字节代表实际的像素数据。
- 文件结束标志： 最后的 12 个字节 [73, 69, 78, 68, 174, 66, 96, 130] 代表 IEND 块，表示 PNG 文件的结束

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Javascript/_demo/binary/data-representation.html), 查看示例代码请点击[此处](https://github.com/chenxiaoyao6228/fe-notes/blob/main/Javascript/_demo/binary/data-representation.html)

而对于相机拍摄的照片，其二进制数据会更加复杂，因为其包含了更多的元数据。通常包括拍摄日期、相机型号、曝光时间、光圈、ISO 设置等。些元信息遵循了 EXIF（Exchangeable Image File Format）标准，并且通常被嵌入在常见的图像格式（如 JPEG）中。

这些数据的解析可以用[exif-js](https://github.com/exif-js/exif-js)库(比如在处理移动端用户照片的时候会用到).

```
  +-----------------------------------+
  |      图片真实数据（像素信息）          |
  +-----------------------------------+
  |   图片格式的元数据（例如PNG的头信息）   |
  +-----------------------------------+
  |          额外信息（EXIF等）          |
  +-----------------------------------+
```

三者有点 `IP->TCP->HTTP`层层套包的感觉。

### 视频的表示

视频: 通常由一系列帧组成。每一帧都是静止图像，这些图像以一定的速率播放以呈现连续的运动。

视频的表示有兴趣可以到社区查看相应的文章

## Blob

Blob（Binary Large Object）

### Blob 与 base64 互转

base64 转 blob

```js
const base64ToBlob = (dataURI: string) => {
  const byteString = atob(dataURI.split(",")[1]);

  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};
```

## File

File 继承与 Blob，这个可以通过查看 File 的原型链得知。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/js-file-inheritance.png)

File 对象同时添加了一些属性和方法，用于处理文件相关操作。

```js
var myFile = new File(bits, name[, options]);
```

其中，

- bits 是一个数组，成员是二进制数据，可以是 ArrayBuffer 对象、ArrayBufferView 对象（比如 Uint8Array 对象）或字符串。
- name 是一个字符串，表示文件名。
- options 是可选参数，表示文件的一些属性，目前只有 lastModified 属性，返回一个时间戳。

这也意味着我们可以将 blob 手动构造为 file 对象

```js
const blobContent = "This is the content of the blob.";
const blob = new Blob([blobContent], { type: "text/plain" });
const fileName = "blob_file.txt";
const file = new File([blob], fileName, { type: "text/plain" });
console.log(file);
```
在某些场景下，比如将canvas导出的图片上传到服务器，需要将canvas.toDataURL()的结果转换为file对象，这时候就可以使用上面的方法。

但大多数情况下，File 对应可以从 input[type=file]中获取到的文件对象。

```js
const fileInput = document.getElementById("fileInput");
const file = fileInput.files[0];
```

也可以从 drag 事件中获取到的文件对象。

```js
function handleDrop(event) {
  files = event.dataTransfer.files;
}
```

## ArrayBuffer/Buffer

ArrayBuffer 是Web环境下处理二进制数据的基础对象，而 Buffer 是Node.js环境下处理二进制数据的高级对象

目前暂时没有实践场景，先留个坑。

## URL

在日常业务代码中，我们常使用 URL 来解析 url，

```
const url = new URL(
  "https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname?q=value",
);
console.log(url.pathname); // Logs "/en-US/docs/Web/API/URL/pathname"
```

但是 URL 提供了 createObjectURL(object)静态方法，可以将 **blob 或者 file 对象或者 MediaSource 对象**转换为 url。

```js
const selectedFile = imageInput.files[0];
URL.createObjectURL(selectedFile);
```

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/file-createObjectURL.png)

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Javascript/_demo/binary/url.html), 查看示例代码请点击[此处](https://github.com/chenxiaoyao6228/fe-notes/blob/main/Javascript/_demo/binary/url.html)

### Canvas.toDataUrl 和 Canvas.toBlob

Canvas 中提供了两个方法，可以将 canvas 转换为 dataUrl 或者 blob 对象进行展示。

```js
const canvas = document.getElementById("drawingCanvas");
const snapshotDataUrl = canvas.toDataURL();
snapshotImage.src = snapshotDataUrl;
snapshotImage.style.display = "block";
```

```js
const canvas = document.getElementById("drawingCanvas");
canvas.toBlob((blob) => {
  const snapshotDataUrl = URL.createObjectURL(blob);
  snapshotImage.src = snapshotDataUrl;
  snapshotImage.style.display = "block";
});
```

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-toDataUrl.png)

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Javascript/_demo/binary/canvas-toDataUrl.html), 查看示例代码请点击[此处](https://github.com/chenxiaoyao6228/fe-notes/blob/main/Javascript/_demo/binary/canvas-toDataUrl.html)

## FormData 与 File 与文件上传

先举一段常规的文件上传的例子：
```js
const fileInput = document.getElementById('fileInput'); 
const file = fileInput.files[0]; 
formData.append('file', file, file.name); 
const  xhr = new XMLHttpRequest();


xhr.open('POST', '/upload', true);
xhr.onload = function() {
    // 请求完成后的处理逻辑
};
xhr.send(formData); // 将FormData对象发送到服务器
```

在这个过程中，FormData 对象会负责将 File 对象的数据以 multipart/form-data 格式组织起来，并将其发送到服务器。

multipart/form-data 是一种用于在 HTTP 请求中传输二进制数据的一种编码方式。它允许你在同一个 HTTP 请求中传输多个数据块(parts),
每个数据块可以包含文本数据或二进制数据（例如文件）。这种编码方式通常用于处理包含文件上传功能的表单。

```
POST /upload HTTP/1.1
Host: example.com
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="text_field"

Text data from a text field
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="example.txt"
Content-Type: text/plain

Contents of the file.
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

服务器端的应用程序会解析这个格式，从中提取出文件数据或其他表单字段的值，然后进行处理。

## FileReader API

如果知道一个文件的二进制数据类型，也可以将这个文件读取为 ArrayBuffer 对象。

```js
const fileInput = document.getElementById("fileInput");
const file = fileInput.files[0];
const reader = new FileReader();
reader.readAsArrayBuffer(file);
reader.onload = function () {
  const arrayBuffer = reader.result;
  // ···
};
```

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/js-binary-jszip-file-async.png)

zip 文件处理库 jsZip 的 jsZip.loadAsync 方法底层就是通过 FileReader 来读取文件的。

## 参考

- https://www.bbc.co.uk/bitesize/guides/zpfdwmn/revision/1
- https://wangdoc.com/javascript/bom/arraybuffer
- https://javascript.ruanyifeng.com/htmlapi/file.html
- https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static