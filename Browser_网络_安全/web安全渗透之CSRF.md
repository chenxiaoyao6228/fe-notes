## 前言

本文将介绍 web 安全中的 CSRF 攻击

> 本节对应的代码在`_demo/csrf`目录下

## 什么是 CSRF？

CSRF，全称 Cross-Site Request Forgery，中文翻译为跨站请求伪造，是一种网络攻击方式。它利用用户在已登录的情况下对应用程序的信任，通过伪装成用户发起的请求来执行未经授权的操作。攻击者通过引诱用户访问恶意网站或点击包含恶意代码的链接，从而在用户在其他网站上已经登录的情况下，以用户身份向目标网站发送恶意请求。

简单来讲,**CSRF 攻击就是黑客利用了用戶的登录状态,并通过第三方的站点来做一些坏事**

举个例子，我们有一个转账服务如下, 已知其存在 csrf 问题

```js
transferApp.post("/transfer", (req, res) => {
  const { toAccount, amount } = req.body;

  // 模拟复杂的转账逻辑，此处只是简单的演示
  if (toAccount === "receiver" && amount === "100") {
    res
      .status(200)
      .send(
        `转账服务: localhost:${transferServicePort}, 转账成功, 金额为 ${amount}`
      );
  } else {
    res.status(400).send("转账失败，收款账户或金额错误");
  }
});
```

同时我们有一个钓鱼的猫片网站
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/cat-movie-risk-page.png)

具体代码是这个样子:

```html
<html>
  <body>
    <h1>有风险的页面</h1>
    <img
      width="300"
      height="300"
      src="${imagePath}"
      alt="美女图片"
      onclick="sendAjaxRequest('${csrfToken}')"
    />

    <script>
      function sendAjaxRequest(csrfToken) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:4000/transfer", true);
        xhr.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
        xhr.setRequestHeader("CSRF-Token", csrfToken); // 添加CSRF token到请求头

        // 构造POST请求的参数，这里可以根据需要修改
        const params = "toAccount=receiver&amount=100";

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              window.alert(xhr.responseText);
            } else {
              window.alert(xhr.responseText);
            }
          }
        };

        xhr.send(params);
      }
    </script>
  </body>
</html>
```

当用户点击上面的猫片网站，就会向转账服务后台发起一个 post 请求

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/cat-movie-risk-page-click-response.png)

到这里,相信你已经知道什么是 CSRF 攻击了。 **和 XSS 不同的是,CSRF 攻击不需要将恶意代码注入用戶的⻚面,仅仅是利用服务器的漏洞和用戶的登录状态来实施攻击**

## CSRF 攻击的必要条件

- 目标站点有 CSRF 漏洞(比如上面转账服务**localhost:4000**)
- 用户登录过该站点，保留了登录态
- 用户点击了有风险的链接(比如上面的猫片网站**localhost:3000**)

对于开发人员来说，最重要的是解决好自己站点的 CSRF 漏洞，避免为客户埋坑

## 如何预防 CSRF 攻击

经过上面的解释你大概知道黑客利用的是

### 利用 Cookie 的 sameSite 属性

使用 Cookie 的 SameSite 属性是一种有效的方式来预防 CSRF 攻击。SameSite 属性用于限制第三方站点对用户 Cookie 的访问，从而减少 CSRF 攻击的风险。SameSite 有三个可能的值：

- Strict（严格）： 如果设置为 Strict，那么在任何情况下都不会发送 Cookie，即使是同站请求也不会发送。

- Lax（宽松）： 如果设置为 Lax，那么在导航到目标网址的情况下，从第三方站点发起的 POST 请求将不会携带 Cookie。导航是指用户点击链接，或在地址栏中输入网址。

- None（无）： 如果设置为 None，Cookie 将在所有情况下都被发送，即使是跨站请求也会发送。

在预防 CSRF 攻击的场景中，通常将 SameSite 设置为 Strict 或 Lax，以限制第三方站点对用户 Cookie 的访问。

```js
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.get("/", (req, res) => {
  // 设置 Cookie，并将 SameSite 属性设置为 Lax
  res.cookie("token", "myValue", { sameSite: "Lax" });
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

被标注为 lax 的 cookie 在跳转到新页面时可以带上。因为如果全部设置为 strict，在百度搜索并打开淘宝，默认是没有登录的，用户体验会很差。

> TODO: 统一登录遇到了这个问题，待记录

### 验证请求的站点来源

```js
app.use((req, res, next) => {
  const origin = req.get("Origin");
  const referer = req.get("Referer");

  // 你可以根据实际需求进行 Origin 和 Referer 的验证逻辑
  if (
    origin &&
    origin === "https://www.yourtrustedwebsite.com" &&
    referer &&
    referer.startsWith("https://www.yourtrustedwebsite.com")
  ) {
    next(); // 合法的来源，继续处理请求
  } else {
    res.status(403).send("Invalid request origin or referer"); // 不合法的来源，拒绝请求
  }
});
```

在实际应用中，可能需要使用白名单来允许特定来源, 一般来说,我们会将白名单放在配置文件中， 比如笔者项目内用到了`eggjs`, 就支持了这样的配置

```js
const allowOriginKeywords = ["xxx"];

config.cors = {
  credentials: true, //发送cookie
  allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH", //允许的请求方法
  origin: (ctx: any) => {
    const origin = ctx.get("origin");
    if (allowOriginKeywords.some((key) => origin.indexOf(key) > -1)) {
      return origin;
    }
    return false;
  },
};
```

### 添加 anti csrfToken

还是上面的例子，这次在用户登录的时候，服务端会生成一个 csrfToken,并将其存储在 cookie 中，同时将其注入到模板中，用于表单中的隐藏字段, 用户提交的时候，服务端会验证 csrfToken 的合法性

```js
function generateCsrfToken() {
  // 这里简单地生成一个随机字符串作为 CSRF Token
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// 存储 CSRF Token 的对象
const csrfTokens = {};

// 模拟处理转账请求的接口 - 同时支持 Anti CSRF Token
transferApp.post("/transfer-ant-csrf-token", (req, res) => {
  const { toAccount, amount, csrfToken } = req.body;

  // 验证CSRF token
  if (!csrfToken || csrfTokens[csrfToken] !== true) {
    return res.status(403).send("Invalid CSRF token");
  }

  // 模拟复杂的转账逻辑，此处只是简单的演示
  if (toAccount === "receiver" && amount === "100") {
    res.status(200).send("转账成功");
  } else {
    res.status(400).send("转账失败，收款账户或金额错误");
  }
});

// 中间件：生成并存储 CSRF Token
transferApp.use((req, res, next) => {
  const csrfToken = generateCsrfToken();
  csrfTokens[csrfToken] = true;

  // 将 CSRF Token 存储在 Cookie 中，以便在客户端访问
  res.cookie("csrfToken", csrfToken, { httpOnly: true });

  // 将 CSRF Token 注入到模板中，用于表单中的隐藏字段
  res.locals.csrfToken = csrfToken;

  next();
});
```

## 参考

- [eggjs-安全，有关于不同种类的网络攻击比较全面的介绍](https://www.eggjs.org/zh-CN/core/security)
