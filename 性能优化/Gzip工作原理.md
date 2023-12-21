## Gzip

本节整理 Gzip 相关的知识点

## Gzip

Gzip（GNU Zip）是一种数据压缩和文件格式的算法。它主要用于在网络传输中减小数据的大小，从而提高传输速度。Gzip 使用 DEFLATE 算法对数据进行压缩，同时还包括一些额外的文件头信息和校验信息。

## DEFLATE 算法

DEFLATE 是 Gzip 压缩算法的基础。它是一种无损数据压缩算法，结合了两种主要的压缩技术：霍夫曼编码和 LZ77 算法。

- LZ77 算法： 这是一种基于滑动窗口的压缩算法。**它通过查找以前出现过的相似数据片段，并用指向先前出现位置的指针来表示这些片段，从而实现压缩**。

- 霍夫曼编码： 这是一种变长编码，其中不同的符号（或字符）被映射到不同长度的比特串。频率更高的符号使用较短的比特串，而频率较低的符号使用较长的比特串，以实现更好的压缩效果。

## Gzip 的工作原理

Gzip 的压缩基本原理是通过移除数据中的冗余信息来减小文件大小。这包括**重复的字符串、无用的空格以及其他可以通过编码技术表示的模式**。压缩算法的目标是通过使用更少的位来表示相同的信息，从而减小文件的体积。

- 重复数据的检测和消除： 压缩算法会识别并删除文件中的重复数据片段，以减小文件大小。

- 霍夫曼编码： 通过使用频率较高的符号的短编码，减小整体文件的大小。

- LZ77 算法： 通过指向先前出现的数据片段的指针，而不是重复存储相同的片段，实现数据的更有效存储。

## Gzip 在 web 中的优势

Gzip 在 Web 中的优势主要体现在减小文件大小、提高页面加载速度以及降低带宽占用，从而加速资源传输。

### 减小文件大小

1. 压缩文本内容：**HTML、CSS、JavaScript 等文本文件中通常存在大量的重复信息和空白字符**。Gzip 通过使用压缩算法，如 DEFLATE，来消除这些冗余信息，使文本文件更紧凑，从而减小文件大小。

2. 优化图像： 尽管 Gzip 主要用于文本内容的压缩，但在一些情况下也可以与其他压缩技术结合使用，例如图片压缩。当服务器启用 Gzip 压缩时，通常也会对图像文件使用更高效的压缩算法，以进一步减小图像文件的大小。

### 提高页面加载速度

1. 减少传输时间： 较小的文件大小意味着数据可以更快地从服务器传输到客户端。当浏览器请求页面资源时，较小的文件将更快地到达用户终端，从而提高页面加载速度。

2. 加快渲染时间： 页面加载速度不仅取决于文件传输的速度，还取决于浏览器加载和渲染这些文件的速度。由于文件更小，浏览器可以更快地解析和渲染页面，提高用户体验。

## 服务器端如何开启 Gzip

在服务器端配置 Gzip 压缩涉及两个主要方面：启用 Gzip 压缩和配置服务器以识别支持 Gzip 的浏览器。

### Nginx

在 Nginx 服务器上，可以使用 gzip 模块来启用 Gzip 压缩。在配置文件中添加以下配置：

```nginx
gzip on;
gzip_types text/html text/plain text/xml text/css text/javascript application/javascript application/x-javascript application/json;

```

配置服务器以识别支持 Gzip 的浏览器：

```nginx

gzip_proxied any;

```

此配置告诉 Nginx 在检查 Accept-Encoding 头时考虑任何代理服务器的值。

### Nodejs

nodejs 中使用 compression 中间件来开启 Gzip 压缩

示例代码如下：

```js
const express = require("express");
const compression = require("compression");
const fs = require("fs");

const app = express();
const port = 3000;

// Use compression middleware only for the /gzip route
app.use("/gzip", compression());

app.get("/", (req, res) => {
  // Return the non-Gzip version
  res.sendFile("public/index.html", { root: __dirname });
});

app.get("/gzip", (req, res) => {
  // Return the Gzip version
  res.sendFile("public/index.html", { root: __dirname });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```
