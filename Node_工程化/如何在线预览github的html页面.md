## 前言

`fe-notes`项目里面有很多的demo演示页面，很多时候都仅仅是一个html页面(跑起来复杂的页面比如React应用也使用CDN 方案)，虽然可以右键菜单保存到本地进行预览，但是还是比较繁琐，如何能直接在线打开预览？

![](../../cloudimg/2023/github-preview-html-1.png)


经过搜索可以发现了一个`github bitbucket html-preview`的仓库，但是有些小bug, 于是独立部署了一下

使用方式是这样的, 有个名为`html-preview`独立的repo可以用来承载所有repo中的html加载的流程, 对应需要预览的内容通过查询字符传入

> https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/React%E7%9B%B8%E5%85%B3/_demo/useMedia/index.html

下面讲讲工作原理：

## 如何获取Demo的html内容？

Github实际上是支持直接获取文件内容的

原本在这里的内容

> https://github.com/chenxiaoyao6228/fe-notes/blob/main/React%E7%9B%B8%E5%85%B3/_demo/useMedia/index.html

对应可以在这里拿到

> https://raw.githubusercontent.com/chenxiaoyao6228/fe-notes/main/React%E7%9B%B8%E5%85%B3/_demo/useMedia/index.html

查看响应头, 返回的是`text/plain`
![](../../cloudimg/2023/github-preview-html-2.png)


## 如何组装

在拿到html文本之后，调用`document.open`相关的api进行写入

![](../../cloudimg/2023/github-preview-html-3.png)


## 参考

- [codetabs cors-proxy](https://codetabs.com/cors-proxy/cors-proxy.html)