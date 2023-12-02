## 前言

XSS是跨站脚本攻击(Cross Site Scripting)的简称，为了和CSS区分，所以简称为XSS。XSS是一种常见的web安全漏洞，它允许攻击者将恶意代码植入到提供给其它用户使用的页面中。可以进行**获取用户cookie，监听用户信息，生成恶意广告**等。

比如下面的代码，用户页面被注入了一段`<script>alert("XSS攻击")</script>`，那么用户打开就会弹出一个对话框，这就是XSS攻击。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>XSS示例</title>
  </head>
  <body>
    <h1>XSS示例</h1>
    <p>
      你好
      <script>
        alert("XSS攻击");
      </script>
    </p>
  </body>
</html>

```

## XSS攻击的分类

根据恶意脚本的注入方式，XSS攻击可以分为三类：存储型XSS、反射型XSS和DOM型XSS。


### 存储型XSS

存储型XSS（Stored XSS）是一种跨站脚本攻击，其中恶意脚本被注入到Web应用程序的数据库中，然后由服务器提供给用户。这种类型的攻击可以对所有访问受感染数据的用户造成影响，而不仅仅是诱使用户点击包含恶意代码的特制链接的用户。

举个例子，假设你是一个问答社区的作者，你在文章发布页面输入了一段代码`<script>alert("XSS攻击")</script>`，然后点击发布，此时你的文章就会提交到服务器，

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/xss-store-1.png)

当用户访问这个页面时，服务器会将这段代码原封不动的返回给用户，用户的浏览器会将这段代码当做html代码解析，从而执行了这段代码，弹出了一个对话框。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/xss-store-2.png)

对应相应的代码在`_demo/xss/store`目录下


### 反射型XSS

反射性XSS（Reflected XSS）是一种跨站脚本攻击，其中恶意脚本被注入到Web应用程序的URL或其他输入字段中，然后由服务器反射（回显）到用户的浏览器。攻击者通常通过诱使用户点击包含恶意代码的特制链接来触发这种类型的攻击。

比如下面的代码，允许用户输入，然后将用户输入的内容显示在页面上。

```js

const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const query = parsedUrl.query.q || '';
  
  if (req.url.startsWith('/search')) {
    const html = `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>XSS 演示</title>
      </head>
      <body>
        <h1>搜索结果</h1>
        <p>您搜索的内容：${query}</p>
      </body>
      </html>
    `;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`服务器正在运行：http://localhost:${port}`);
});
```

可以看到，当用户搜索`<script>alert("XSS攻击")</script>`时，服务器会将这段代码原封不动的返回给用户，用户的浏览器会将这段代码当做html代码解析，从而执行了这段代码，弹出了一个对话框。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/xss-reflect-1.png.png)

另外需要注意的是,Web服务器不会存储反射型XSS攻击的恶意脚本,这是和存储型XSS攻击不同的地方

对应相应的代码在`_demo/xss/reflect`目录下

### DOM型XSS

基于 DOM型XSS（DOM-based XSS）是一种跨站脚本攻击，其中恶意脚本是由浏览器在解析包含它们的页面时动态生成的。这种类型的攻击不会被服务器检测到或存储，而是作为浏览器端的一种活动，因此它通常被称为一种类型的非持久性攻击。


## 如何防范XSS

- 对用户输入的数据进行过滤，对特殊字符进行转义
- 充分利用CSP,设置合理的白名单
- 对cookie设置httpOnly属性，禁止js操作cookie

### 输入过滤

不管是反射型还是存储型XSS攻击,我们都可以在服务器端将一些关键的字符进行转码,比如`<`转码为`&lt;`，`>`转码为`&gt;`，这样就可以防止恶意代码被执行了。

比如用户输入了一段代码`<script>alert("XSS攻击")</script>`，经过转义后的代码就变成了`&lt;script&gt;alert("XSS攻击")&lt;/script&gt;`，这样就不会被浏览器当做html代码解析了，也就可以防止恶意代码被执行了。

现代框架比如React，Vue等都会对用户输入的内容进行转码，所以在使用这些框架的时候，我们就不用担心XSS攻击了。

### CSP

虽然在服务器端执行过滤或者转码可以阻止 XSS 攻击的发生,但完全依靠服务器端依然是不够的,我们还需要把CSP等策略充分地利用起来, 以降低XSS攻击带来的⻛险和后果。

实施严格的CSP可以有效地防范XSS攻击,具体来讲CSP有如下几个功能:

- 禁止加载外部脚本
- 禁止想外部URL发送数据
- 禁止加载未授权的内联脚本和样式

### 使用httpOnly

http-only是cookie的一个属性,如果设置了http-only,那么通过js就无法获取到cookie的值,这样就可以防止XSS攻击者通过js获取到用户的cookie,从而防止XSS攻击者盗取用户的cookie。

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP