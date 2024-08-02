## 前言

本文主要总结内容安全策略（Content Security Policy，CSP）相关的知识点

## 什么是内容安全策略

通过前面几篇文章的学习，我们知道浏览器在“安全”与“便利”间进行了取舍，而⻚面安全问题的主要原因就是浏览器为同源策略开的两个“后⻔”:

- ⻚面中可以任意引用第三方资源
- 通过 CORS 策略让 XMLHttpRequest 和 Fetch 去跨域请求资源。

为了检测并削弱某些特定类型的攻击，包括跨站脚本（XSS）和数据注入攻击等，web 设计了内容安全策略(CSP)

**CSP 的核心思想是将选择权交给了开发者， 通过白名单机制，限制页面中可以执行的内容。**

CSP 通过 HTTP 头部或 HTML 元标签进行声明。

1. HTTP 头部声明：

在 HTTP 响应头中添加 Content-Security-Policy 字段。

```http
Content-Security-Policy: directive1 value1; directive2 value2;
```

其中 directive 是 CSP 的指令，value 是指定的规则或内容。

2. HTML 元标签声明：

在 HTML 页面的 <head> 部分添加 <meta> 标签。

```html
<meta
  http-equiv="Content-Security-Policy"
  content="directive1 value1; directive2 value2;"
/>
```

比如下列的指令限定了默认只能加载同源的内容，允许从 https://cdn.jsdelivr.net 加载脚本，从 https://cdn.jsdelivr.net 加载样式

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' https://cdn.jsdelivr.net;"
/>
```

而从`https://cdnjs.cloudflare.com`加载的文件就会报下面的错误

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/content-security-policy-1.png)

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Browser_网络_安全/_demo/csp/1.html), 查看示例代码请点击[此处](https://github.com/chenxiaoyao6228/fe-notes/blob/main/Browser_网络_安全/_demo/csp/1.html)


## CSP指令详解


### 指令的分类

常见 CSP 指令分为两类：资源加载指令和行为控制指令。

1. 资源加载指令：

| 指令            | 作用                                   | 用法示例                                          |
|-----------------|----------------------------------------|--------------------------------------------------|
| `default-src`    | 默认内容加载策略                       | `default-src 'self';` 允许加载同一源的所有内容      |
| `script-src`     | 控制脚本文件的加载                     | `script-src 'self' https://trusted-scripts.com;`   |
| `style-src`      | 控制样式文件的加载                     | `style-src 'self' https://trusted-styles.com;`     |
| `img-src`        | 控制图片的加载                         | `img-src 'self' data: https://trusted-images.com;`|
| `connect-src`    | 控制连接的加载（XHR、WebSocket等）     | `connect-src 'self' https://api.example.com;`      |
| `font-src`       | 控制字体文件的加载                     | `font-src 'self' https://trusted-fonts.com;`       |
| `media-src`      | 控制音频和视频文件的加载               | `media-src 'self' https://trusted-media.com;`     |
| `object-src`     | 控制 `<object>` 元素的加载             | `object-src 'none';` 不允许加载任何 `<object>` 元素|
| `frame-src` 或 `child-src` | 控制 `<frame>` 或 `<iframe>` 元素的加载 | `frame-src 'self' https://trusted-frames.com;`   |
| `form-action`    | 控制表单提交的位置                     | `form-action 'self' https://trusted-form-endpoint.com;`|


2. 行为控制指令：

| 指令                    | 作用                                               | 用法示例                                                      |
|-------------------------|----------------------------------------------------|--------------------------------------------------------------|
| `script-src`            | 控制脚本文件的加载，可影响脚本的执行              | `script-src 'self' 'nonce-value' 'unsafe-inline' 'strict-dynamic';` |
| `frame-ancestors`       | 控制嵌入的外部资源的嵌套显示                    | `frame-ancestors 'self' https://trusted-parent.com;`        |
| `base-uri`              | 限制页面的基本 URL                                | `base-uri 'self';` 只允许基本 URL 来自同一源                    |
| `sandbox`               | 为页面创建沙盒环境，限制某些行为                  | `sandbox allow-scripts allow-same-origin;` 允许脚本，同一源  |
| `upgrade-insecure-requests` | 强制升级 HTTP 请求为 HTTPS 请求               | `upgrade-insecure-requests;`                                  |
| `report-uri` 或 `report-to` | 报告违规行为的地址                             | `report-uri /report-endpoint;` 将报告发送到指定地址              |


### default-src

- 作用： 指定默认内容加载策略，适用于未覆盖的其他指令。
- 用法示例： default-src 'self'; 允许加载来自同一源（即当前域）的所有内容。

### script-src

- 作用： 控制脚本文件的加载。
- 用法示例： script-src 'self' https://trusted-scripts.com; 允许加载同一源的脚本以及从 https://trusted-scripts.com 加载的脚本。

###  style-src

- 作用： 控制样式文件的加载。
- 用法示例： style-src 'self' https://trusted-styles.com; 允许加载同一源的样式以及从 https://trusted-styles.com 加载的样式。

### frame-src 或 child-src:

- 作用： 控制 `<frame>` 或 `<iframe>` 元素的加载。
- 用法示例： frame-src 'self' https://trusted-frames.com; 允许加载同一源的框架以及从 https://trusted-frames.com 加载的框架


### 指令的选项值

1. default-src：

- 'none'： 不允许加载任何资源，默认情况下，只有浏览器报告违规。
- 'self'： 只允许加载来自同一源的资源。
- 'unsafe-inline'： 允许内联脚本和样式，但会增加 XSS 攻击的风险。
- 'unsafe-eval'： 允许使用 eval() 和类似的动态代码执行，但增加了安全风险。

2. script-src：除了上述的 default-src 选项值外，还有：
- 'nonce-value'： 允许使用特定的 nonce 值标识的脚本。
- 'strict-dynamic'： 启用严格动态执行模式，只允许执行经过有效签名的脚本。
- 域名： 允许从指定域名加载脚本。

3. style-src： 除了上述的 default-src 选项值外，还有：
'nonce-value'： 允许使用特定的 nonce 值标识的样式。
'unsafe-inline'： 允许内联样式，但会增加 XSS 攻击的风险。
域名： 允许从指定域名加载样式。

4. img-src、font-src、media-src、connect-src、object-src 等, 除了上述的 default-src 选项值外，还有：
- 域名： 允许从指定域名加载相应类型的资源。
- 'data:'： 允许使用 data URI。
- 'blob:'： 允许使用 Blob URI。

5. frame-ancestors：

- 'none'： 不允许被嵌套在任何 `<frame>`、`<iframe>`、`<embed>`、`<applet>` 中。
- 'self'： 只允许被嵌套在相同源的 `<frame>` 中。
- 域名： 允许被嵌套在指定域名的 `<frame>` 中。

>ps: X-Frame-Options 是一个 HTTP 头部，用于防止点击劫持攻击。点击劫持是一种攻击方式，攻击者通过将目标网站嵌套在一个透明的框架中，然后诱使用户在该框架上执行某些操作，从而实现对目标网站的攻击。[目前已由frame-ancestors 指令取代](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)。

1. form-action, 除了上述的 default-src 选项值外，还有：
- 域名： 允许表单提交到指定域名。
- report-uri 或 report-to：


## 浏览器插件中的 CSP

和网站相比，插件可以访问特权 API，因此一旦它们被恶意代码破坏，风险就更大。因此浏览器插件默认会受到浏览器的默认 CSP 策略的影响

可以通过在 manifest.json 文件中指定 content_security_policy 字段，为插件设置自定义的 CSP 策略。这个字段的值是一个字符串，表示 CSP 策略。

```json
{
  "name": "My extension",
  ...
  "content_security_policy": "script-src 'self' https://example.com; object-src 'self'"
}
```

更多请看[Manifest - Content Security Policy](https://developer.chrome.com/docs/extensions/mv3/manifest/content_security_policy/)

## Report-Only 模式

CSP 还有一个 Report-Only 模式，它不会阻止加载资源，而是只会将违规报告发送到指定的地址，这样可以帮助开发者调试 CSP 的配置。

```html
Content-Security-Policy: default-src 'self'; report-uri http://reportcollector.example.com/collector.cgi
```
## 参考

- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- https://web.dev/articles/csp
- https://www.ruanyifeng.com/blog/2016/09/csp.htm
- https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-Frame-Options
- [Content Security Policy Level 3](https://w3c.github.io/webappsec-csp/)
- [WebExtensions 中的安全策略](https://developer.mozilla.org/zh-CN/docs/Mozilla/Add-ons/WebExtensions/Content_Security_Policy)
- https://developer.chrome.com/docs/extensions/mv3/content_scripts/#injecting-in-related-frames
- https://developer.chrome.com/docs/extensions/mv3/sandboxingEval/
- https://developer.chrome.com/docs/extensions/mv3/cross-origin-isolation/
- https://developer.chrome.com/docs/extensions/mv3/manifest/content_security_policy/