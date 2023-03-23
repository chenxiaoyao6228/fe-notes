---
title: 实现Vue-tiny-数据响应式
categories:
  - tech
tags:
  - vue
date: 2020-01-24
permalink: 2020-01-24-vue-tiny-reactive-and-setup
---

## 前言

响应式视图更新的基本原理是什么呢? 本文一起来探究

## 1. 起源

我们想要 b 的值跟随 a 发生变化

```js
let a = 10;
let b = a + 10;
console.log(b);
//
a = 20; // 此时b也应该发生对应的变化
b = a + 10;
console.log(b);
```

把 b 相对 a 发生变化的部分用一个 update 函数封装一下

```js
let a = 10;
let b;
function update() {
  b = a + 10;
  console.log(b);
}
update();

a = 20;
update();
```

## 2 手动依赖收集与更新

有没有办法"智能一点", 在 a 的值发生变更之后,自动执行 update 方法呢? 我们想到了发布订阅

```js
class Dep {
  constructor(value) {
    this._value = value;
    this.effects = new Set();
  }
  depend(effect) {
    this.effects.add(effect);
  }
  notice() {
    this.effects.forEach((effect) => {
      effect();
    });
  }
  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val;
    this.notice();
  }
}

let a = new Dep(10);
let b;
function update() {
  b = a.value + 15;
  console.log("b", b);
}
a.depend(update);
a.value = 20; // 控制台输出: b 35
```

上面实现的优点有两个:

1. 在 a 更新的时候回自动更新依赖
2. 在 a 有 b,c 等多个依赖的时候也能很好地处理

## 3. 引入 Proxy,自动依赖收集与更新

上面的实现有一定缺陷:

1. 同时需要手动调用 depend 进行依赖收集, 确实不够智能

2. 假如 a 是一个对象,b 依赖了 a 中的一个属性的话,不会发生变更

   ```js
   let a = new Dep({
     age: 10,
   });
   let b;
   function update() {
     b = a.value.age + 15;
     console.log("b", b);
   }
   a.depend(update);
   a.value.age = 20; // b不发生变更
   ```

有没有办法实现依赖的自动创建与依赖的自动收集呢? 我们可以借鉴 Vue3 的实现,使用 proxy

先看 api

```js
let a = reactive({
  age: 10,
});
let b;
effect(() => {
  b = a.age + 10;
  console.log(b);
});
a.age = 20; // 控制台输出30
```

这里, 通过参考 vue 的实现,我们可以回答:

1. 依赖何时收集,何时触发? => Proxy 劫持 getter 和 setter, 在 get 的时候执行依赖的收集, set 的时候执行更新

2. 依赖收集到哪里去 => depsMap, 保存了每个 target 对应的依赖
3. 如何避免依赖重复收集? => 使用一个 currentEffect flag 来标志
4. reactive, Dep, effect 函数三者的关系?

实现

```js
class Dep {
  constructor() {
    this.effects = new Set();
  }
  depend() {
    if (currentEffect) {
      this.effects.add(currentEffect);
    }
  }
  notice() {
    this.effects.forEach((effect) => {
      effect(); // effect调用的时候不需要传入dep.value
    });
  }
}

let targetMap = new Map();

function getDeps(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
}

export function reactive(target) {
  return new Proxy(target, {
    get(target, key) {
      // 要为每一个key进行依赖收集
      let dep = getDeps(target, key);
      // 依赖收集
      dep.depend();
      // 返回值
      return Reflect.get(target, key);
    },
    set(target, key, value) {
      let dep = getDeps(target, key);
      let result = Reflect.set(target, key, value);
      // 通知
      dep.notice();
      return result;
    },
  });
}

let currentEffect;
export function effectWatch(effect) {
  currentEffect = effect;
  effect();
  currentEffect = null;
}
```

## 4. update 与 render

如果我们把 b 对应 a 的变化理解成视图对应的数据的变化, mvvm 的雏形就出来了

视图与数据的关系可以用简单的函数来表示

> View = render(state)

沿用上面的 reactive 与 effectWatch, 假设我们有一个 App 对象

```js
import { effectWatch, reactive } from "./core/reactivity/index.js";

const App = {
  render(context) {
    // state => view
    effectWatch(() => {
      document.body.innerHTML = ``;
      const node = document.createTextNode(context.value);
      document.body.append(node);
    });
  },
  setup() {
    //初始化state
    const state = reactive({
      value: 0,
    });
    window.state = state; // 方便在控制台更新数据
    return state;
  },
};
App.render(App.setup()); // View = render(state)

export default App;
```

在项目文件夹下建立一个 html 文件进行测试

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue-tiny</title>
  </head>
  <body>
    <script type="module" src="./App.js"></script>
  </body>
</html>
```

上面在浏览器中使用了 es6 模块, 直接使用 file 协议访问的时候会报跨域的错误, 因此安装一个`http-server包`起一个本地的服务, 在

```js
yarn global add http-server
http-server -p=1234
```

访问的时候要注意所有的 import 必须带 js 后缀, 不然会报错

> Failed to load module script: The server responded with a non-JavaScript MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

在控制台输入下面语句,就能看到视图的变化了

```js
state.value++;
```

整理下代码, 改成和 Vue3 一样的写法:

```js
import { effectWatch } from "./reactivity/index.js";

export default function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      let context = rootComponent.setup();
      effectWatch(() => {
        let ele = rootComponent.render(context);
        rootContainer.appendChild(ele);
      });
    },
  };
}
```

App 函数(组件)

```js
import { reactive } from "./core/reactivity/index.js";

const App = {
  render(context) {
    return document.createTextNode(context.value);
  },
  setup() {
    const state = reactive({
      value: 0,
    });
    return state;
  },
};
export default App;
```

使用

```js
import createApp from "./core/index.js";
import App from "./App.js";

createApp(App).mount(document.querySelector("#root"));
```

至此,我们的数据更新到模板更新就基本完成了

## 参考

整理自: <https://www.bilibili.com/video/BV1hV411q7S8?p=2>
