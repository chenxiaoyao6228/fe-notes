---
title: 实现react-router
date: 2019-06-15
categories:
  - tech
tags:
  - react
permalink: 2019-06-15-implement-react-router
---

## 路由的原理

路由的实现有两种方式， 一种是老式的基于 location.hash 路由，兼容绝大部分浏览器， 一种是基于 history api 的新式路由。

### location

[location](https://developer.mozilla.org/en-US/docs/Web/API/Location)对象上挂载了很多的属性，可以很方便地对当前的 url 进行处理

- 路由获取： hash 路由根据 loaction.hash 可以拿到当前的路由进行判断，
- 路由跳转：通过 location.replace， location.assign， replace 和 assign 的区别在于 replace 无法实现回退功能
- 路由事件监听： 通过[onHashChange](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onhashchange)事件添加回调

```js
function hashHandler() {
  console.log("The hash has changed!");
  // 进行其他操作...
}

window.addEventListener("hashchange", hashHandler, false);
```

### History Api

[history](https://developer.mozilla.org/en-US/docs/Web/API/History)

- 当前状态获取: history.state
- 路由跳转：history.pushState/replaceState 以及 go, back 方法
- 路由事件监听： [window.onpopstate](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate)

```js
window.onpopstate = function (event) {
  alert(
    "location: " + document.location + ", state: " + JSON.stringify(event.state)
  );
};

history.pushState({ page: 1 }, "title 1", "?page=1");
history.pushState({ page: 2 }, "title 2", "?page=2");
history.replaceState({ page: 3 }, "title 3", "?page=3");
history.back(); // alerts "location: http://example.com/example.html?page=1, state: {"page":1}"
history.back(); // alerts "location: http://example.com/example.html, state: null
history.go(2); // alerts "location: http://example.com/example.html?page=3, state: {"page":3}
```

## React-router 基本使用

[官方的 quick start](https://reacttraining.com/react-router/web/guides/quick-start)

主要 api:

- Router: 包裹组件， 全局传值
- 触发跳转： Link 组件, to 匹配 path 提示跳转, component 指明要加载的组件
- 监听跳转变化：Route 组件 path 匹配 link 中的 to
- 单一匹配： Switch, 只匹配第一个组件， 其余的忽略
- 重定向： redirect

## React-router 的简易实现

```js
import React, { useState, useContext, useEffect } from "react";

let HistoryContext = React.createContext();

export const HashRouter = ({ children }) => {
  const [record, setRecord] = useState({
    location: {
      pathname: window.location.hash.slice(1) || "/",
    },
  });
  useEffect(() => {
    window.location.hash = window.location.hash || "/";
    window.addEventListener("hashchange", handleHashChange, false);
    return () => {
      window.removeEventListener("hashchange", handleHashChange, false);
    };
  }, []);
  function handleHashChange() {
    setRecord({
      location: {
        ...record.location,
        pathname: window.location.hash.slice(1) || "/",
      },
    });
  }
  return (
    <HistoryContext.Provider value={{ record, setRecord }}>
      {children}
    </HistoryContext.Provider>
  );
};

// link组件: 触发路由跳转
export const Link = ({ to, children }) => {
  return <a href={"#" + to}>{children}</a>;
};

const { pathToRegexp } = require("path-to-regexp");

export const Route = ({ path, children }) => {
  // 根据路由是否匹配进行展示,使用正则进行匹配, 默认为不精确匹配
  const { record } = useContext(HistoryContext);
  let regex = pathToRegexp(record.location.pathname, [], { end: false });
  let match = regex.test(path);
  return match ? children : null;
};

// 匹配到一个之后不再进行匹配
export const Switch = ({ children }) => {
  const { record } = useContext(HistoryContext);
  // debugger;
  let pathname = record.location.pathname;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    let path = child.props.path;
    let reg = pathToRegexp(pathname, [], { end: false });
    if (reg.test(path)) {
      return child;
    }
  }
  return null;
};

// 其他条件匹配都失败的时候，自动跳转到指定页面,如login
export const Redirect = ({ to }) => {
  window.location.hash = to;
  return null;
};
```
