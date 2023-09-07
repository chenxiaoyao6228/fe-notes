
## 前言

本节主要介绍 TCP 的三次握手和四次挥手的过程，以及为什么需要三次握手和四次挥手。
## wireshark配置

我们使用了wireshark来抓包，首先需要去[官网](https://www.wireshark.org/download.html)下载安装包，然后安装，安装过程中会提示安装winpcap，这个是用来抓包的，


之后需要先配置一下，打开wireshark，点击菜单栏的Edit->Preferences，然后在Protocols->TCP中勾选Relative Sequence Numbers，这样可以显示相对序列号，这样更加直观。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/wireshark-setting.png)

## 数据包的基础知识

信息传输的过程就是不断组装数据包的过程，有点类似一级级的快递点，收快递的时候由乡级->县级->市级->省级一级级的转发，最后到达目的地。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/data-pack.png)

## 搭建demo

在4000端口起一个express服务, 然后在新开一个浏览器的tab访问该服务

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.setHeader("Connection", "close");
  res.send("hello world");
});

app.listen(4000, () => {
  console.log("server is running at http://localhost:4000");
});
```

对应的wireshark截图如下：

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/tcp-connect-wireshark-capture.png)

下面来根据上面的截图来分析一下三次握手与四次挥手的过程。
## 三次握手(three-way handshaking)

握手过程中使用了 TCP 的标志(flag) —— SYN(synchronize) 和ACK(acknowledgement)。
### 具体过程

浏览器向服务器发送了一个 SYN 的 TCP 请求，表示希望建立连接，序列号 Seq 是 0， 表示这是第一个请求，确认号 Ack 是 1，表示下次请求的序列号是 1。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/tcp-handshake-1.png)

服务器收到请求后，向浏览器发送了一个 SYN+ACK 的 TCP 请求，表示收到了请求，并且希望建立连接，序列号 Seq 是 0，确认号 Ack 是 1，表示收到了浏览器的序列号为 0 的请求，同时告诉浏览器，下次请求的序列号是 1。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/tcp-handshake-2.png)

浏览器接收到序列号Seq为0，确认号Ack为1的请求后，向服务器发送了一个 ACK 的 TCP 请求，表示收到了服务器的请求，序列号 Seq 是 1，确认号 Ack 是 1，表示收到了服务器的序列号为 0 的请求，同时告诉服务器，下次请求的序列号是 1，这样就可以保证下次请求的序列号是连续的，不会出现断层，同时也告诉服务器，我收到了你的请求，你可以发送数据了，这样就建立了连接。 

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/tcp-handshake-3.png)

### 为什么需要三次握手

主要原因有以下三点：

- 初始化序列号（ISN）同步：每个TCP连接都有一个初始序列号，用于标识传输的数据段。通过三次握手，客户端和服务器都能够确定彼此的ISN，从而避免了序列号冲突。

- 双方确认连接状态：在三次握手的过程中，客户端和服务器都能够确认对方的存在和通信能力。这有助于防止无效的连接请求。

- 防止旧连接的混淆：如果之前的连接还存在于网络中（因为网络延迟或其他原因），并且它的数据包在新连接中出现，那么通过三次握手可以避免混淆，确保新连接和旧连接不会相互干扰。

## 四次挥手(Four-Way Handshake)

四次挥手（Four-Way Handshake）过程包括以下步骤，每个步骤都伴随着一个标志位：

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/tcp-fourway-handshake.png)

- 第一次挥手（FIN_WAIT_1）：客户端发送一个带有FIN（结束）标志位的数据包，表示它已经完成了数据的发送。

- 第二次挥手（CLOSE_WAIT）：服务器接收到客户端的FIN后，会发送一个带有ACK标志位的数据包，表示确认客户端的FIN请求，并且服务器进入到CLOSE_WAIT状态，等待自己的应用层完成数据的发送。

- 第三次挥手（LAST_ACK）：服务器完成数据的发送后，发送一个带有FIN标志位的数据包，表示服务器也已经完成了数据的发送。

- 第四次挥手（TIME_WAIT）：客户端接收到服务器的FIN后，发送一个带有ACK标志位的数据包，表示确认服务器的FIN请求。此时客户端进入到TIME_WAIT状态，等待一段时间后才会关闭连接，以确保服务器收到了最后的确认。

### 为什么需要四次？

三次握手是为了建立连接，而四次挥手是为了优雅地关闭连接，并确保数据的完整性。关闭连接需要额外的步骤，以处理双方可能还有未传输完的数据的情况，以及确保双方都知道连接已经关闭。这种