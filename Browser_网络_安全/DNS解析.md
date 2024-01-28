## 前言

本文总结 DNS(域名系统)解析相关的知识点，大纲如下：

- DNS 的由来
- DNS 解析的过程
- nodejs 实现 DNS 解析
- 四类自定义域名的解析过程

## DNS 由来

### IP 的记忆问题

在本地开发的时候，我们会通过 webpack 或者 vite 等开发工具启动一个本地服务，然后通过浏览器访问 ip 来访问这个服务。

而在互联网发展的早期，当还没有域名系统（DNS）之前，人们主要通过使用 IP 地址直接访问网络资源。这意味着用户必须知道目标服务器的确切 IP 地址，难度很大。

### host 文件

为了解决 IP 的记忆问题，人们想到了一个办法，就是在本地维护一个 host 文件，这个文件中包含了域名和 IP 的映射关系，这样我们就可以通过域名来访问网络资源了.

> www.google.com -> xxx

具体的实现方式如下：

- 所有的主机都维护一个本地的 HOSTS 文件。这个文件包含了一份域名到 IP 地址的映射表，以及其他相关的信息
- 当添加新主机的时候，网络管理员或系统管理员会被通知有新的机器加入网络，他们负责维护网络的 HOSTS 文件，添加新的主机信息
- 一旦更新完成，网络管理员需要确保这个新的 HOSTS 文件被传递到所有需要使用它的主机(通过复制或者网络传递等形式)

显然这种手动的、分散式的更新方式显然不够高效，尤其是在网络规模扩大的情况下，于是 DNS 系统应运而生。

DNS 系统诞生后，本地的 host 文件依然没有被淘汰，比如我们可以通过(switch host 等软件)修改本地的 host 文件来实现域名的解析

![switch host文件截图](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/switch-host-snapshot.png)

## 域名的分层结构

域名的结构是分层的，从右到左分为不同的部分，每个部分都有特定的含义。

1. 顶级域名（Top-Level Domain，TLD）：顶级域名是域名层次结构中的最高级别，位于域名的最右侧。顶级域名可以分为两类：

- 通用顶级域名（Generic Top-Level Domains，gTLD）： 这包括常见的域名后缀，如.com、.net、.org 等，通常不受特定国家或地区的限制。
- 国家代码顶级域名（Country Code Top-Level Domains，ccTLD）： 这些是与特定国家或地区相关联的域名后缀，如.us（美国）、.uk（英国）、.cn（中国）等.
-

2. 二级域名（Second-Level Domain，SLD）：二级域名是位于顶级域名下面的部分，是由域名注册者自定义的。在www.example.com中，"example"是二级域名。

3. 子域名（Subdomain）：子域名是位于二级域名之下的部分，也是由域名注册者自定义的。例如，在 blog.example.com 中，"blog"是子域名。

4. 主机名（Hostname）：主机名是域名中最左侧的部分，通常是用来指定某台服务器的。在 www.example.com 中，"www"是主机名。其他的主机名还有 mail、ftp、pop 等。

### DNS 服务器的分类

DNS 服务器的数量是有限的，如果只有一个 DNS 服务器，那么它的负载将会非常大，而且容易成为攻击的目标。所以，DNS 服务器被分成了多个层级，每一层都有多台服务器，这样就可以分担负载，提高可用性。

DNS 服务器分为以下几类：

- 根域名服务器（Root DNS Server）： 根域名服务器是最高层次的 DNS 服务器，它管理顶级域名服务器的信息。根域名服务器的数量非常有限，目前全球只有 13 台根域名服务器，它们的名称分别是 a.root-servers.net 到 m.root-servers.net。
- 顶级域名服务器（Top-Level DNS Server）： 顶级域名服务器管理各自顶级域名下的权威域名服务器的信息。比如，.com 顶级域名服务器管理所有 .com 域名的权威域名服务器的信息。
- 权威域名服务器（Authoritative DNS Server）： 权威域名服务器管理某个域名的具体解析信息。比如，juejin.cn 域名的权威域名服务器就管理着 juejin.cn 域名的解析信息。

## DNS 的解析过程

DNS 查询的结果通常会在本地域名服务器中进行缓存，如果本地域名服务器中有缓存的情况下，则会跳过如下 DNS 查询步骤，很快返回解析结果。下面的示例则概述了本地域名服务器没有缓存的情况下，DNS 查询所需的 8 个步骤：

- 用户在 Web 浏览器中输入“example.com”， 则由本地域名服务器开始进行递归查询。

- 本地域名服务器采用迭代查询的方法，向根域名服务器进行查询。(**系统启动时从网络服务提供商那里获取到根域名服务器的地址，并将其缓存起来**)

- 根域名服务器告诉本地域名服务器，下一步应该查询的顶级域名服务器.com TLD 的 IP 地址。

- 本地域名服务器向顶级域名服务器.com TLD 进行查询。

- .com TLD 服务器告诉本地域名服务器，下一步查询 example.com 权威域名服务器的 IP 地址。

- 本地域名服务器向 example.com 权威域名服务器发送查询。

- example.com 权威域名服务器告诉本地域名服务器所查询的主机 IP 地址。

- 本地域名服务器最后把查询的 IP 地址响应给 Web 浏览器。

一旦 DNS 查询的 8 个步骤返回了 example.com 的 IP 地址，浏览器就能够发出对网页的请求：

- 浏览器向 IP 地址发出 HTTP 请求

- 该 IP 处的 Web 服务器返回要在浏览器中呈现的网页

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2024/dns-resolver.png)

## DNS 解析 CNAME 等

DNS 解析服务并不单单只有 域名 -> IP 地址一个功能，还能解析邮件服务器、CNAME 配置等

### A 记录

上面一直在说的 域名 -> IP 地址 这样的 Map 记录叫做 A 记录，也即 Active Record。 是最为常见的域名解析

如果你购买了服务器， 并希望将域名解析到该服务器，你需要登录到你的服务器提供商的管理面板或控制台，查找服务器的公网 IP 地址， 然后进入你购买域名的 DNS 托管提供商的网站，添加一条 A 记录，将域名解析到你的服务器 IP 地址。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/dns-add-record.png)

### CNAME

CNAME(Canonical Name),别名记录用于创建一个域名的别名，将一个域名指向另一个域名。当 DNS 系统在查询 CNAME 左边的名称的时候，都会转向 CNAME 右边的名称在进行查询，一直最总到最后的 PTR 或 A 名称，成功查询才会做出回应，否则失败。

假设你有一个 GitHub Pages 网站，网址是 yourusername.github.io，而你希望使用自定义域名 yourcustomdomain.com。在这个情景中，你可以使用 CNAME 记录来实现这个自定义域名的映射

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/github-cname-dns-setting.png)

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/cname-github-page.png)

### MAIL

通常用于指定与电子邮件服务相关的记录

## 更多相关术语介绍

### 递归查询

是指 DNS 服务器在收到用户发起的请求时，必须向用户返回一个准确的查询结果。如果 DNS 服务器本地没有存储与之对应的信息，则该服务器需要询问其他服务器，并将返回的查询结果提交给用户。

### 迭代查询

是指 DNS 服务器在收到用户发起的请求时，并不直接回复查询结果，而是告诉另一台 DNS 服务器的地址，用户再向这台 DNS 服务器提交请求，这样依次反复，直到返回查询结果。

### TTL

英文全称 Time To Live ，这个值是告诉本地域名服务器，域名解析结果可缓存的最长时间，缓存时间到期后本地域名服务器则会删除该解析记录的数据，删除之后，如有用户请求域名，则会重新进行递归查询/迭代查询的过程。

### TLD Server

英文全称 Top-level domains Server，指顶级域名服务器。

### DNS Resolver

指本地域名服务器，它是 DNS 查找中的第一站，是负责处理发出初始请求的 DNS 服务器。运营商 ISP 分配的 DNS、谷歌 8.8.8.8 等都属于 DNS Resolver。

### Root Server

指根域名服务器，当本地域名服务器在本地查询不到解析结果时，则第一步会向它进行查询，并获取顶级域名服务器的 IP 地址。

### DNS Query Flood Attack

指域名查询攻击，攻击方法是通过操纵大量傀儡机器，发送海量的域名查询请求，当每秒域名查询请求次数超过 DNS 服务器可承载的能力时，则会造成解析域名超时从而直接影响业务的可用性。

### DNSSEC

域名系统安全扩展（DNS Security Extensions），简称 DNSSEC。它是通过数字签名来保证 DNS 应答报文的真实性和完整性，可有效防止 DNS 欺骗和缓存污染等攻击，能够保护用户不被重定向到非预期地址，从而提高用户对互联网的信任。

## Nodejs 实现 DNS 服务器

可参考这篇[文章](https://mp.weixin.qq.com/s/Gl94ISY5N4BYyYmVT9-QFQ)

## 参考

- https://mp.weixin.qq.com/s/Gl94ISY5N4BYyYmVT9-QFQ
