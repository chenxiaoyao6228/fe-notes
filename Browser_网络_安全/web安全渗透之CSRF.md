## 前言

本文将介绍 web 安全中的 CSRF 攻击


> 本节对应的代码在`_demo/csrf`目录下


## 什么是 CSRF？

CSRF，全称 Cross-Site Request Forgery，中文翻译为跨站请求伪造，是一种网络攻击方式。它利用用户在已登录的情况下对应用程序的信任，通过伪装成用户发起的请求来执行未经授权的操作。攻击者通过引诱用户访问恶意网站或点击包含恶意代码的链接，从而在用户在其他网站上已经登录的情况下，以用户身份向目标网站发送恶意请求。

简单来讲,**CSRF攻击就是黑客利用了用戶的登录状态,并通过第三方的站点来做一些坏事**

举个例子，我们有一个转账服务如下, 已知其存在csrf问题

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
![](../../cloudimg/2023/cat-movie-risk-page.png)


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
当用户点击上面的猫片网站，就会向转账服务后台发起一个post请求

![](../../cloudimg/2023/cat-movie-risk-page-click-response.png)


到这里,相信你已经知道什么是CSRF攻击了。**和XSS不同的是,CSRF攻击不需要将恶意代码注入用戶的⻚面,仅仅是利用服务器的漏洞和用戶的登录状态来实施攻击**

## CSRF攻击的必要条件

- 目标站点有CSRF漏洞(比如上面转账服务**localhost:4000**)
- 用户登录过该站点，保留了登录态
- 用户点击了有风险的链接(比如上面的猫片网站**localhost:3000**)


对于开发人员来说，最重要的是解决好自己站点的 CSRF 漏洞，避免为客户埋坑

## 如何预防

### 利用Cookie的sameSite属性

### 验证请求的站点来源

###  添加 anti csrf-token
