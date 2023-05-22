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
import { ReactComponent as Logo } from './logo.svg';

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
import React from 'react';
import './App.css';
import background from './svg/background.svg'

function App() {
  return (
    <div className="App" style={{ backgroundImage: `url(${background})` }}>
      <h1>SVG as Background Image</h1>
    </div>
  );
}

export default App;
```


### 作为SVG容器的内容

以antd 为例子

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
