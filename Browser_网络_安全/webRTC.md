---
title: "WebRTC 初探"
date: "2022-01-02"
tags: ["webrtc"]
summary: "项目中有局域网投屏与文件传输的需求，所以研究了一下 webRTC，这里记录一下学习过程"
draft: false
authors: ["default"]
---

## 前言

项目中有局域网投屏与文件传输的需求，所以研究了一下 webRTC，这里记录一下学习过程。

## WebRTC 基本流程以及概念

下面以 1 对 1 音视频实时通话案例介绍 WebRTC 的基本流程以及概念

### WebRTC 中的角色

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/webrtc-1.png)

- WebRTC 终端,负责音视频采集、编解码、NAT 穿越、音视频数据传输

- Signal 服务器,负责信令处理,如加入房间、离开房间、媒体协商消息的传递等。

- STUN/TURN 服务器,负责获取 WebRTC 终端在公网的 IP 地址,以及 NAT 穿越失败后的数据中转。

### 媒体协商

SDP(Session Description Protocal): 用文本描述的各端(PC 端、Mac 端、Android 端、iOS 端等)的能力。

这里的能力指的是**各端所支持的音频编解码器是什么,这些编解码器设定的参数是什么,使用的传输协议是什么,以及包括的音视频媒体是什么**

媒体协商流程图

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/webrtc-negociation.png)

- 呼叫方创建 Offer 类型的 SDP 消息。创建完成后,调用 setLocalDescriptoin 方法将该 Offer 保存到本地 Local 域,然后通过信令将 Offer 发送给被呼叫方。

- 被呼叫方收到 Offer 类型的 SDP 消息后,调用 setRemoteDescription 方法将 Offer 保存到它的 Remote 域。作为应答,被呼叫方要创建 Answer 类型的 SDP 消息,

- Answer 消息创建成功后,再调用 setLocalDescription 方法将 Answer 类型的 SDP 消息保存到本地的 Local 域。最后,被呼叫方将 Answer 消息通过信令发送给呼叫方。

- 呼叫方收到 Answer 类型的消息后,调用 RTCPeerConnecton 对象的 setRemoteDescription 方法,将 Answer 保存到它的 Remote 域

具体的媒体协商的过程是 WebRTC 内部自己去实现的, 作为开发者**只需要记住本地的 SDP 和远端的 SDP 都设置好后,协商就算成功了.**

紧接着在 **WebRTC 底层会收集 Candidate**,并进行**连通性检测**,最终在通话双方之间建立起一条链路来。

### WebRTC 的连接 与 ICE Candidate(重点)

WebRTC 之间建立连接的过程是非常复杂的, 主要的原因在于它内部的实现既要考虑传输的**高效性**,又要保证端与端之间的**连通率**。

当同时存在多个有效连接时,它首先选择传输质量最好的线路,如能用内网连通就不用公网。另外,如果尝试了很多线路都连通不了,那么它还会使用服务端中继的方式让双方连通

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/webrtc-ice.png)

WebRTC 是如何做到的? 答案是采用**多个 Candicate 排序并执行连通性测试的方式**

### ICE Candidate

它表示 WebRTC 与远端通信时使用的协议、IP 地址和端口, 一般有以下字段

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/webrtc-candidate.png)

其中:

- host 表示 **本机候选者**

- srflx 表示**内网主机映射的外网的地址和端口(通过 TURN 服务器, 需要在 PeerConnectionConfig 里面去配)**

- relay 表示中继候选者 **(通过 TURN 服务器, 需要在 PeerConnectionConfig 里面去配)**,

假设 A 和 B 都有多个 candidate, 那么 WebRTC 会按照**host->srflx→relay**的方式进行联通性测试, 选择最合适的方案

作为开发者, 只需要做两件事情:

1.部署相应的 TURN 服务器和 STUN 服务器(有现成的), 初始化 peerConnection 对象的时候配置 iceServers

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/webrtc-init-turn-sturn.png)

2. 监听 oniceccandidate 方法, 每接收到一个 candidate, 就通过信令服务器发送给另外一方即可

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/webrtc-oniceccandidate.png)

**当我们没有设置 TURN 服务器或者 STUN 服务器的时候, 两个端建立起了连接, 就可以判断两个端位于同一个局域网内**

### STUN 服务器与 NAT 穿透

如果两台主机不在同一个内网, WebRTC 将尝试 NAT 打洞,即 P2P 穿越。WebRTC 将 NAT 分类为 4 种类型

- 完全锥型

- NAT IP 限制型

- NAT 端口限制型

- NAT 对称型 NAT

具体的穿透逻辑也是对开发者屏蔽的, 但基本的思路是: **在公网上架设一台服务器,并向这台服务器发个请求, 该服务器往响应中塞入公网 IP , 这样客户端就可以知道自己的公网 IP**

### WebRTC 兼容性

从 can-i-use 中可以看到浏览器的支持情况还是相对乐观的

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/webrtc-caniuse.png)

但是直接使用 webrtc 原生的 API 还是比较麻烦的, 虽然浏览器支持了 WebRTC, 但是各大浏览器内部的实现方式还是有差异, 需要对应的 pollyfill 方案

目前只有 adaptor.js 可以选择, 可以官方推荐的方案

### 基于原生 webrtc 的调用流程图

从上面的描述可以看到, 基于原生 WebRTC 去实现投屏功能的话还是比较麻烦的,

特别是 SDP 交换（createOffer 及 createAnswer）、网络候选信息收集(ICE candidate)

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/webrtc-screen-share-logic-flow.png)

## [Peerjs](https://www.npmjs.com/package/peerjs)

peerjs 简化了 webrtc 的开发过程，把 SDP 交换、ICE candidate 这些偏底层的细节都做了封装，开发人员只需要关注应用本身就行了。

peerjs 的核心对象 Peer，它有几个常用方法：

- peer.connect 创建点对点的连接
- peer.call 向另 1 个 peer 端发起音视频实时通信
- peer.on 对各种事件的监控回调
- peer.disconnect 断开连接
- peer.reconnect 重新连接
- peer.destroy 销毁对象

另外还有二个重要对象 DataConnection、MediaConnection，其中：

- DataConnection 用于收发数据(对应于 webrtc 中的 DataChannel)，它的所有方法中有一个重要的 send 方法，用于向另一个 peer 端发送数据；
- MediaConnection 用于处理媒体流，它有一个重要的 stream 属性，表示关联的媒体流。

peerjs 内置了一套信令服务器, peer-server, 开发者可以自己部署, 不指定的情况下会使用 peerjs 官方托管的信令服务器

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/webrtc-peerjs-peerserver.png)

总结：

- 相比原生的方案, api 简化, 开发者关注底层的细节少了
- 提供了 peer-server 可供部署, 官方也提供免费托管的 peerServer
- 封装程度比较高, 后续改造会比较麻烦

## [Simple-peer](https://www.npmjs.com/package/simple-peer)

与 peerjs 类似, 把 SDP 交换、ICE candidate 这些偏底层的细节都做了封装, 但是封装程度没有 peerjs 那么高, 提供了一定的灵活性:

peer.signal(data): 发送信令

peer.send(data): 发送 data

peer.addStream(stream): 添加音视频流

peer.removeStream(stream): 移除音视频流

peer.addTrack(track, stream)

peer.removeTrack(track, stream)

peer.destroy([err]): 销毁实例

peer.on(): 监听各种事件

**相比 peerjs, simple-peerjs 自己并不提供 peerServer 作为信令服务器, 而是提供了一个 signal 事件**

```js
peer.on("signal", (data) => {
  // when peer1 has signaling data, give it to peer2 somehow
  // 在这里使用IM发送信令
});
```

总结：

- 一定程度的封装, 相比原生不需要写很多冗余的样板代码，但也意味着一个高级功能的实现需要自己来实现(peerjs 有文件传输相关的实现)
- 相比 peerjs, 不依赖 peerServer, 可以接入我们的 IM
- 总代码不到一千行, 且不依赖 server 代码, 改造起来比较容易

## 一些注意事项

### https 限制

由于浏览器的安全限制, 本地开发的时候需要使用 localhost 访问, 或者配置 https 证书, 不然无法拿到 navigator.mediaDevices 对象

## 参考

- [webrtc-samples](https://webrtc.github.io/samples/)

- [google webrtc](https://webrtc.org/getting-started/overview)

- [Peerjs](https://www.npmjs.com/package/peerjs)

- [Simple-peer](https://www.npmjs.com/package/simple-peer)

- [从 0 打造音视频直播系统](https://time.geekbang.org/column/article/107916)

> 本文首发于个人博客[前端开发笔记](https://github.com/chenxiaoyao6228/fe-notes)，由于笔者能力有限，文章难免有疏漏之处，欢迎指正
