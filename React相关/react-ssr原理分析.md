## 前言

在逛 B站的时候发现一套Udemy上的SSR教程, 教你如何手写SSR基本框架，虽然项目中暂时还没有用到的机会，但秉承着艺多不压身的原则，花了一天时间过完了，简单做个记录，后续有需要的时候再细看。

## SSR 的优缺点及适用场景

### SSR的优势

与 CSR(client-side-rendering)相比， SSR具有以下优势：
#### 性能

- 网络链路：省去了客户端二次请求数据的网络传输开销，服务端的网络环境要优于客户端，内部服务器之间通信路径也更短

- 内容呈现： 首屏加载时间（FCP）更快，浏览器内容解析优化机制能够发挥作用

#### 可访问性
相比CSR的空壳首页而言，SSR首屏的页面要丰富得多.
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/ssr-juejin.png)

### SSR的缺点
- 改造成本大：存量的CSR代码实现改造困难
- 服务的稳定性和性能要求以及服务器的成本
- 配套设施的建设

### SSR 的适用场景
内容密集型页面，如稀土掘金这类门户网站，以及公司官网。


## SSR 涉及的技术点

### 首页请求的时候，如何将组件转化为 HTML

-  如何在server端跑jsx => 跑webpack将生成bundle, 然后重启server, (nodemon自动重启)
- 将 JS 组件转化为html => ReactDOM.renderToString() 

### 如何根据不同的用户路由进入
在node层劫持`req.path`, 再根据act-router-config匹配出对应的组件，再进行渲染

### server端和client端有两个完全不一样的store， 该如何处理

- server注入JSON数据
- client初始化store的时候使用该store

```js
const store = createStore(
  reducers,
  window.INITIAL_STATE,
  applyMiddleware(thunk.withExtraArgument(axiosInstance))
);
```

> 😃 Update:  这点其实可以借鉴，如果项目中有node作为 BFF层的话， 可以把用户登录相关的请求在node层处理，注入到html, 再进行脱水
> 

> 旧模式: 
> 客户端页面的展示流程为：`获取 index.html => 获取 bundle.js => 执行 bundle.js => 发起 checkToken 请求 => 发起 getUserInfo 请求 => 渲染页面元素`。用户已登录的情况下，页面至少需要等 4RTT 时间后才能进行正常的页面渲染，而未登录的情况下，也需要 3RTT 时间后才能跳转到登录页。

> 新模式:
> 为了减少页面的 RTT，让页面尽快进入渲染状态，所以在用户第一次请求时，就尝试把用户信息注入到页面中，此过程称为注水。在页面首次 dom 解析时，将注入的信息挂载到 window 对象上，在 umi.js 执行时将 window 上的用户信息存储到内存中，并销毁 window 上的用户信息，此过程称为脱水。
经过用户信息的注水与脱水，页面的渲染流程变为：`获取 index.html => => 执行 bundle.js => 渲染页面元素`。用户已登录的情况下，只需要 2RTT 即可正常渲染页面，用户未登录的情况下，只需要 1RTT 即可跳转到登录页面。


### 如何防止XSS 攻击

不能简单地用 JSON.stringify

```js
window.INITIAL_STATE = ${serialize(store.getState())}
```

### 异常处理

- 在SSR: api出错等异常的时候，如何保证用户体验？

## 参考

- [SSR - server side rendering with react and redux](https://www.bilibili.com/video/BV194411t7aq)
- [SSR的利与弊](http://www.ayqy.net/blog/ssr-pros-and-cons/)