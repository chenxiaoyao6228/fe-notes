## 前言

本文总结 Content-type 相关的知识

> 本节对应的代码在`_demo/content-type`下

## MIME-type

MIME（Multipurpose Internet Mail Extensions）类型, 现在称为"媒体类型 (media type)", 最初用于电子邮件系统，后来扩展到了 HTTP 协议, 是一种标识在互联网上传输的文件类型的标准。每种文件类型都被分配了一个唯一的 MIME 类型，这有助于浏览器和其他应用程序正确地解释和显示文件。

MIME 类型通常由两部分组成：**主类型和子类型，之间用斜杠分隔**。主类型表示文件的大类别，而子类型表示具体的文件类型。例如，text/html 中，text 是主类型，html 是子类型。

常见的类型如下:

| MIME 类型                                                               | 文件类型                  |
| ----------------------------------------------------------------------- | ------------------------- |
| text/plain                                                              | 纯文本文档                |
| text/html                                                               | HTML 文档                 |
| application/json                                                        | JSON 数据                 |
| application/xml                                                         | XML 文档                  |
| image/jpeg                                                              | JPEG 图像                 |
| image/png                                                               | PNG 图像                  |
| audio/mpeg                                                              | MPEG 音频                 |
| video/mp4                                                               | MPEG-4 视频               |
| application/pdf                                                         | Adobe PDF 文档            |
| application/msword                                                      | Microsoft Word 文档       |
| application/vnd.openxmlformats-officedocument.wordprocessingml.document | Word 文档（OpenXML 格式） |

上述只是一小部分常见的 MIME 类型，实际上有数百种 MIME 类型，完整的表格可以在[这里查看](https://www.iana.org/assignments/media-types/media-types.xhtml)

## Content-type

Content-Type 是 HTTP 请求头部的一个字段，用于指示实体正文的媒体类型。客户端和服务器通过 Content-Type 来确定如何解析和处理请求或响应中的数据。

> Content-Type: text/html; charset=utf-8
> Content-Type: multipart/form-data; boundary=something
> Content-Type: multipart/form-data; boundary=something

| 指令       | 作用                                                            | 示例                                                                    |
| ---------- | --------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `charset`  | 指定文本字符集，定义文本数据的编码方式。                        | `Content-Type: text/html; charset=utf-8`                                |
| `boundary` | 用于`multipart`类型，指定分隔多部分消息中各个部分的边界字符串。 | `Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryXYZ` |
| `type`     | 用于指定资源的子类型，通常与`application`类型一起使用。         | `Content-Type: application/json; type=entry`                            |
| `format`   | 用于指定资源的格式，通常与`application`类型一起使用。           | `Content-Type: application/ld+json; format=application/ld+json`         |
| 默认值     | 如果未指定，将使用默认值。                                      | `Content-Type: text/html`（未指定字符集时，默认使用 ISO-8859-1）        |

## Accept

Accept 也是 HTTP 请求头部的一个字段，用于指示客户端期望接收的媒体类型（Content-Type）和字符集。通过这个头部，客户端可以告诉服务器它可以处理哪些类型的响应数据。

Accept 头部的一般结构如下：

> Accept: media_type[, media_type, ...]

其中 media_type 可以是一个媒体类型，也可以是一个媒体类型与其相应的优先级（权重）的组合，例如：

> Accept: text/html, application/xhtml+xml, application/xml;q=0.9, _/_;q=0.8

在这个例子中，客户端表示它可以接受 HTML、XHTML 和 XML 格式的数据，其中 XML 类型的数据的权重值稍低，最后的 _/_ 表示对所有类型的数据都可以接受，但权重值更低。

## 请求中的 Content-Type

### 表单提交

表单提交是 Web 开发中常见的数据传输方式, Content-Type 通常为 application/x-www-form-urlencoded 或 multipart/form-data.

```html
<form
  action="/submit"
  method="post"
  enctype="application/x-www-form-urlencoded"
>
  <label for="username">Username:</label>
  <input type="text" id="username" name="username" />
  <input type="submit" value="Submit" />
</form>
```

### 文件上传

```html
<form action="/upload" method="post" enctype="multipart/form-data">
  <input type="file" name="file" />
  <input type="submit" value="Upload" />
</form>
```

### Ajax 请求

在 Ajax 请求中，开发者可以明确指定请求的 Content-Type，通常使用 application/json

```js
var xhr = new XMLHttpRequest();
xhr.open("POST", "/api", true);
xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
var data = JSON.stringify({ key: "value" });
xhr.send(data);
```

对应到 Axios 的用法

```js
const axios = require("axios");
axios
  .post(
    "/api",
    { key: "value" },
    { headers: { "Content-Type": "application/json" } }
  )
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

## 响应中的 Content-Type

### 文件下载

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/http-file-download-header.png)

HTML 中文件下载流程如下：

**1.前端发起下载请求**

前端通过创建一个<a>标签或使用 JavaScript 发送 HTTP 请求，请求服务器提供文件下载。

```js
const xhr = new XMLHttpRequest();
xhr.open("GET", "/download", true);
xhr.responseType = "blob"; // 指定响应类型为二进制数据
xhr.onload = function () {
  const blob = new Blob([xhr.response], {
    type: "application/octet-stream",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "exmaple.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
xhr.send();
```

> PS: 当使用 `<a>` 标签下载文件时，浏览器通常会执行一个导航而不是发起普通的 HTTP 请求。这种方式的下载通常被称为“导航下载”（Navigation Download），它通过修改当前页面的 URL 来下载文件，而不是通过 XHR 或 Fetch API 发起普通的 HTTP 请求。因此，这种方式不会在浏览器的网络控制面板中显示对文件的明显 HTTP 请求

**2.服务器响应**
 
服务器接收到下载请求后，会返回文件的相应内容。

Content-Type 头部： Content-Type 头部定义了响应体的媒体类型。对于文件下载，正确设置 Content-Type 是确保浏览器能正确解析文件的关键。

> Content-Type: application/octet-stream



具体的 Content-Type 可以根据下载文件的类型而变化，例如对于 **图片可以是 image/jpeg、对于文本文件可以是 text/plain** 等

下载 excel:

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/http-content-type-download-excel.png)

下载文本:

Content-Disposition 头部： 服务器通常会设置 Content-Disposition 头部，该头部告诉浏览器如何处理响应数据。在文件下载的场景中，

**Content-Disposition 可以指定文件名和是否将文件直接显示在浏览器中还是下载到本地**

将 text 文件通过`attachment`附件的形式下载到本地

> Content-Disposition: attachment; filename="filename.txt"

在线预览 pdf

> Content-Disposition: inline; filename=example.pdf

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/http-content-disposition-inline-firefox.png)

经测试(不同浏览器实现不一致，chrome表现为下载，firefox则为预览)

> PS2: 有时候会看到服务器没有明确设置 Content-Type 为 application/octet-stream，但文件仍然能够成功下载。这是因为浏览器通常会根据文件的扩展名或文件内容来猜测正确的 Content-Type。

## 参考

- https://developer.mozilla.org/zh-CN/docs/Glossary/MIME_type
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
- https://www.rfc-editor.org/rfc/rfc9110#field.content-type
