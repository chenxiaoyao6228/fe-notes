# chrome 插件开发踩坑汇总

## 一、开发工具

### 1.脚手架

插件开发虽然使用的是传统的 web 技术，但是在组件通讯，状态管理，开发配置方面还是有许多坑的，这里推荐的是[plasmo](https://github.com/PlasmoHQ/plasmo) 正如官网描述的:

> It's like next.js for browser extensions!

### 2.快速 reload

在调试 backgroundJS 的时候，去插件页去刷新是一件很麻烦的事情, 推荐一个[插件](https://chrome.google.com/webstore/detail/quick-extension-reload/goeiakeofnlpkioeadcbocfifmgkidpb)

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/chrome-extension-quick-reload.png)

## 二、插件构成

- manifest.json：相当于插件的 meta 信息，包含插件的名称、版本号、图标、脚本文件名称等，这个文件是每个插件都必须提供的，其他几部分都是可选的。

- background script：可以调用全部的 chrome 插件 API，实现跨域请求、网页截屏、弹出 chrome 通知消息等功能。相当于在一个隐藏的浏览器页面内默默运行。

- 功能页面：包括点击插件图标弹出的页面（简称 popup）、插件的配置页面（简称 options）。

- content script：是插件注入到页面的脚本，但是不会体现在页面 DOM 结构里。content script 可以操作 DOM，但是它和页面其他的脚本是隔离的，访问不到其他脚本定义的变量、函数等，相当于运行在单独的沙盒里。content script 可以调用有限的 chrome 插件 API，网络请求收到同源策略限制。

- injected-script: 注入页面的 js 文件，与项目页面的普通 js 代码一致，可以访问 window 变量，获取 dom，无法使用 chrome 相关的 api(主要用于处理 contentScript 无法解决的问题)

## injectedScript 的注入

需要在 manifest 的 web_accessible_resources 中声明需要注入的 injected.js, 需要注意资源的路径

```json
{
  "web_accessible_resources": [
    {
      "resources": ["contents/injected.js"],
      "matches": ["http://*/*", "https://*/*", "<all_urls>"]
    }
  ]
}
```

contentScript 中通过 chrome 对应的 api 进行加载

验证: 打开页面如果有对应的 js 文件加载就可以了。
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/chrome-extension-injected-scripts.png)

与 contentScript 通过 postMessage 的形式进行通讯
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/chrome-extension-postmessage.png)

## 三、状态管理

在 v2 的时代， backgroundScript 是常驻的， 依据 redux ”single source of truth“的原则， 状态可以保存在 backgroundscript 中， 比较出名的状态管理库是
[webext-redux](https://github.com/tshaddix/webext-redux)

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/chrome-extension-webext-redux.png)

v3 的版本， backgroudScript 已经不常驻， 可能随时被销毁， 因此唯一的解决方式是： 基于 chrome.storage 的状态管理

可以参考： reduxed-chrome-storage 作者的[这篇文章](https://levelup.gitconnected.com/using-redux-in-event-driven-chrome-extensions-problem-solution-30eed1207a42)

当然， 最后还是选上面提到的 plasmo 配套的状态管理工具.

## 四、UI 注入&&样式隔离

由于 css 的全局性，往宿主页面通过 contentScript 中注入 UI 需要注意样式的隔离问题，目前常用的方案是

1. iframe： 需要处理对应的通讯问题
2. shadow dom 方案：主流的方案

在使用 shadow dom 作为隔离方案的时候，需要留意三方组件库如(anth)的弹窗、提示类, 因为为了避免层级因素等影响， 这类组件的实现往往使用了“transfer to body"技术，挂载的元素的节点在宿主项目的 body 上，导致挣脱 shadow dom 的束缚

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/chrome-extension-shadow-dom.png)

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/chrome-extension-shadow-dom-2.png)

## 五、通讯

和 electron 一样， popup, contentScript, background 之间需要处理进程之间消息通讯，[通信主页](https://developer.chrome.com/docs/extensions/mv3/messaging/)

```js
// 异步转同步
// backgroundJS
export const wrapAsyncFunction =
  (listener) => (request, sender, sendResponse) => {
    Promise.resolve(listener(request, sender)).then(sendResponse);
    return true;
  };

chrome.runtime.onMessage.addListener(
  wrapAsyncFunction(async function (
    request: any,
    sender: chrome.runtime.MessageSender
  ) {
    const { from, eventType, data } = request;
    if (from === "contentScript") {
      switch (eventType) {
        case "backgroundRequest":
          const { requestName, payload } = data;
          console.log("backgroundRequest in background");
          const result = await WeblateRequest[`${requestName}`](payload);
          console.log("backgroundRequest result", result);
          return result;
        default:
          break;
      }
    }
  })
);

// contentScript
const fetchEnLocaleRes = await chrome.runtime.sendMessage({
  from: "contentScript",
  eventType: "backgroundRequest",
  data: {
    requestName: "getProjectLocaleByLang",
    payload: {
      projectName,
      componentName,
      language: "en-US",
    },
  },
});
```

跨域请求
```
 {
    "host_permissions": [
      "http://xx.test.seewo.com/",
      "http://*/*",
      "https://*/*"
    ],
    "permissions": [
      "tabs",
      "scripting",
      "declarativeNetRequest",
      "declarativeNetRequestFeedback"
    ]
}
```