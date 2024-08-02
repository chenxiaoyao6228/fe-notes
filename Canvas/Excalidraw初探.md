## 前言

最近团队在做授课相关的共享白板工具， 为此预研了下 Excalidraw。

## Excalidraw 的发展历程

作为比较有名的一款手绘风格的共享白板工具， Excalidraw 的发展不可谓不迅猛。

2020.1.1 作者发了一个 demo, 两周就 1.5k+star, 经过短短两年，截至目前(2023-05-27)，已经有 48.2Kstar.

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/excalidraw-intro-1.png)

2021 年，Excalidraw 成立了一家公司.
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/excalidraw-intro-2.png)

## Excalidraw 资料

- [Excalidraw 官网](https://github.com/excalidraw/excalidraw)
- [Excalidraw and Fugu: Improving core user journeys | Session](https://www.youtube.com/watch?v=EK1AkxgQwro),对应这个官方的 [post](https://blog.excalidraw.com/excalidraw-and-fugu/)
- [Excalidraw: Under the hood of the virtual whiteboard](https://www.youtube.com/watch?v=gvEoTVjVjB8)
- [Excalidraw: Cool JS Tricks Behind the Scenes by Excalidraw Creator Christopher Chedeau aka @vjeux](https://www.youtube.com/watch?v=fix2-SynPGE)

## 源码阅读

拉取代码，新建.vscode/setting.json 进行 debug 配置。

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "whiteboard debug",
      "request": "launch",
      "type": "chrome",
      "runtimeExecutable": "stable",
      "runtimeArgs": ["--auto-open-devtools-for-tabs"],
      "userDataDir": true,
      "url": "http://localhost:3000",
      // 过滤三方文件
      "skipFiles": ["<node_internals>/**/*.js", "**/node_modules/**"]
    }
  ]
}
```

## 数据模型

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/excalidraw-data-model.png)

Excalidraw 的数据分为两个部分：

- 一个是画布本身的状态，如当前选中的工具类型，画笔颜色等
- 一个是画布上的元素状态，如矩形的位置，大小，颜色等

元素在协同状态下会通过 websocket 发送给其他用户，其他用户会根据元素的状态进行渲染。

```json
[
  {
    "id": "VVkDvO-IukM-T5VMakOmr",
    "type": "rectangle",
    // 绘制相关的属性
    "x": 0,
    "y": 0,
    "width": 100,
    "height": 100,
    "angle": 0,
    "strokeColor": "#F6C759",
    "backgroundColor": "transparent",
    "fillStyle": "hachure",
    "strokeWidth": 4,
    "strokeStyle": "solid",
    "roughness": 1,
    "opacity": 100,
    "groupIds": [],
    "roundness": {
      "type": 2
    },
    "boundElements": null,
    "isDeleted": false,
    "locked": false, // 元素是否可编辑，在viewMode模式下使用
    "link": null,
    // 协同相关的属性
    "seed": 1727948779,
    "version": 137,
    "versionNonce": 387629675,
    "updated": 1692083547354
  }
]
```

Excalidraw 中使用了一个 Scene 静态工具类来专门对元素进行管理

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/excalidraw-scene-class.png)

## 绘制流程

用户指针事件 -> 事件处理 -> 更新元素状态 -> componentDidUpdate -> renderScene -> renderElements

## 手写风格

基于rough.js, 需要处理线/圆/文字

- 书写的时候最后一个点不与第一个点相连，而是与第二个点连接，看起来就会有一些毛刺的感觉

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/excalidraw-roughjs.png)

- 文字手写风格字体库是作者联系了一个开源很久的字体库的作者实现的，并且其他很多国家的文字不支持，比如[这里](https://github.com/excalidraw/excalidraw/issues/6394)

## 状态管理

Excalidraw 自己实现了一个类似 Redux 的状态管理库 ActionManager.

Action： register 为提供的一个简易的注册接口，把所有的 action 收集起来到一个数组里面、

```js
let actions = [];

const register = (action) => {
  actions.push(action);
  return action;
};

const increment = register({
  name: "increment",
  perform: (state) => ({
    ...state,
    counter: state.counter + 1,
  }),
});

const decrement = register({
  name: "decrement",
  perform: (state) => ({
    ...state,
    counter: state.counter - 1,
  }),
});
```

ActionManager: App 初始化的时候会初始化一个 actionManager, 同时注册所有的 action。

```js
class ActionManager {
  constructor(updater, getState) {
    this.updater = updater;
    this.actions = {};
    this.getState = getState;
  }

  registerAction = (action) => {
    this.actions[action.name] = action;
  };

  registerAll = (actions) => {
    actions.forEach((action) => this.registerAction(action));
  };

  renderAction = (name, payload) => {
    const action = this.actions[name];
    const newState = action.perform(this.getState(), payload);
    this.updater(newState);
  };
}
```

组件渲染的时候把 actionManager 和 appState 传入组件，没有 redux 的 connect 操作，组件内部通过 actionManager 来更新状态。

```js
<Counter actionManager={this.actionManager} appState={this.state} />
```

```js
<button onClick={this.props.actionManager.renderAction("increment")}>
  Increment
</button>
```

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/excalidraw-action-manager.gif)

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/excalidraw-state-management/index.html), 查看示例代码请点击[此处](https://github.com/chenxiaoyao6228/fe-notes/blob/main/Canvas/_demo/excalidraw-state-management/index.html)

## 协同

主要涉及的技术点如下：

### 通讯机制

基于上述数据模型中的元素 Element, 在元素发生变更的时候更新版本，然后通过 socket.io 进行广播

### 数据安全性

去中心化端对端加密: excalidraw 的序列化后的数据就是一坨 json, 那么这也就意味在在多人协作的场景中，数据可能被三方劫持, 这时候就可以考虑对称加密的方式。考虑到业务场景，Excalidraw 选择了端对端加密的方式。
缺陷就是如果系统需要列出其他用户的 scene, 那 server 就必须知道所有人的 scene 信息，这种情况下就需要一个中心化的数据处理中心。

实现依据两个技术：

1.  路由 hash 后面的数据不会通过网络请求发送，但是 javascript 可以拿到，因此可以作为端对端加密中的 private key
2.  web 端通过[Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)进行加密

当开启分享的时候，会先通过加密生成 key

```js
const url = new URL(window.location.href);
url.hash = `json=${json.id},${encryptionKey}`;
const urlString = url.toString();
```

最终生成这样的一个 link

> https://excalidraw.com/#room=7ba1b01ed33b3e02fbb0,mZITFQhcSROwpPJwPqXmKg

当对方拿到链接的时候，再对应进行解密即可。

```js
const key = await getCryptoKey(privateKey, "decrypt");
return window.crypto.subtle.decrypt(
  {
    name: "AES-GCM",
    iv,
  },
  key,
  encrypted
);
```

当然这只是简单的介绍，有兴趣的朋友可以深入看看[Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

### 冲突解决

协同的难点之一在于冲突解决，主要有新增/删除/编辑三种情况

1. 新增/编辑

Excalidraw为每个元素添加了id以及version属性

* 每次用户对元素进行了变更，找到对应id的版本进行变更
* 如果两个用户同时进行了文件的变更，当收到来自其他客户端的更新状态时， 拥有更高版本的那个用户会胜出

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/excalidraw-collab-add.png)

2. 删除

如果用户A删除了其中的一个元素， 传输过来的数据就没有当前元素了, id和version失效。

因此excalidraw添加了一个isDeleted字段，通过这种软删除的形式实现删除效果。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/excalidraw-collab-delete.png)

3. 多人同时编辑

作者的观察是: 在一个多人协作的白板中，你可以看到多人的鼠标，但是你不太会在同一个画布上进行绘制( 比如教师讲课的时候)

但Excalidraw还是通过技术手段解决了这个冲突，Excalidraw给每个元素都增加了一个versionNonce字段。每次只要version增加了，都将versionNonce设置成一个随机整数。在合并的时候，如果遇到version相同的两个元素，则保留值较小的versionNonce对应的状态.


## 撤销重做

使用双栈模型，具体可以参看[这里](./canvas实现撤销重做.md)

## 性能优化方案

- renderScene 防抖
- 使用离屏 Canvas 缓存元素，然后再通过 ctx.drawImage 绘制图像到画布上


## 文件管理

有几个比较新的文件 API
- window.showOpenFilePicker: 允许网页应用程序弹出浏览器的文件保存对话框，以便用户选择文件的保存位置和名称,提供更多的文件命名和保存位置的控制，使用户能够更好地管理保存的文件
- window.showSaveFilePicker: 允许网页应用程序弹出浏览器的文件保存对话框，以便用户选择文件的保存位置和名称,可以提供更多的文件命名和保存位置的控制，
- window.showDirectoryPicker: 允许网页应用程序通过浏览器的目录选择对话框让用户选择一个目录,提供了更好的目录选择体验，使用户能够方便地选择目录而不必手动输入路径
-DataTransferItem.getAsFileSystemHandle: 允许你从拖放操作中获取数据，并将其转换为 FileSystemHandle 对象.

可以兼容性都不太好，如果需要用的话目前建议使用GoogleChromeLabs开源的[browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access)

## 其他

### 层级管理

不像 FabricJS, Excalidraw 中没有对应的 zIndex 管理元素的层级, 而是通过元素在数组中的顺序来判断

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/excalidraw-zIndex.png)



### 插件系统

[具体参见这里](https://libraries.excalidraw.com/?theme=light&sort=default)
### 开发环境通过 Object.defineProperties 暴露状态方便测试

也方便判断是哪个 setState 触发了 componentDidUpdate

```js
if (
  process.env.NODE_ENV === ENV.TEST ||
  process.env.NODE_ENV === ENV.DEVELOPMENT
) {
  const setState = this.setState.bind(this);
  Object.defineProperties(window.h, {
    state: {
      configurable: true,
      get: () => {
        return this.state;
      },
    },
    setState: {
      configurable: true,
      value: (...args: Parameters<typeof setState>) => {
        return this.setState(...args);
      },
    },
    app: {
      configurable: true,
      value: this,
    },
    history: {
      configurable: true,
      value: this.history,
    },
  });
}
```

## 不足

- 代码组织混乱，一个 App.tsx 竟然有六千多行，代码阅读理解困难。

- 所有东西都怼到一个 APPState 里面，一些与渲染状态无关的状态更新(比如切换笔的颜色)也会导致页面渲染，性能欠佳，尤其在一些低端的设备上。

- 自带的国际化方案不完善，不支持动态切换语言


## 总结

<iframe width="100%" height="600" src="https://chenxiaoyao6228.github.io//excalidraw-github-viewer/?https://github.com/chenxiaoyao6228/cloudimg/blob/main/_Gragh/process.excalidraw" />
