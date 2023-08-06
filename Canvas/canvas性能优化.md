## 前言


### 最大尺寸
根据[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas#%E6%9C%80%E5%A4%A7%E7%9A%84%E7%94%BB%E5%B8%83%E5%B0%BA%E5%AF%B8)的描述，canvas有最大的尺寸限制

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-max-size.png)

虽然规范如此，但是不同浏览器不同设备上的表现不同，这里提供一个demo供读者快速测试, 👉 [Github在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/canvas-size/max-size.html)

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-max-size-test.png)

尺寸越大，渲染需要的消耗的资源就越多，应用性能就会越差。
