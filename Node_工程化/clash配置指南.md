---
date: 2023-05-25
permalink: clash-configuration-handbook
title: clash配置指南
categories:
  - tech
---

## 前言

[Clash](https://github.com/Dreamacro/clash/blob/dev/README.md)是一款非常好用的科学上网工具，但是要合理地使用的话需要对其配置有一定的熟悉，希望可以借本文梳理与之相关的概念:

- 网络代理的基本原理
- clash 配置介绍

## 网络代理

根据被代理对象的不同，网络代理可以分为以下两种类型：

Forward Proxy Server（正向代理服务器）,又称为代理服务器，是**客户端**所在内部网络和外部网络之间的一个中转服务器，客户端通过该服务器发送请求到互联网上的服务器，之后代理服务器再将请求结果返回给客户端。这种机制可以有效地提高网络性能，同时保护客户端隐私。

正向代理服务器例子：抓包工具(Charles, Proxyman, Fiddler)，梯子工具(Clash, Shadowsocks, V2ray)。

Reverse Proxy Server（反向代理服务器）则是站在**Web 服务器**的角度上，为 Web 服务器提供安全性、可扩展性、负载均衡、透明性等功能，实现对外部或客户端的转发请求。

反向代理服务器的例子: Nginx、Apache HTTP Server.

### 代理工具的基本原理

以抓包工具为例，当用户打开抓包工具的时候， 抓包工具会做两件事:

1. 启动一个代理服务器用来转发网络请求

```js
const http = require("http");
const httpProxy = require("http-proxy");
const PROXY_PORT = 7890;

// 创建代理服务器
const proxyServer = httpProxy.createServer();

proxyServer.on("error", (err, req, res) => {
  console.error("Error with proxy server:", err);
  res.writeHead(500, {
    "Content-Type": "text/plain",
  });
  res.end("Proxy error");
});

proxyServer.on("proxyReq", (proxyReq, req, res, options) => {
  console.log("Proxying request:", options.host + req.url);
});

proxyServer.on("proxyRes", (proxyRes, req, res) => {
  console.log("Proxied response:", res.statusCode, req.url);
});

proxyServer.listen(PROXY_PORT, () => {
  console.log(`Proxy server listening on port ${PROXY_PORT}`);
});
```

2. 通过命令行更改网关， 让所有的请求都经过 proxy server， 再将请求通过 UI 的形式展示出来

```js
const { exec } = require("child_process");
const proxyServer = "192.168.1.100";
const proxyPort = "7890";

// 抓包工具会通过命令行更改网关
const command = `netsh interface ip set address name="Local Area Connection" gateway=${proxyServer} gwmetric=0`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error setting default gateway: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Error setting default gateway: ${stderr}`);
    return;
  }
  console.log(`Default gateway set to ${proxyServer}`);
});
```

当然，对于梯子工具来说，还需要对应的远程代理服务器与加密协议来转发网络请求。

## clash 配置

下面详细介绍下 clash 的配置文件

### 配置文件

clash 的配置文件位于`~/.config/clash`目录下，包含以下文件:

- config.yaml: clash 默认的配置文件
- NEWclash.yaml: 用户的配置文件在中
- cache.db: 一个数据库文件, 用来缓存 DNS 记录提升性能;
- Country.mmdb: IP 与国家映射配置文件

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/clash-2.png)

clash 配置用的是 yaml 文件，关于 yaml(发音 /ˈjæməl/ )语法可参见阮一峰老师的[YAML 语言教程](https://www.ruanyifeng.com/blog/2016/07/yaml.html)

### config.yaml

下面看看官方的默认配置文件

```yaml
mixed-port: 7890
external-controller: 127.0.0.1:9090
allow-lan: false
mode: rule
log-level: warning

proxies:

proxy-groups:

rules:
  - DOMAIN-SUFFIX,openai.com,DIRECT
  - DOMAIN-SUFFIX,google.com,DIRECT
  - DOMAIN-KEYWORD,google,DIRECT
  - DOMAIN,google.com,DIRECT
  - DOMAIN-SUFFIX,ad.com,REJECT
  - GEOIP,CN,DIRECT
  - MATCH,DIRECT
```

### mixed-port

clash 允许使用多个端口进行混合代理模式的方式。当你想要使用多个混合代理端口以避免端口冲突时，这非常有用。

假设你需要从家里访问公司的内部资源，但你公司的网络有严格的防火墙规则。你可以使用 Clash 设置混合代理，使用不同的协议（如 Shadowsocks、Vmess、Trojan）在不同的端口上运行。通过在不同的端口上使用 VPN 协议而非 Shadowsocks（如 Vmess 或 Trojan），可以避免检测并提高 VPN 连接的稳定性。而在其他协议不可用时，可以使用 Shadowsocks。

例如，你可以在端口 8989 上使用 Shadowsocks，在端口 8990 上使用 Vmess，在端口 8991 上使用 Trojan。使用这些值设置 mixed-port，你可以根据需要切换协议和端口以访问公司的内部资源。

以下是实现此混合代理场景的示例配置文件：

```
mixed-port: 8989
rules:
  - DOMAIN-KEYWORD,google,vmess,8990
  - DOMAIN-SUFFIX,company.com,trojan,8991
  - MATCH,*,shadowsocks
```

在此示例中，对于 google.com 的请求将使用端口 8990 上的 Vmess 协议，对于任何以 company.com 结尾的域的请求将使用端口 8991 上的 Trojan 协议，而其他请求将使用端口 8989 上的 Shadowsocks。

### external-controller

Clash 的 RESTful API，可用于验证配置是否成功, 除了 API 之外，还可以使用对应的面板来查看我们的配置项

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2013/../2023/clash-3.png)

### allow-lan

allow-lan 配置选项在 Clash 配置文件中确定是否允许局域网连接。当 allow-lan 设置为 true 时（默认值），Clash 将接受来自本地网络设备的代理连接。如果你想与家庭网络上的其他设备共享代理服务该配置可能很有用。但是，如果 allow-lan 设置为 false，则 Clash 将仅接受来自运行 Clash 实例的设备的代理连接。如果你想将对代理服务的访问权限限制为特定设备或网络可能很有用。

### mode： Global, Rule, Direct

Clash 可以根据配置可以运行不同的模式。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/clash-1.png)

Global：所有的流量将会遵循同一个 Proxy 规则，即全局代理，所有流量将会被发送到同一个代理服务器，无论请求的目的地址是什么。

Rule：该策略依据自定义的规则进行流量路由，比如可以根据网址、IP 地址、或流量类型等来进行分流，对于不同的流量目的地址，可以采用不同的代理策略，包括使用不同的代理协议（如 HTTP、Socks5、Shadowsocks 等）。

Direct：所有流量将会直接走本地网络，不会被发送到任何代理服务器中转。

### Proxy-group(代理组)

"代理组"模式类似于“混合”模式，但允许用户指定每个目的地使用哪些代理服务器。

### rules(规则)

DOMAIN-SUFFIX: 此规则匹配网站的域名后缀，并可用于指定如何处理该网站的请求。处理请求的选项有 "DIRECT"（不使用代理发送请求）、"PROXY"（通过代理发送请求）或 "REJECT"（拒绝请求）。 示例: DOMAIN-SUFFIX,openai.com,DIRECT

DOMAIN-KEYWORD: 此规则匹配网站 URL 中的关键词，并可用于指定如何处理该网站的请求（与 DOMAIN-SUFFIX 相同）。 示例: DOMAIN-KEYWORD,google,DIRECT

DOMAIN: 此规则匹配网站的精确域名，并可用于指定如何处理该网站的请求（与 DOMAIN-SUFFIX 相同）。 示例: DOMAIN,google.com,DIRECT

IP-CIDR: 此规则匹配网络的 IP 地址范围，并可用于指定如何处理该网络的请求（与 DOMAIN-SUFFIX 相同）。 示例: IP-CIDR,0.0.0.0/8,DIRECT

GEOIP: 此规则匹配客户端 IP 地址的国家代码，并可用于指定如何处理该国家的请求（与 DOMAIN-SUFFIX 相同）。 示例: GEOIP,CN,DIRECT

Fallback: 此规则指定如果其他规则不匹配时要使用的代理组。 示例: Fallback,Proxy

MATCH: 此规则匹配代理组中的正则表达式模式，并可用于从该组中选择特定的代理。 示例: MATCH,DIRECT
