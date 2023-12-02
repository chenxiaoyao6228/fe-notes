## 前言

本文总结同源策略以及跨域相关的知识。

## 为什么要有同源策略?

原因是 web 太开放，我们可以随意引入三方资源，如果没有同源策略，那么三方资源可以随意访问我们的资源，这样就会造成安全问题。

比如我们打开了银行站点，然后又打开了一个恶意网站，如果没有同源策略，那么恶意网站就可以做以下事情:

- 修改 DOM 以及样式信息，诱导用户点击
- 通过 js 访问 cookie、indexedDB、localStorage、sessionStorage 等
- 劫持用戶登录的用戶名和密码, 上传到自己的服务器
- ...

## 什么是同源/同源策略

鉴于以上考虑，浏览器就有了同源策略

> 一个源内的脚本仅仅具有本源内资源的权限，而无法访问其它域的资源。

这里的同源指的是: **同协议 + 同域名 + 同端口**， 比如下面这两个 URL,`my-product.com`,以及相同的端口 443,所以我们就说这两个 URL 是同源的。

> https://my-product.com/?type=0 > https://my-product.com/?type=1

同源策略限制了以下几种行为:

1. DOM 和 JS 对象无法获得

2. Cookie、LocalStorage 和 IndexDB 无法读取

3. AJAX/Fetch 请求不能发送

## 安全与自由的取舍

但这样带来的问题就是： 大型项目的资源都是部署在 CDN 上的，比如项目的域名是 https:// my-product.com, cdn 的地址为https://my-cdn.com，如果不允许跨域，那么就会造成很大的不便.

所以浏览器在安全性和可用性之间做了取舍，

1. (针对 DOM 和 JS 对象无法获得)允许 img、script、style 标签进行跨域引用资源。**所以你可以看到，一张跨域的图片，可以通过 img 标签引入，但是无法通过 ajax 进行请求其数据，也无法通过 canvas 获取图片数据(在前端截图的时候会遇到这样的坑)**

2. (针对 2.3)通过 CROS(Cross-origin resource sharing)来解决跨域问题

## 跨域解决方案

跨域解决方案有很多：

- CORS（Cross-origin resource sharing）
- 通过 jsonp 跨域
- nginx 代理跨域
- document.domain + iframe 跨域
- location.hash + iframe
- window.name + iframe 跨域
- postMessage 跨域
- WebSocket 协议跨域

这里只挑选几个常用的进行介绍

### CORS(最常用)

> CORS 是一个 W3C 标准，全称是"跨域资源共享"（Cross-origin resource sharing）它允许浏览器向跨源服务器，发出 XMLHttpRequest 请求，从而克服了 AJAX 只能同源使用的限制。

有几点需要注意:

- 跨域 AJAX 请求是请求发出去了，但是被浏览器拦截了，所以跨域的请求是可以在浏览器的网络面板里面看到的，但是无法获取到数据。

- CORS 的原理: **使用自定义的 HTTP 头部让浏览器与服务器进行沟通，从而决定请求或响应是应该成功，还是应该失败**。

对于跨域请求，浏览器分成两种情况:

#### 简单请求： 浏览器直接发出 CORS 请求。

简单请求包括以下两种情况：

- 请求方法是以下三种方法之一：
  - HEAD
  - GET
  - POST
- HTTP 的头信息不超出以下几种字段：
  - Accept
  - Accept-Language
  - Content-Language
  - Last-Event-ID
  - Content-Type：只限于三个值 application/x-www-form-urlencoded、multipart/form-data、text/plain

#### 非简单请求：

非简单请求是那种对服务器有特殊要求的请求：

- 请求方法是 PUT 或 DELETE
-  Content-Type 字段的类型是 application/json。

对于复杂的跨域请求（例如使用自定义请求头或非简单请求方法），浏览器会首先会自动添加一些附加的头信息，发送一个预检请求（Preflight Request），使用 OPTIONS 方法来检查服务器是否允许实际请求，这一切都是浏览器自动完成，不需要用户参与。对于开发者来说，CORS 通信与同源的 AJAX 通信没有差别，代码完全一样。浏览器一旦发现 AJAX 请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。(**因为是新规范，所以过于老旧的浏览器会不支持**)。服务器需处理这个预检请求并在响应头中提供相应的信息

client 代码如下:

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CORS 示例</title>
  <style>
    #result-container{
        margin-top: 30px;
    }
  </style>
</head>
<body>

<h1>CORS 示例</h1>
<button onclick="fetchData('GET')">发送 GET 请求</button>
<button onclick="fetchData('POST')">发送 POST 请求</button>

<ul id="result-container"></ul>

<script>
  // 发起支持 CORS 的 GET 或 POST 请求的函数
  function fetchData(method) {
    const url = 'http://localhost:3000/api/data';

    fetch(url, {
      method: method,
      // get 请求不设置header，简单请求示例
      headers: method === 'POST' ?{
        'Content-Type': 'application/json',
        'Custom-Header': 'Custom-Value',
      }: {},
      credentials: 'include', // 包括凭证（cookies）
      body: method === 'POST' ? JSON.stringify({ key: 'value' }) : undefined,
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      displayResult(data);
    })
    .catch(error => {
      console.error('发生错误:', error);
      displayResult({ error: '请求失败' });
    });
  }

  // 在页面上显示结果的函数
  function displayResult(data) {
    const resultContainer = document.getElementById('result-container');
    const resultItem = document.createElement('li');
    resultItem.textContent = JSON.stringify(data);
    resultContainer.appendChild(resultItem);
  }
</script>

</body>
</html>
```

server 代码如下

```js
const express = require("express");
const app = express();
const PORT = 3000;

// 中间件处理 CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5502"); // 更新为你的客户端的域
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Custom-Header");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// 处理 CORS 启用的 GET 请求的路由
app.get("/api/data", (req, res) => {
  res.json({ data: "来自服务器的问候！" });
});

app.post("/api/data", (req, res) => {
  res.json({ data: "来自服务器的 POST 数据！" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```


可以看到，对于简单的get请求，没有发起预检请求，直接返回了数据，但是对于复杂的请求，还是会发起预检请求

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/cors-request-demo.png)


查看示例代码请点击[此处](./_demo/same-origin/cors/client.html)

上述代码有一个问题就是，每次请求都会发送一个预检请求，这样就会造成性能问题，所以对于复杂请求，我们需要在服务端设置对应的响应头，告诉浏览器，这个请求是允许的，不需要再发送预检请求了

```js
res.header("Access-Control-Max-Age", "86400"); // 24小时
```

可以看到，在设置了对应的响应头之后，再次发送请求，就不会发送预检请求了

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/cors-request-demo-2.png)


#### cookie携带

另外，对应跨域请求， 如果要携带 cookie,

则需要在xhr设置 withCredentials 为 true
```js
xhr.withCredentials = true
```
同时，服务端也需要设置对应的响应头
```js
res.header("Access-Control-Allow-Credentials", "true");
```

### jsonp

jsonp(json with padding, 忽略这个不知所谓的全称),是一种**利用 script 等标签没有跨域限制**进行第三方通讯的技术。

基本实现思路: **动态的创建 script 元素，拼接传入的参数生成 url 字符串,然后通过 src 属性去加载数据，通过 callback 这个回调方法来返回服务器数据，然后再把 script 标签移除**。换成代码就是

```html
<script>
  // 这里的handleResponse函数是后端返回的数据的回调函数
  function handleResponse(data) {
    console.log(data);
    document.body.innerHTML = `<h1>返回的数据：${JSON.stringify(data)}</h1>`;
  }

  var script = document.createElement("script");
  script.src = "http://localhost:3333/api/jsonp?callback=handleResponse";
  document.body.appendChild(script);
</script>
```

对应的服务端(nodejs)代码如下:

```js
const express = require("express");
const app = express();

// 路由，用于处理JSONP请求
app.get("/api/jsonp", (req, res) => {
  const callbackFunction = req.query.callback;
  const data = { message: "Hello, JSONP!" };

  // 将数据包装在回调函数中返回
  if (callbackFunction) {
    res.send(`${callbackFunction}(${JSON.stringify(data)})`);
  } else {
    res.json(data);
  }
});

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy
- https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request
- https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS#Preflighted_requests
- https://juejin.im/post/5c9c38e2e51d452db7007f66
