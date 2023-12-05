## 前言

本文将介绍工作中会用到 CDN 相关的知识

## CDN 的工作原理

在理解 CDN 的工作原理之前，我们来了解CDN中的一些基本概念：

- **边缘节点（Edge Nodes）**： CDN 的服务器分布在全球各地，这些服务器通常被称为边缘节点。它们位于离用户更近的位置，负责缓存和提供静态资源。边缘节点之间的数据同步确保内容的一致性。

- **源服务器(Origin Server)**: 这是存储实际网站内容的原始服务器。当边缘节点缓存没有所需资源时，它们会从源服务器获取资源

- **缓存清除(Cache Purge)**: 当源服务器上的内容发生更改时，需要刷新 CDN 缓存，以便下次请求时能够获取最新的内容。这可以通过手动刷新或者设置缓存过期时间来实现

- **回源(Origin Fetch)**: 当边缘节点缓存没有所需资源时，它们会执行回源操作，从源服务器获取资源。回源可以是全量回源（获取整个资源）或部分回源（只获取发生变化的部分）。

- **缓存策略(HTTP 缓存策略)：** CDN 提供了多种缓存策略，包括强缓存和协商缓存。强缓存通过设置 Cache-Control 和 Expires 头来实现，而协商缓存则使用 Last-Modified 和 If-Modified-Since 或 ETag 和 If-None-Match 头。

## CDN 的配置

假设所在公司的内部cdn服务域名为cdn.mycompany.com, 实际上用的是阿里云的服务cdn.aliyun.cn, 当你通过cdn.mycompany.com部署的网站的静态资源到用户访问的时候，会经过以下过程：

- 阿里云注册，oss服务会自动分配一个域名，比如oss-cn-shanghai.aliyuncs.com, 这个域名就是**源站域名**，也就是源站服务器的域名，这个域名是不会变的，因为oss服务是阿里云的，所以这个域名是阿里云的域名，而不是你自己的域名，这个域名是不会变的。
- 通过webpack工具打包的静态资源，上传到oss服务上，这个过程是通过oss服务的sdk来实现的，这个sdk是阿里云提供的，你可以在你的项目中引入这个sdk，然后通过这个sdk来上传静态资源到oss服务上
- 通过阿里云的cdn服务，将oss服务的域名绑定到cdn服务上，这个过程是通过域名解析来实现的，比如你在域名解析服务商那里，将cdn.mycompany.com解析到cdn.aliyun.cn, 这样就可以通过cdn.mycompany.com来访问cdn.aliyun.cn了

## CDN 与前端性能优化

### Gzip 开启

## CDN 全球加速

## 参考

- [腾讯云-从零开始配置 CDN](https://cloud.tencent.com/document/product/228/3149)
- https://juejin.cn/post/7268297948638249015
