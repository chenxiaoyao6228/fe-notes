# chrome插件开发踩坑汇总

## 一、开发工具

### 1.脚手架

插件开发虽然使用的是传统的web技术，但是在组件通讯，状态管理，开发配置方面还是有许多坑的，这里推荐的是[plasmo](https://github.com/PlasmoHQ/plasmo) 正如官网描述的: 

> It's like next.js for browser extensions!

### 2.快速reload

在调试backgroundJS的时候，去插件页去刷新是一件很麻烦的事情, 推荐一个[插件](https://chrome.google.com/webstore/detail/quick-extension-reload/goeiakeofnlpkioeadcbocfifmgkidpb)

![](../../cloudimg/2023/chrome-extension-quick-reload.png)

## 二、插件构成

- manifest.json：相当于插件的 meta 信息，包含插件的名称、版本号、图标、脚本文件名称等，这个文件是每个插件都必须提供的，其他几部分都是可选的。

- background script：可以调用全部的 chrome 插件 API，实现跨域请求、网页截屏、弹出 chrome 通知消息等功能。相当于在一个隐藏的浏览器页面内默默运行。

- 功能页面：包括点击插件图标弹出的页面（简称 popup）、插件的配置页面（简称 options）。

- content script：是插件注入到页面的脚本，但是不会体现在页面 DOM 结构里。content script 可以操作 DOM，但是它和页面其他的脚本是隔离的，访问不到其他脚本定义的变量、函数等，相当于运行在单独的沙盒里。content script 可以调用有限的 chrome 插件 API，网络请求收到同源策略限制。

- injected-script: 注入页面的js文件，与项目页面的普通js代码一致，可以访问window变量，获取dom，无法使用chrome相关的api(主要用于处理contentScript无法解决的问题)


injectedScript的注入

需要在manifest的web_accessible_resources中声明需要注入的injected.js,  需要注意资源的路径

```json

{
"web_accessible_resources": [
    {
      "resources": [
        "contents/injected.js"
      ],
      "matches": [
        "http://*/*",
        "https://*/*",
        "<all_urls>"
      ]
    }
  ]
}
```