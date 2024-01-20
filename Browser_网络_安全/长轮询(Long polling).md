## 前言

本文将总结长轮询(Long polling)的原理和实现。

## 什么是 Long Polling

Long Polling（长轮询）是一种改进的服务器推送技术，用于实现实时性较强的客户端与服务器之间的通信。

1. 对比传统的轮询方式

- 传统轮询：客户端以固定的时间间隔（例如每隔几秒）发起 HTTP 请求询问服务器是否有新数据。这种方式可能导致大量的无效请求，尤其是在数据更新不频繁的情况下。

- Long Polling：客户端发起请求后，服务器不会立即响应，而是保持连接处于挂起状态。服务器在有新数据时才会响应，然后客户端处理响应后再次发起长轮询请求。

2. 客户端与服务器的交互模式

- 客户端发起请求：使用 AJAX 或 WebSocket 等技术，客户端向服务器发起一个异步请求。

- 服务器处理请求：服务器接收到请求后，不立即响应，而是等待有新数据可用时再进行响应。这样可以有效减少无效请求的数量。

- 客户端处理响应：客户端收到服务器的响应后，处理数据并根据需要再次发起新的长轮询请求，保持连接的持续性。

## 实现

### 服务端

```js
const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/long-polling-endpoint", (req, res) => {
  // 模拟异步数据获取，实际应用中可以替换为真实数据源
  setTimeout(() => {
    // 响应客户端
    res.send("Data from server at " + new Date());
  }, 5000); // 模拟数据每5秒更新一次
});

const port = 3456;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

### 客户端

```html
<script>
  function longPolling() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status == 200) {
          // 处理服务器响应的数据
          console.log(xhr.responseText);
          // 发起下一次长轮询请求
          longPolling();
        } else {
          // 处理错误
          console.error("Long Polling request failed");
        }
      }
    };
    xhr.open("GET", "/long-polling-endpoint", true);
    xhr.send();
  }

  // 启动长轮询
  longPolling();
</script>
```

## 边界处理

### 防止连接泄漏

连接泄漏指的是在长轮询期间，由于一些异常情况（如客户端或服务器崩溃、网络中断等），连接没有被正常关闭，导致资源无法释放。这可能导致服务器资源耗尽，服务质量下降，甚至是安全风险。

防范措施：

- Timeouts 和超时机制： 在服务器端实现超时机制，确保连接在一定时间内没有活动时自动关闭。这可以通过设置连接的最大存活时间或定期检查连接状态来实现。

- 断线重连策略： 在客户端实现断线重连的策略，当检测到连接中断时，能够主动关闭当前连接并重新建立连接。

- 监控和日志： 在服务器端实施监控和日志系统，定期检查连接的状态，并记录异常情况，以便及时发现和解决问题。

## 处理连接中断和重新连接

长轮询期间，连接中断可能由网络问题、服务器重启或其他异常情况引起。在这种情况下，应该有适当的机制来处理连接的中断和重新连接。

- 断线重连策略： 在客户端实施断线重连的机制，可以通过定时器或事件监听来检测连接状态，并在发现连接中断时尝试重新建立连接。

- 指数退避算法： 为了避免短时间内的频繁重连，可以实施指数退避算法，逐渐增加重连的间隔时间。

- 状态处理： 在客户端和服务器端都需要实现状态处理机制，以便及时感知连接状态的变化，并采取适当的措施。

## 参考

- https://javascript.info/long-polling
