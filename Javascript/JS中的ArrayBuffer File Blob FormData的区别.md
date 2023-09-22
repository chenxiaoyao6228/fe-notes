## 前言

## ArrayBuffer

## Blob

Blob（Binary Large Object）

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

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Javascript/_demo/binary/url.html), 查看示例代码请点击[此处](./_demo/binary/url.html)

### Canvas.toDataUrl 和 Canvas.toBlob

Canvas中提供了两个方法，可以将 canvas 转换为 dataUrl 或者 blob 对象进行展示。


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

完整的 demo 请看👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Javascript/_demo/binary/canvas-toDataUrl.html), 查看示例代码请点击[此处](./_demo/binary/canvas-toDataUrl.html)

## FormData

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

## 参考

- https://wangdoc.com/javascript/bom/arraybuffer
- https://javascript.ruanyifeng.com/htmlapi/file.html
- https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
