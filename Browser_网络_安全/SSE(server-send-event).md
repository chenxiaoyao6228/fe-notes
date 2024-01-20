## 前言

本文总结了 SSE 的基本概念。

## SSE 的基本概念

单纯的 HTTP 无法做到服务端向客户端推送数据，只能由客户端主动向服务端发起请求，然后服务端响应请求，这样的模式称为**请求/响应模式**。

那么如何实现服务端向客户端推送数据呢？一种方式是告诉**客户端"当前推送的数据为流的格式，请不要关闭连接"**。 一旦建立连接之后，服务器就可以周期性地推送事件数据给客户端，而客户端则通过监听这些事件来进行相应的处理。

Server-Sent Events（SSE）就是一种用于在客户端和服务器之间实现单向实时通信的技术。它允许服务器向客户端推送事件流，使得客户端能够实时接收来自服务器的更新。

## SSE 的使用场景

- 实时更新（Real-time Updates）：比如股票价格、比赛结果、新闻事件等。
- 服务器发送事件（Server-Sent Events）：比如日志记录、监控等。
- 聊天应用（Chat Applications）：比如 Facebook、Twitter、Gmail 等。

## SSE 和 WebSocket 的比较

| Feature        | SSE                                      | WebSocket                      |
| -------------- | ---------------------------------------- | ------------------------------ |
| **协议**       | 基于 HTTP                                | 独立协议 WebSocket             |
| **连接性**     | 单向连接，服务器向客户端推送数据         | 双向连接，支持实时双向数据传输 |
| **性能**       | 适用于低频实时通信                       | 适用于高频实时通信，全双工通信 |
| **用途**       | 适用于服务器向客户端推送信息             | 适用于双向实时通信，在线聊天等 |
| **浏览器支持** | 广泛支持，可能在旧浏览器中存在兼容性问题 | 广泛支持，但某些环境可能被阻止 |

## 案例展示

下面来实现一个 CICD 模拟器，通过 SSE 实现实时更新。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/sse-ci-cd.gif)

> 代码地址在`_demo/sse`目录下

实现其实很简单，express 应用启动后，读取`cicd-log.txt`文件， 并通过`res.write`方法，将数据写入到响应流中，这样客户端就可以通过监听响应流来实现实时更新了。

### 服务端代码如下：

```js
const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "public")));

// SSE endpoint实时更新
app.get("/sse-endpoint", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // 读取CICD日志文件，并将每一行作为单独的SSE事件每0.5秒发送一次
  const logFilePath = path.join(__dirname, "public", "cicd-log.txt");
  let lineIndex = 0;

  const sendBuildInfoInterval = setInterval(() => {
    const logLines = fs
      .readFileSync(logFilePath, "utf-8")
      .split("\n")
      .filter(Boolean);
    if (lineIndex < logLines.length) {
      res.write(`data: ${logLines[lineIndex]}\n\n`);
      lineIndex++;
    } else {
      clearInterval(sendBuildInfoInterval);
      res.end();
    }
  }, 500);

  // 当客户端断开连接时，清除定时器
  req.on("close", () => {
    clearInterval(sendBuildInfoInterval);
    console.log("Client disconnected");
  });
});

const PORT = 12345;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

其中，**关键的点在于设置响应头`Content-Type`为`text/event-stream`，这样浏览器就会将响应流当做 SSE 事件流来处理。**

在 SSE 服务器端，通过 res.write 方法发送实时事件。事件的格式为：

> data: Your event data\n\n

这里的 `\n\n` 表示事件的结束，确保每个事件都以两个换行符结尾。

### 客户端代码如下：

```html
<script>
  const eventSource = new EventSource("/sse-endpoint");
  const buildInfoDiv = document.getElementById("build-info");

  eventSource.addEventListener("message", (event) => {
    const buildInfo = event.data;
    appendBuildInfo(buildInfo);
  });

  eventSource.addEventListener("error", (error) => {
    console.error("Error occurred:", error);
  });

  function appendBuildInfo(buildInfo) {
    const buildInfoElement = document.createElement("p");
    buildInfoElement.innerText = buildInfo;
    buildInfoDiv.appendChild(buildInfoElement);
    // 滚动到底部
    buildInfoDiv.scrollTop = buildInfoDiv.scrollHeight;
  }
</script>
```

主要的点在于监听`message`事件，然后将事件数据追加到`buildInfoDiv`中。

## 参考

- https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
