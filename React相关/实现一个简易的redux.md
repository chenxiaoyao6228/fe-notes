
## 前言

redux 算是 react 学习路上的一个难点, 尤其是对没有接触或函数式编程的人而言.这篇文章算是自己对 redux 理解的一个总结

## array.reduce

先贴一段大家比较熟悉的代码

```js
const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;

// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer));
// expected output: 10

// 5 + 1 + 2 + 3 + 4
console.log(array1.reduce(reducer, 5));
// expected output: 15
```

reduce, 在其他语言中也称为 fold, 意为折叠, 归约, 也就是对一个**序列**, 按照一定的方式进行处理,最终返回一个结果, 比如一连串的数字, 按照两个两个相乘或想加, 得出一个最终的积或和, 这里的**相加**或者**相乘**称为 reducer,定义的序列归约的方式

```js
const reducer = (accumulator, currentValue) => accumulator + currentValue;
```

其接受两个参数, 数列中的某个值, 以及初始值归约后的当前值

有了上述的知识点, 我们可以试着来实现一个 reduce

```js
Array.prototype.reduce = function (reducer, initVal) {
  let currentVal = initVal || this[0];
  let startIndex = initVal ? 0 : 1;
  for (let i = startIndex; i < this.length; i++) {
    currentVal = reducer(this[i], currentVal);
  }
  return currentVal;
};
```

## 发布-订阅

发布-订阅模式在前端中非常常见, 尤其是各大库,框架的事件系统基本原理就是它.原理其实很简单, 整个 PubSub 系统维护一个事件的监听池 listeners, 并且提供了两个方法: 监听事件(subscribe)和发布事件(publish), 监听事件的时候将对应的 callback 添加到该事件的回调列表中去, 发布的时候遍历该事件的 callback 列表, 执行对应的 callback

```js
function PubSub() {
  this.listeners = {};
  this.subscribe = (eventName, callback) => {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  };
  this.publish = function (eventName) {
    this.listeners[eventName].forEach((listener) => {
      listener();
    });
  };
}
```

一个简单的例子

```js
let pubsub = new PubSub();
pubsub.subscribe("广州航班", function () {
  console.log("通知A");
});
pubsub.subscribe("广州航班", function () {
  console.log("通知B");
});
pubsub.subscribe("广州航班", function () {
  console.log("通知c");
});
pubsub.subscribe("上海航班", function () {
  console.log("通知D");
});
pubsub.subscribe("上海航班", function () {
  console.log("通知E");
});

pubsub.publish("上海航班");
pubsub.publish("广州航班");
```

控制台输出

```
通知D
通知E
通知A
通知B
通知c
```

## store 的实现

有了上述的知识之后, 我们再来看下 redux 官方的一个例子

```js
import { createStore } from "redux";

function counter(state = 0, action) {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
}

let store = createStore(counter);

store.subscribe(() => console.log(store.getState()));

store.dispatch({ type: "INCREMENT" });
// 1
store.dispatch({ type: "INCREMENT" });
// 2
store.dispatch({ type: "DECREMENT" });
```

仔细看这里的 counter, 是不是和上面的 reducer 很相似, 第一个参数是一个当前值, 返回一个归约后的值,还有 subscribe 和 dispatch, 和上面依然异曲同工

redux 暴露了三个 api, getState, subscribe, dispatch, 我们根据 api 试着实现 redux

```js
const createStore = (reducer) => {
  let state;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  dispatch({});

  return { getState, dispatch, subscribe };
};
```

## reducer 的拆分

Reducer 函数负责生成 State。由于整个应用只有一个 State 对象，包含所有数据，对于大型应用来说，这个 State 必然十分庞大，导致 Reducer 函数也十分庞大

请看下面的例子(例子来自于[阮一峰老师](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html))

```js
const chatReducer = (state = defaultState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_CHAT:
      return Object.assign({}, state, {
        chatLog: state.chatLog.concat(payload),
      });
    case CHANGE_STATUS:
      return Object.assign({}, state, {
        statusMessage: payload,
      });
    case CHANGE_USERNAME:
      return Object.assign({}, state, {
        userName: payload,
      });
    default:
      return state;
  }
};
```

上面代码中，三种 Action 分别改变 State 的三个属性。

> ADD_CHAT：chatLog 属性
> CHANGE_STATUS：statusMessage 属性
> CHANGE_USERNAME：userName 属性

这三个属性之间没有联系，这提示我们可以把 Reducer 函数拆分。不同的函数负责处理不同属性，最终把它们合并成一个大的 Reducer 即可。

```js
const chatReducer = (state = defaultState, action = {}) => {
  return {
    chatLog: chatLog(state.chatLog, action),
    statusMessage: statusMessage(state.statusMessage, action),
    userName: userName(state.userName, action),
  };
};
```

Redux 提供了一个 combineReducers 方法，用于 Reducer 的拆分。你只要定义各个子 Reducer 函数，然后用这个方法，将它们合成一个大的 Reducer。

```js
const reducer = combineReducers({
  a: doSomethingWithA,
  b: processB,
  c: c,
});

// 等同于
function reducer(state = {}, action) {
  return {
    a: doSomethingWithA(state.a, action),
    b: processB(state.b, action),
    c: c(state.c, action),
  };
}
```

下面是 combineReducer 的简单实现。

```js
const combineReducers = (reducers) => {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  };
};
```

感谢阅读!
