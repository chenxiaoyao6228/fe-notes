---
date: 2023-05-25
permalink:  clash-configuration-handbook
title: clash配置指南
categories: 
  - tech
tags:
  - javascript
---


## 前言

[Clash](https://github.com/Dreamacro/clash/blob/dev/README.md)是一款非常好用的科学上网工具，但是要合理地使用的话需要对其配置有一定的熟悉，希望可以借本文梳理与之相关的概念:

* 科学上网的原理
* clash配置文件
* clash配置中的Global, Rule, Direct
* 配置规则中的Proxy-group, LAN config
* 如何确认配置生效


## clash配置文件

* config.yaml: clash默认的配置文件
* NEWclash.yaml: 用户的配置文件在中
* cache.db: 一个数据库文件, 用来缓存 DNS 记录提升性能;
* Country.mmdb: IP 与国家映射配置文件

![](../../cloudimg/2023/clash-2.png)

### yaml语法
关于yaml(发音 /ˈjæməl/ )语法可参见阮一峰老师的[YAML 语言教程](https://www.ruanyifeng.com/blog/2016/07/yaml.html)

## 模式： Global, Rule, Direct

Clash可以根据配置可以运行不同的模式。

![](../../cloudimg/2023/clash-1.png)

Global：所有的流量将会遵循同一个Proxy规则，即全局代理，所有流量将会被发送到同一个代理服务器，无论请求的目的地址是什么。

Rule：该策略依据自定义的规则进行流量路由，比如可以根据网址、IP地址、或流量类型等来进行分流，对于不同的流量目的地址，可以采用不同的代理策略，包括使用不同的代理协议（如HTTP、Socks5、Shadowsocks等）。

Direct：所有流量将会直接走本地网络，不会被发送到任何代理服务器中转。

## config.yaml
下面看看官方的默认配置文件
```yaml
# (HTTP and SOCKS5 in one port)
mixed-port: 7890
# RESTful API for clash
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

### external-controller
Clash的RESTful API，可用于验证配置是否成功



## 全部配置规则

DOMAIN-SUFFIX: 此规则匹配网站的域名后缀，并可用于指定如何处理该网站的请求。处理请求的选项有 "DIRECT"（不使用代理发送请求）、"PROXY"（通过代理发送请求）或 "REJECT"（拒绝请求）。 示例: DOMAIN-SUFFIX,openai.com,DIRECT

DOMAIN-KEYWORD: 此规则匹配网站URL中的关键词，并可用于指定如何处理该网站的请求（与 DOMAIN-SUFFIX 相同）。 示例: DOMAIN-KEYWORD,google,DIRECT

DOMAIN: 此规则匹配网站的精确域名，并可用于指定如何处理该网站的请求（与 DOMAIN-SUFFIX 相同）。 示例: DOMAIN,google.com,DIRECT

IP-CIDR: 此规则匹配网络的IP地址范围，并可用于指定如何处理该网络的请求（与 DOMAIN-SUFFIX 相同）。 示例: IP-CIDR,0.0.0.0/8,DIRECT

GEOIP: 此规则匹配客户端IP地址的国家代码，并可用于指定如何处理该国家的请求（与 DOMAIN-SUFFIX 相同）。 示例: GEOIP,CN,DIRECT

Fallback: 此规则指定如果其他规则不匹配时要使用的代理组。 示例: Fallback,Proxy

MATCH: 此规则匹配代理组中的正则表达式模式，并可用于从该组中选择特定的代理。 示例: MATCH,DIRECT


## Proxy-group(代理组)

"代理组"模式类似于“混合”模式，但允许用户指定每个目的地使用哪些代理服务器。

## LAN config