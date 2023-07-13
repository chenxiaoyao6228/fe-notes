---
date: 2023-05-22
permalink: handling-images-in-webpack
title: webpack打包图片
categories:
  - tech
tags:
  - webpack
---

## 前言

webpack 中只能加载 js 文件， 处理图片文件需要通过对应的 loader 来实现，本文将回答以下几个问题:

- 项目中使用 svg 的几种方式
- file-loader, url-loader 的区别是？
- 图片压缩
- 插件背后的实现原理

## 项目中使用 svg 的几种方式

### 作为内联代码

```js
import { ReactComponent as Logo } from "./logo.svg";

function App() {
  return (
    <div className="App">
      <Logo />
    </div>
  );
}

export default App;
```

### 作为背景图

```js
import React from "react";
import "./App.css";
import background from "./svg/background.svg";

function App() {
  return (
    <div className="App" style={{ backgroundImage: `url(${background})` }}>
      <h1>SVG as Background Image</h1>
    </div>
  );
}

export default App;
```

### 作为 SVG 容器的内容

以 antd 为例子

```jsx
// Iconfont
import { Icon } from "antd";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "/public/iconfont.js",
});

export default IconFont;

// App.js
const App = () => {
  return (
    <div className="App">
      <IconFont type="logo" />
    </div>
  );
};
```

## Webpack 打包图片

### file-loader vs url-loader

file-loader 和 url-loader 是 webpack 中的两个常用的 loader，它们都用于处理资源文件的加载和处理，但是它们有一些不同点。

file-loader 主要用于处理文件资源，将资源文件输出到指定的目录中，并返回一个资源文件的 url 地址，可以通过设置 outputPath 参数来指定资源文件的输出目录，也可以通过设置 publicPath 参数来指定资源文件的 url 地址的前缀，它会将资源文件复制到指定目录中，并且返回一个字符串路径，以便在代码中使用。

url-loader 和 file-loader 相比，它可以将较小的文件直接转换成 base64 编码格式的字符串，以减少网络请求，而不需要将文件加载到本地，可以通过 limit 参数来控制需要转换成 base64 格式的文件大小，可以通过 fallback 参数来设置在文件转换失败时使用的备用加载器。

总的来说，当处理的文件较大且需要输出到指定目录时，可以使用 file-loader，当处理的文件较小且需要在代码中直接使用时，可以使用 url-loader。
