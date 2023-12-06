## 前言

本文主要总结 HTTP/0.9 到 HTTP/1.1 的发展史

## HTTP/0.9

作为 HTTP 协议的最早版本，诞生于早期的 Web 发展阶段。在这个时候，Web 的需求相对简单，主要是通过超文本（Hypertext）方式共享文本信息。Web 页面基本上是静态的，没有复杂的多媒体内容，而更多地关注于文本的传递和共享。

基于上述需求，HTTP/0.9 设计很简陋：

### 仅支持 GET 方法的支持

这意味着它只能用于获取服务器上的文本资源。没有其他 HTTP 方法的支持，如 POST、PUT 等，限制了协议的灵活性。

### 无 Header，无状态

HTTP/0.9 没有引入 Header 部分。这意味着请求和响应中没有元数据的传递，也就是说，每个请求和响应都是相对独立的，无法携带额外的信息。此外，HTTP/0.9 也是无状态的，服务器不会保留与客户端的会话状态。

### 文本协议

HTTP/0.9 采用纯文本协议，通过简单的 ASCII 字符传输数据。这种简洁的设计使得协议非常轻量，但也使得它在处理复杂的应用和多媒体内容时显得力不从心。

## HTTP/1.0

HTTP/1.0 标志着对 HTTP 协议的第一次正式规范化。随着 Web 的发展，对于更灵活、可扩展的协议需求逐渐增加，而 HTTP/1.0 在这一时期应运而生，通过引入新的特性和改进，正式奠定了 HTTP 协议的基础。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/http-1.0-connection.png)

### 引入 Header

相较于 HTTP/0.9，HTTP/1.0 引入了 Header 部分。Header 允许在请求和响应中携带元数据，这为协议的灵活性提供了重要支持。通过 Header，客户端和服务器可以传递额外的信息，如内容类型、语言偏好等。

> accept: text/html
> accept-encoding: gzip, deflate, br
> accept-Charset: ISO-8859-1,utf-8
> accept-language: zh-CN,zh

### 支持多种 HTTP 方法

HTTP/1.0 不再仅限于 GET 方法，而是引入了更多的 HTTP 方法，包括 POST、PUT 等。这使得协议更具通用性，能够支持更多类型的数据传输和处理.

- **引入状态码**: HTTP/1.0 引入了状态码，通过状态码可以更准确地表示服务器对请求的处理结果。这使得客户端能够更好地理解服务器的响应，包括成功、重定向、客户端错误和服务器错误等情况。

虽然迈出了第一步，但是 HTTP/1.0 还是存在许多问题：

- **每个请求/响应建立新的 TCP 连接，效率低下**: 在 HTTP/1.0 中，每个请求和响应都需要建立一个新的 TCP 连接。这种连接模型在一定程度上降低了效率，因为建立和关闭 TCP 连接都需要一定的时间和资源。特别是对于多个小型请求的场景，这种模型可能导致不必要的延迟和资源浪费

- **无法处理多媒体内容**: 虽然 HTTP/1.0 引入了 Header 和支持多种 HTTP 方法，但它仍然在处理多媒体内容方面存在一些限制。由于没有引入分块传输编码（Chunked Transfer Encoding）等机制，HTTP/1.0 无法有效地处理大型或流式传输的多媒体数据。

## HTTP/1.1

HTTP/1.1 标志着对 HTTP 协议的一次根本性改变。随着 Web 应用的不断发展，HTTP/1.1 引入了多项重要的特性，旨在提高性能、支持更复杂的应用和提高网络效率。

### 持久连接（Keep-Alive）

HTTP/1.1 引入了持久连接(**默认开启**)，允许多个请求和响应可以在同一个 TCP 连接上复用。在 HTTP/1.0 中，每个请求都需要建立一个新的连接，而 HTTP/1.1 中的持久连接大大减少了连接的建立和关闭开销，提高了性能。

> Connection: Keep-Alive

#### 管道化（Pipeline）

HTTP/1.1 支持管道化，即在一个 TCP 连接上可以同时发送多个请求而无需等待之前的请求响应。这提高了并发性，减少了等待时间，使得客户端可以更快地收到多个请求的响应。

此外，为了防止过度消耗系统资源， HTTP/1.1限制同一域名下的并发TCP连接数， **大多数现代浏览器（包括Chrome、Firefox、Safari等）采用了类似的限制，通常为每个域名6个并发连接**

这个限制还推动了一些优化实践，比如使用**域名分片（Domain Sharding或者合并资源**，以最大程度地利用浏览器对不同域名的并发连接数的限制

#### 引入了缓存管理和控制

HTTP/1.1 引入了更强大的缓存控制机制，包括可以精确指定缓存过期时间的 Cache-Control 头字段。这使得客户端和服务器可以更有效地管理资源的缓存，减少对服务器的不必要请求

| Cache-Control 指令 | 描述                                       | 示例                        |
|---------------------|--------------------------------------------|-----------------------------|
| max-age             | 指定资源被视为新鲜的最长时间（秒）              | `Cache-Control: max-age=3600`|
| no-cache            | 表示缓存必须在使用前与服务器重新验证              | `Cache-Control: no-cache`    |
| no-store            | 表示缓存不应存储任何版本的资源                   | `Cache-Control: no-store`    |
| public              | 表示响应可以被任何缓存（包括代理服务器）缓存       | `Cache-Control: public`      |
| private             | 表示响应仅可被终端用户浏览器缓存，不可被共享缓存    | `Cache-Control: private`     |
| s-maxage            | 类似于 max-age，但仅用于共享缓存（代理服务器）       | `Cache-Control: s-maxage=3600`|
| must-revalidate     | 表示客户端必须在使用过期资源之前验证其有效性       | `Cache-Control: must-revalidate` |


### 引入了分块传输编码（Chunked Transfer Encoding）

HTTP/1.1引入了分块传输编码，这是一种改进传输大型或动态生成内容的机制。分块传输编码允许服务器将响应分割成一系列小块（chunks），每个块都带有自身的大小信息。这种机制在处理大文件或动态生成内容时非常有用，因为它允许客户端在接收到每个块后立即处理，而无需等待整个响应完成。

> Transfer-Encoding: chunked
Transfer-Encoding: compress
Transfer-Encoding: deflate
Transfer-Encoding: gzip

工作原理如下：

1. 分割响应: 服务器在生成响应时将其分割成一系列小块。每个块包括数据部分和一个描述块大小的十六进制数。

```text
4\r\n
Wiki\r\n
5\r\n
pedia\r\n
E\r\n
in\r\n
\r\n
chunks.\r\n
0\r\n
\r\n
```
上述例子中，4\r\nWiki\r\n 表示一个大小为4字节的块，包含数据"Wiki"。

2. 发送块: 服务器将这些块按顺序发送给客户端，每个块都以块大小和块数据的形式进行传输。

3. 即时处理: 客户端在接收到每个块后即时处理。这使得客户端无需等待整个响应完成，而可以立即开始处理部分数据。

4. 结束标志: 最后一个块的大小为0，表示响应的结束。客户端通过检测块大小是否为0来确定整个响应是否已接收完毕。

## 参考

 - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive
 
 - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding