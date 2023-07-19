## 现象

前端发起请求，在浏览器中可以看到请求中携带了对应的 token 信息，在 node 层(egg)的日志中也看到了，但是尝试从取

```js
request {
  method: 'GET',
  url: '/profile?from=class_account_page',
  header: {
    host: 'localhost:7081',
    cookie: 'x-auth-brand=bytello; token=xxxxxxxxxxxxx'
  }
}
// 获取token失败
ctx.cookies.get("token") undefined
```

## 原因

`koa-cookie`中设置cookie的时候有对应的参数，取的时候也应该传入对应的参数

- httpOnly: 设置键值对是否可以被 js 访问，默认为 true，不允许被 js 访问
- secure: signed：设置是否对 Cookie 进行签名，如果设置为 true，则设置键值对的时候会同时对这个键值对的值进行签名，后面取的时候做校验，可以防止前端对这个值进行篡改。默认为 true。


```js
ctx.cookies.set(‘AAA’, cityShort, {
httpOnly: false,
signed: false,
});

ctx.cookies.get(‘AAA’, { httpOnly: false, signed: false });
```
