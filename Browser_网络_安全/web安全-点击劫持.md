## 点击劫持

点击劫持（Clickjacking）是一种具有潜在威胁的网络安全攻击，其特点在于攻击者通过透明的 iframe 或其他页面元素欺骗用户，使其在不知情的情况下点击网页上的某个区域，从而执行一些恶意操作。这种攻击可以导致用户执行不希望的操作，可能包括操纵用户账户、点击恶意链接等。

## 攻击原理

点击劫持攻击的原理基于将目标网站嵌套在一个透明的 iframe 中，并将该 iframe 放置在一个看似无害的网页上。用户在访问这个看似正常的页面时，实际上在不知情的情况下点击了嵌套的 iframe 中的内容。这使得攻击者能够利用用户的点击行为执行恶意操作。

具体步骤：

- 创建恶意页面： 攻击者创建一个包含 iframe 的恶意网页，将目标网站嵌套在其中。
- 引诱用户访问： 攻击者将恶意页面传播给用户，可能通过钓鱼链接、社交媒体等方式引导用户访问。
- 用户无感知点击： 用户在恶意页面上进行点击，实际上是点击了嵌套的 iframe 中的内容，触发了恶意操作。
- 执行攻击： 攻击者可能利用用户的点击执行一系列操作，例如修改用户账户信息、发起资金转账等。

举个例子，假设有一个攻击者想要攻击的源网站页面

```html
<html>
  <head>
    <style>
      button {
        width: 300px;
        height: 300px;
      }
    </style>
  </head>
  <body>
    <h1>源页面</h1>
    <button onclick="performAction()">点击执行转账操作</button>
    <script>
      function performAction() {
        alert("执行了源页面的转账操作！");
      }
    </script>
  </body>
</html>
```

攻击者有一个猫片网站，往源页面里面套了一个 iframe，然后在猫片网站里面放了一个诱导用户点击的图片， 按钮的样式和源页面的按钮一样

```html
<html>
  <head>
    <style>
      iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
      }
    </style>
  </head>
  <body>
    <h1>伪造的页面，页面中有一个透明的iframe装载目标页面</h1>
    <img width="300" height="300" src="${imagePath}" alt="美女图片" />
    <!-- 目标页面 -->
    <iframe
      src="http://localhost:3000/source"
      style="opacity: 0; border: 1px solid red;"
    ></iframe>

    <script>
      // 模拟恶意操作
      window.onload = function () {
        const iframe = document.querySelector("iframe");
        const button = iframe.contentDocument.querySelector("button");
        button.click();
      };
    </script>
  </body>
</html>
```

演示的效果如下：

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/risk-page-click-hiject.gif)

## 防范点击劫持的方法

使用 X-Frame-Options 头部是一种简单而有效的防范点击劫持的方法。该头部可以指定浏览器是否允许将页面嵌套在 iframe 中。

- X-Frame-Options: DENY：禁止页面被嵌套在任何 iframe 中。
- X-Frame-Options: SAMEORIGIN：只允许页面被嵌套在相同域的 iframe 中。

以 express 为例，设置 X-Frame-Options 头部的代码如下：

```js
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY"); // 或者使用 'SAMEORIGIN'
  next();
});
```

设置成功之后，再次访问页面，可以看到 iframe 页面请求头里面有 X-Frame-Options: DENY 的头部：

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/risk-page-click-hiject-x-frame-option.png)

打开控制台，可以看到浏览器已经禁止了页面被嵌套在 iframe 中

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/risk-page-click-hiject-x-frame-option-browser-block.png)

## more

> ps: X-Frame-Options [目前已由 CSP frame-ancestors 指令取代](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options), 具体笔者相关的 [CSP 文章](https://github.com/chenxiaoyao6228/fe-notes/blob/main/Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8/web%E5%AE%89%E5%85%A8-%E5%86%85%E5%AE%B9%E5%AE%89%E5%85%A8%E7%AD%96%E7%95%A5CSP.md)

> 对应相应的代码在`_demo/click-hiject`目录下
