## 前言

本文总结 React 中的代码优化的技巧

## 按需加载

### 模块按需加载

webpack 提供了动态 import()语法来实现模块按需加载：

```js
// moduleA.js
export const greetA = () => console.log("Hello from Module A");

// main.js
const buttonA = document.getElementById("buttonA");
buttonA.addEventListener("click", () => {
  import("./moduleA").then((module) => {
    module.greetA();
  });
});
```

### 路由按需加载

代码拆分和动态导入是一种优化手段，通过延迟加载一些代码，可以减小初始加载的包大小，提高应用程序的性能。React 提供了 React.lazy 和 Suspense 来实现组件级别的懒加载。我们可以结合 React.lazy 和 React Router 来实现路由级别的懒加载。

```js
// App.js
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const Home = lazy(() => import("./Home"));
const About = lazy(() => import("./About"));

const App = () => {
  return (
    <Router>
      <div>
        <h1>我的 React 应用</h1>

        {/* 使用 Suspense 包裹整个应用 */}
        <Suspense fallback={<div>Loading...</div>}>
          {/* 使用 Switch 包裹 Route，确保只渲染匹配的第一个 Route */}
          <Switch>
            {/* 使用 Route 配置按需加载的组件 */}
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
          </Switch>
        </Suspense>
      </div>
    </Router>
  );
};

export default App;
```

## 使用 React.memo 和 useMemo 优化数据处理

在 React 组件中，使用 React.memo 可以避免不必要的组件渲染，而 useMemo 可以用于缓存计算结果，避免在每次渲染时重新计算。

```js
import React, { useState, useEffect, useMemo } from "react";
import fetchData from "./DataService";

const DataComponent = ({ endpoint }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      const result = await fetchData(endpoint);
      setData(result);
    };

    fetchDataAndUpdateState();
  }, [endpoint]);

  // 使用 useMemo 缓存处理后的数据
  const processedData = useMemo(() => {
    if (!data) {
      return null;
    }

    // 进行数据处理的逻辑，这里只是简单的示例
    return data.map((item) => item.name.toUpperCase());
  }, [data]);

  return (
    <div>
      <h2>Data Component</h2>
      <p>Original Data: {JSON.stringify(data)}</p>
      <p>Processed Data: {JSON.stringify(processedData)}</p>
    </div>
  );
};

// 使用 React.memo 包裹组件，避免不必要的渲染
export default React.memo(DataComponent);
```

## 避免使用内联对象

```js
function MyComponent({ data }) {
  // 内联对象，每次渲染都会创建新的对象
  const style = { color: "red" };

  return <div style={style}>{/* 组件内容 */}</div>;
}
```

上述代码中，每次 MyComponent 组件渲染时，都会创建一个新的 { color: 'red' } 对象。即使 style 的内容在每次渲染时都相同，但由于对象的引用不同，React 认为它们是不同的，会触发组件的重新渲染。

为了避免这个问题，可以采用以下两种方式：

1. 将样式对象提到组件外部：

```jsx
const myStyle = { color: "red" };

function MyComponent({ data }) {
  return <div style={myStyle}>{/* 组件内容 */}</div>;
}
```

2. 使用内联样式的动态值：

```jsx
function MyComponent({ data }) {
  const color = "red";

  return <div style={{ color }}>{/* 组件内容 */}</div>;
}
```

将样式属性的值设置为变量，而不是创建一个新的对象。这样在每次渲染时，只是创建一个新的字符串，而不是新的对象，避免了不必要的重新渲染。

## 使用 requestAnimationFrame 模拟 setInterval

使用 requestAnimationFrame 模拟 setInterval 的好处在于更好地与浏览器的渲染周期同步，提供更平滑的动画效果。但为了模拟间隔执行，可能需要引入递归调用 requestAnimationFrame。

```js
// 执行动画逻辑
function animate() {
  // 模拟每秒执行一次
  setTimeout(() => {
    requestAnimationFrame(animate);
  }, 1000);
}

animate();
```

## 避免使用匿名函数

虽然匿名函数可以更加方便的对函数进行传参，但是同内联对象一样，每一次重新渲染都会生成一个新的函数，所以我们应该尽量避免使用内联函数。

```jsx
import React from "react";

// 避免这样做
function Component(props) {
  return <AnotherComponent onChange={() => props.callback(props.id)} />;
}

// 优化
function Component(props) {
  const handleChange = useCallback(() => props.callback(props.id), [props.id]);
  return <AnotherComponent onChange={handleChange} />;
}
```

## 事件销毁

手动绑定的事件监听器，如定时器，需要在组件销毁时手动解绑，以防止内存泄漏。

```js
import React, { useEffect, useRef } from "react";

function ComponentWithTimer() {
  const timerRef = useRef(null);

  useEffect(() => {
    // 在组件挂载时启动定时器
    timerRef.current = setInterval(() => {
      // 定时任务逻辑
    }, 1000);

    // 在组件卸载时清除定时器
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  return <div>{/* 组件内容 */}</div>;
}
```

## 使用 Fragment 来避免添加额外的 DOM 节点

有些情况下，组件需要返回多个节点，但是一个函数只允许有一个返回值，如果是使用一个 div 进行包裹，那么一个完整的应用程序则会添加太多额外的无用标签，随着标签越来越多，加载速度也越来越慢。我们可以通过使用 Fragment 来避免创建不必要的元素。

```jsx
function Component() {
  return (
    <>
      <h1>Hello world!</h1>
      <h1>Hello there!</h1>
      <h1>Hello there again!</h1>
    </>
  );
}
```
