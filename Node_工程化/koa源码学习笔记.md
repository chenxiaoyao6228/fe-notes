---
title: koa源码学习笔记
date: 2019-06-02T23:44:41.000Z
categories:
  - tech
tags:
  - node
  - koa
permalink: 2019-06-02-koa-source-code-analysis
---

我们的 koa 程序可以简化为以下三步

```js
const app = new koa();
app.use(middleware);
app.listen(port);
```

搞清楚这三步分别做了什么?让我们翻开 koa 源码一看究竟.打开 node_modules/koa/package.json,可以看到程序的入口

```js
"main": "lib/application.js"
```

application.js 主要做了三件事

1. 创建 app 对象,该对象继承了 Emitter,并且继承了 context,req,res 对象

```js
module.exports = class Application extends Emitter {
  constructor() {
    super();
    this.middleware = []; //中间件数组
    this.context = Object.create(context); //context挂载到app
    this.request = Object.create(request); //request挂载到app
    this.response = Object.create(response); //response挂载到app
  }
};
```

分别来看看这 lib 下的 context.js, request.js, response.js 三个文件

```js
//  context.js 就暴露了一个对象
const proto = module.exports = {

};

// 使用delegate将request和response对象挂载到proto上
delegate(proto, 'response')  // 这里
  .method('attachment')
  .method('flushHeaders')
  ... 省略若干 .....
  .access('status')
  .getter('writable');

  delegate(proto, 'request') // 这里
  .method('acceptsLanguages')
  .method('acceptsEncodings')
    ... 省略若干 .....
  .access('querystring')
  .getter('ip');

```

delegate 来自于 node_modules/delegates/index.js,也很简单,就定义了 5 个方法 method, access, getter, setter, fluent

```js
function Delegator(proto, target) {
  this.proto = proto;
  this.target = target;
}
// method, 通过apply将this绑定在target,也就是上面的request和response对象上
Delegator.prototype.method = function (name) {
  var proto = this.proto;
  var target = this.target;
  proto[name] = function () {
    return this[target][name].apply(this[target], arguments);
  };
  return this;
};
```

request.js 和 response.js:里面都是一系列的 getter setter 方法, 继承自 req 和 res 对象

```js
//request.js
module.exports = {
  get header() {
    return this.req.headers;
  },
  set header(val) {
    this.req.headers = val;
  },
  get url() {
    return this.req.url;
  },
  set url(val) {
    this.req.url = val;
  },
  ... 省略若干 .....
}
```

因此有

```js
ctx.body = "Hi Allen"; //实际上调用的是response.js里面的set body
```

2. use 的时候将回调函数 push 到 middlewares 中间件数组中

```js
  use(fn) {
    this.middleware.push(fn);
    return this;
  }
```

3. listen 的时候,创建 http server,监听端口,当端口发生变化时候执行相应的回调,

```js
  listen(...args) {
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }
```

我们来看下 this.callback,该函数执行的时候返回 handleRequest,handleRequest 首先创建了调用了 createContext,将 req 和 res 上的方法属性挂在了 ctx 上, 其次调用 handleRequest 将 ctx 对象传给中间件函数,

```js
  callback() {
    const fn = compose(this.middleware); //注意这里
    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };
    return handleRequest;
  }
```

这里的 this.context 来自于 context.js 文件,context.js 用引入 delegate.js,因此,原型链查找的方向是 context->context.js 暴露出来的对象->delegate.js 暴露出来的对象, 可以看到 context 可以直接访问 request 和 response 上的属性,也可以通过 context.request 来访问,
(至于为什么要有 request.response, response.request 这一步有些疑惑,还望高人指出)

```js
  createContext(req, res) {
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }
```

handleResponse 在中间件执行结束之后再执行

```js
  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    const handleResponse = () => respond(ctx);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
```

去除掉参数校验之后,response 返回客户端的需要的数据

```js
function respond(ctx) {
  const res = ctx.res;
  let body = ctx.body;
  if (Buffer.isBuffer(body)) return res.end(body);
  if ("string" == typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}
```

中间件的执行顺序问题: 按 use 的顺序执行,碰到 next()就传递控制权,next 执行完之后再返回执行

```js
const koa = require("koa");
const logger = require("koa-logger");
const app = new koa();

const indent = (n) => {
  return new Array(n).join("&nbsp");
};

const mid1 = () => {
  return async (ctx, next) => {
    ctx.body = `<h3>请求 => 第一层中间件</h3>`;
    await next();
    ctx.body += `<h3>响应 => 第一层中间件</h3>`;
  };
};

const mid2 = () => {
  return async (ctx, next) => {
    ctx.body += `<h3>${indent(4)}请求 => 第二层中间件</h3>`;
    await next();
    ctx.body += `<h3>${indent(4)} 响应 => 第二层中间件</h3>`;
  };
};

const mid3 = () => {
  return async (ctx, next) => {
    ctx.body += `<h3>${indent(8)}请求 => 第三层中间件</h3>`;
    await next();
    ctx.body += `<h3>${indent(8)} 响应 => 第三层中间件</h3>`;
  };
};

app.use(logger());
app.use(mid1());
app.use(mid2());
app.use(mid3());
app.use((ctx, next) => {
  ctx.body += `<p style='color: red'>${indent(12)}koa 核心业务处理'</p>`;
});

app.listen(3001);
```

返回的结果是这样的,类似一种"U 型结构"

```
请求 => 第一层中间件
   请求 => 第二层中间件
       请求 => 第三层中间件

           koa 核心业务处理'

        响应 => 第三层中间件
    响应 => 第二层中间件
响应 => 第一层中间件
```

koa 中的中间件之所以有这样的能力,在于 koa-compose 的包装.koa-compose 使用的递归的形式进行调用,并且使用尾递归进行了优化.翻开 koa-compose/index.js 的源码

```js
function compose(middleware) {
  return function (context, next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error("next() called multiple times"));
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
```

掌握 koa 等框架并不难,难的是 http 协议,资源,请求流程的优化设定,这些属于网络通讯的硬知识,,需要花时间去学习掌握
