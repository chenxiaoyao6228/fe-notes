## 前端性能优化

本模块将梳理前端性能优化的相关知识点

## 从浏览器输入 URL 到页面展示发生了什么

完整版请查看[Browser_网络_安全]的部分，这里只是简单的梳理一下

1. DNS 解析
2. TCP 连接
3. 浏览器发出 HTTP 请求
4. 服务器处理请求并返回 HTTP 报文
5. 浏览器解析渲染页面

性能优化的过程，就是对上述各个环节进行优化的过程， 比如 DNS 的解析时间，可以通过 DNS 缓存、DNS 预解析、减少 DNS 查询次数等方式来优化
又比如 TCP 连接，可以通过减少 TCP 连接次数、TCP 连接复用等方式来优化

对于前两者，前端能做的事情有限，因此我们主要把精力放在后两者上

## 前端性能优化

主要分为网络层和渲染层的优化

### 网络层的优化

主要的目标是减少 HTTP 请求**次数**和减少 HTTP 请求**大小**，具体的优化手段有：

- webpack 打包体积优化(代码压缩、Tree Shaking、Scope Hoisting、代码分割、按需加载)
- Gzip 压缩开启
- 使用 CDN（内容分发网络）加速资源加载
- 使用资源预加载和懒加载
- 使用合适的图片格式、图片压缩
- 使用浏览器缓存(HTTP 缓存，Local Storage, Session Storage, Cookie)

### 渲染层的优化

主要涉及日常的前端开发，主要的目标是减少页面的**渲染时间**，具体的优化手段有：

- CSS 优化(选择器优化、CSS 预处理器、CSS 属性优化、CSS 动画优化)
- JS 优化(减少 DOM 操作、减少重绘重排、JS 异步加载、JS 压缩、JS 懒执行、使用 Web Worker)
- 回流重绘优化(减少 DOM 操作、使用 CSS3 动画、CSS3 硬件加速、使用 requestAnimationFrame)
- 使用 Chrome Performance 工具进行性能分析
- 异步更新 DOM(虚拟 DOM、Diff 算法)

### 性能评估指标与工具

- Chrome Performance 面板
- [user-centric-performance-metrics](https://web.dev/articles/user-centric-performance-metrics)
- [WebPageTest](https://www.webpagetest.org/)
- [web-vitals](https://keenwon.com/web-vitals)
