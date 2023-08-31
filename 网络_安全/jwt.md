

## Refresh token

refresh token 是专用于刷新 access token 的 token。 如果没有 refresh token，也可以刷新 access token，但每次刷新都要用户输入登录用户名与密码，会很麻烦。有了 refresh token，可以减少这个麻烦，客户端直接用 refresh token 去更新 access token，无需用户进行额外的操作



## JWT 的工作原理

客户端收到服务器返回的 JWT，可以储存在 Cookie 里面，也可以储存在 localStorage。

此后，客户端每次与服务器通信，都要带上这个 JWT。你可以把它放在 Cookie 里面自动发送，但是这样不能跨域，所以更好的做法是放在 HTTP 请求的头信息Authorization字段里面。

> Authorization: Bearer <token>

另一种做法是，跨域的时候，JWT 就放在 POST 请求的数据体里面。


## 参考

[](https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)