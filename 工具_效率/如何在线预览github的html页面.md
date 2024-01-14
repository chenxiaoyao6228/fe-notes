## 前言

`fe-notes`项目里面有很多的 demo 演示页面，很多时候都仅仅是一个 html 页面(跑起来复杂的页面比如 React 应用也使用 CDN 方案)，虽然可以右键菜单保存到本地进行预览，但是还是比较繁琐，如何能直接在线打开预览？

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/github-preview-html-1.png)

经过搜索可以发现了一个`github bitbucket html-preview`的仓库，但是有些小 bug, 于是独立部署了一下

使用方式是这样的, 有个名为`html-preview`独立的 repo 可以用来承载所有 repo 中的 html 加载的流程, 对应需要预览的内容通过查询字符传入

> https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/React%E7%9B%B8%E5%85%B3/_demo/useMedia/index.html

下面讲讲工作原理：

## 如何获取 Demo 的 html 内容？

Github 实际上是支持直接获取文件内容的

原本在这里的内容

> https://github.com/chenxiaoyao6228/fe-notes/blob/main/React%E7%9B%B8%E5%85%B3/_demo/useMedia/index.html

对应可以在这里拿到

> https://raw.githubusercontent.com/chenxiaoyao6228/fe-notes/main/React%E7%9B%B8%E5%85%B3/_demo/useMedia/index.html

查看响应头, 返回的是`text/plain`
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/github-preview-html-2.png)

## 如何组装

在拿到 html 文本之后，调用`document.open`相关的 api 进行写入

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/github-preview-html-3.png)

## 更多

目前此方案还不支持 esm 引入(不折腾了, 复杂的东西就直接上 code-sandbox 吧，毕竟只是临时写写 demo)，社区已经有一些尝试但是还不完全，有兴趣请看参考的部分

## 参考

- [codetabs cors-proxy](https://codetabs.com/cors-proxy/cors-proxy.html)
- [React, JSX, ES module imports (dynamic too) in browser without Webpack](https://medium.com/disdj/react-jsx-es-module-imports-dynamic-too-in-browser-without-webpack-9cf39520f20f)
- [Using ES Modules with babel-standalone](https://github.com/babel/babel/discussions/12059)
