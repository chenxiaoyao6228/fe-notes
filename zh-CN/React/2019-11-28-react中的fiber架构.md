---
title: React中的fiber架构
date: 2019-11-28T02:23:22.000Z
categories:
  - tech
tags:
  - react
permalink: 2019-11-28-react-fiber
---

## 一.前言

React 作为目前前端三大主流框架之一, 与 Angular,Vue,Backbone 为代表的**依赖收集+双向绑定**框架相比, 开创性地提出了许多新理念, 如单向数据流,vdom, fiber 等, 使得大量的 React 爱好者对其进行深入研究, 加上 Facebook 的 LICENCE 事件, 大量的 React-like 轮子层出不穷,同时,React 在面试中也成为高频考点.

看完这篇文章, 你大概能回答下列问题:

- dom 与 react 16 之前基于 vdom 比对的 diff 算法的问题
- React 16 之后的 fiber 架构
- React setState 为什么是异步的
- React hooks 的基本原理,为什么不能写在条件语句中

学习的过程是从浅到深的过程, 了解下列前置知识有利于你更好地理解本文的内容

- 熟悉 react 主要 api
- 对浏览器 JS 的解释执行,DOM 等概念有所了解
- 理解基本数据结构和算法, 如递归,树和链表的基本使用

## 二. 旧的 Diff 算法

React 16 之前的 diff 算法是基于 vdom 的比对的, 而要了解 vdom, 就得从 dom 开始

### 浏览器的解析与 DOM 树的建立

浏览器在接收到服务端返回的数据后,会进行以下的步骤

1. 渲染进程将 HTML 内容转换为能够读懂的 DOM 树结构。
2. 渲染引擎将 CSS 样式表转化为浏览器可以理解的 styleSheets,计算出 DOM 节点的样式。
3. 创建布局树,并计算元素的布局信息。
4. 对布局树进行分层,并生成分层树。
5. 为每个图层生成绘制列表,并将其提交到合成线程。
6. 合成线程将图层分成图块,并在光栅化线程池中将图块转换成位图。
7. 合成线程发送绘制图块命令 DrawQuad 给浏览器进程。
8. 浏览器进程根据 DrawQuad 消息生成⻚面,并显示到显示器上

### DOM 为什么那么重

如果你尝试着打印一个 DOM 对象的所有属性的话, 你会发现还挺多的.....
![2019-11-28-05-41-33](http://blog.chenxiaoyao.cn/image/2019/10/2019-11-28-05-41-33.png)
事实上, Javascript 中对象也是有区分的

- 最轻量: Object.create(null)
- 轻量: 一般的访问对象, {}, VDOM
- 重量, 如带 getter/setter 的 Vue 的 vm 对象
- 超重量: DOM 对象

### 基于 DOM 树的对比

diff 背后的基本知识

- 树的 BFS(广度优先遍历)/DFS(深度优先遍历)，需要 O(N)的时空复杂度
- 传统 diff 算法通过循环递归对节点进行依次对比效率低下，算法复杂度达到 O(N^3)

React、Vue 则是放弃了完全及最小，实现从 O(N^3) => O(N)

主要有两种比对形式

1. 新的 vdom 和旧的 vdom 的对比
2. 新的 vdom 和 dom 树直接对比

但是无论是哪种比对, 都是通过递归调用，通过 dom 树级关系构成的栈递归。当动画过多, 或者出现大规模组件更新的时候就会出现卡顿的情况

![stack](http://s3.mogucdn.com/mlcdn/c45406/190406_5gkdlca7k824he218jca83109fb39_550x280.gif)
![fiber](http://s3.mogucdn.com/mlcdn/c45406/190406_379jij3e66jkag26b94860hbe9d3l_550x280.gif)

## 三.fiber 架构

针对旧的 diff 算法存在的问题, React 团队在 React16 这个大版本中重写了核心代码, 引入了 fiber 架构.其背后依据的点有两个：

- `Fiber`结构
- `window.requestIdleCallBack(callback)`

好处：

- 可拆分，可中断任务
- 可重用各分阶段任务，且可以设置优先级
- 可以在父子组件任务间前进后退切换任务
- render 方法可以返回多元素（即可以返回数组）
- 支持异常边界处理异常

### Fiber

fiber 对象可以说是 vdom 的升级版，一个最简单的 fiber 对象是这样的

```js
let fiber = {
  return: '上一级节点',(之前称为parent)
  child: '第一个子节点',
  sibling:, '兄弟节点'，
  dom: 'fiber对应的真实节点'
}
```

假设我们有这样的 DOM 结构

```html
<ul>
  <button></button>
  <li></li>
  <li></li>
  <li></li>
</ul>
```

对应的 fiber 结构是这样的
![2019-11-28-02-12-58](http://blog.chenxiaoyao.cn/image/2019/10/2019-11-28-02-12-58.png)

与之前的 VDOM 结构的区别在于： **树状的结构被拉成线性的链表结构了**，遍历 diff 的时候是

> HostRoot -> ul -> button -> li -> li -> li -> ul -> HostRoot

这也就意味着, 我们可以用一个`全局的NexTUnitOfWork`指针在标记目前正在处理的节点， 即使发生了中断，我们再次回来的时候还能够根据`nextUnitOfWork`精确地找到之前处理的节点, 直到最后一个节点被处理完

### requestIdleCallBack(callback)

现在我们已经有 fiber 结构和标记当前下一个需要被处理节点的`nextUnitOfWork`变量了，下一步我们需要的一个函数,能够

> 1.在特定的时间处理我们的`nextUnitOfWork`节点
>
> 2. 将`nextUnitOfWork`指针向前移动到下一个节点

这就是接下来要提到的`window.requestIdleCallback`函数, 简单来说，浏览器会在**空闲的时刻**调用传入的 callback 进行执行

实际上，对于不支持此 Api 的浏览器, 可以基于 setTimeOut 实现简单的兼容处理

```js
window.requestIdleCallback =
  window.requestIdleCallback ||
  function (handler) {
    let startTime = Date.now();

    return setTimeout(function () {
      handler({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50.0 - (Date.now() - startTime));
        },
      });
    }, 1);
  };
```

OK，现在你脑海里大概能够形成这样的一个**指针不断移动处理节点**的画面了

### react fiber 架构的工作流程

我们知道， react 中视图更新有三种方式：

- render， 初次渲染
- setState， 视图更新的主要方式
- forceUpdate， 钩子函数

同时,react 将 diff 阶段分为两个阶段

- 调和（reconcile）阶段， 主要是收集 dom 节点的变更， 在对应的 fiber 上打 tag, 如增(PLACEMENT),删(DELETION),改(UPDATE)， 此阶段**可以中断**
- commit 阶段，调用原生的 api 对收集到的变化进行 dom 的真实修改，**为保证 UI 变化的连续性，理论上不可中断，中断之后又得从第一个节点开始**

更新的过程涉及到下面几个全局变量与函数

1. 变量

```js
//  需要处理的下一个fiber对象, 浏览器空闲的时候会处理
//  performUnitOfWork之后移动到下一个节点
//  在setState之后被重置为wipRoot
let nextUnitOfWork = null;
let wipRoot = null; // workInProgress树, #root对应的节点
let currentRoot = null; // 只有在commit阶段才被赋值
let deletions = null; // 收集被删除的对象
```

2. 函数

- requestIdleCallback(workLoop)
- workLoop
- performUnitOfWork: 收集节点的变更情况
- commitRoot 和 commitWork： 调用原生的 DOM api 将变更打补丁到真实的 DOM 树

下面我们一起来看看这几个函数

#### workLoop

我们的页面引入的 bundle.js 之后会执行下面这个方法，开始启动我们的`无限轮询`的阶段

```js
// 将workLoop添加到requestIdleCallBack
requestIdleCallback(workLoop);
```

workLoop 内部在执行完之后，又递归地调用了 requestIdleCallback 进行, 总之， workLoop 是一直在执行的。

```js
// 工作循环, 使得更新的处理能够中断
// 只要浏览器有空闲时间, 就会回来处理下一个fiber
function workLoop(deadline) {
  let shouldYield = false;
  // 收集节点的变更情况的阶段
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1; // 浏览器返回的deadline对象
  }

  //收集完成， 进入commit阶段
  if (!nextUnitOfWork && wipRoot) {
    commitRoot(wipRoot.child);
  }
  requestIdleCallback(workLoop);
}
```

而节点的处理则是`nextUnitOfWork`不为 null 的情况，而我们的 render 函数或者 setState 做的事， 只需要把`nextUnitOfWork`设置为最顶层的节点就 OK 了

```js
export function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    // 关键点: 更新操作是通过与alternate对象的比对来完成的
    // currentRoot只有在effect收集结束, 进行commit阶段才会被赋值
    // reconciliation的两个阶段: effect(节点变更收集), commit(将effect更新到dom)
    // effect收集阶段利用requestIdleCallback, 可以中断
    // 每次commit阶段都会从fiberRoot节点开始, 不能中断, 中断之后需要从头开始
    alternate: currentRoot, // alternate指向旧的workInProgress树, 用于意外中断之后恢复
  };
  nextUnitOfWork = wipRoot;
}
const setState = (action) => {
  // 省略代码若干
  nextUnitOfWork = wipRoot; // 从root节点开始更新
};
```

**reconcile 阶段**
下面来看看 workLoop 里面收集阶段的 performUnitOfWork 方法，该方法有两个作用

- 处理当前节点
- 返回下一个需要处理的节点，有子节点则返回子节点， 没有子节点则横向找 sibling 兄弟节点，如果也没有就向上返回，最终返回到 root 节点， 收集阶段完成

```js
// 从<App />节点开始
function performUnitOfWork(fiber) {
  // 1. 处理当前节点
  const isFunctionalComponent = fiber.type instanceof Function;
  // TODO class component支持
  if (isFunctionalComponent) {
    updateFunctionalComponent(fiber);
  } else {
    updateHostComponent(fiber); // 更新浏览器宿主,浏览器环境也就是原生dom
  }
  // 2. 返回下一个要处理的fiber对象
  // 如果有子元素, 返回第一个子元素
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    //  无则检查sibling
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    // sibling也没有就返回parent, 寻找parent.sibling
    nextFiber = nextFiber.parent;
  }
}
```

对应的 updateHostComponent 和 updateFunctionalComponent 方法

```js
// 处理当前fiber, 对dom节点进行增, 删, 改
// 并返回下一个需要处理的fiber对象
function updateHostComponent(fiber) {
  // 初次渲染, dom节点还没有生成,根据fiber逐步生成dom树
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  // 遍历children, 为创建新的fiber对象, 建立fiberTree
  const elements = fiber.props.children;
  // 遍历children, 1.建立sibling关系, 2.打tag
  reconcileChildren(fiber, elements);
}
// 函数式组件的更新
function updateFunctionalComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = []; // 搜集该组件的变化,允许多次setState
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}
```

reconcileChildren 方法

```js
// 从dom树建立sibling关系只能通过parent.children的遍历来建立
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  //存在则返回oldFiber的child, 也就是<App />对应的fiber
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  // 建立一个空的链表的节点,第一个child是它的next节点, 通过不断移动, 建立完整的链条
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;
    const sameType = oldFiber && element && element.type == oldFiber.type;

    // 更新节点
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }

    // 新增节点
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }

    // 删除节点
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber; // 保存第一个child的索引
    } else {
      // 除了第一个子元素外, 其他的子元素通过sibling链接到整体中
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}
```

**commit（阶段）**
收集完成之后，要根据 tag 来将变更更新到 dom 上面

commitRoot 方法: 这里需要注意的是`currentRoot = wipRoot`的赋值, 回去翻翻`render`函数会发现, wipRoot 这个 fiber 根节点有一个`alternate`属性,**这是因为第一次渲染的时候还没有完整的 fiber Tree(也称为 workInProgress Tree),为了下次进行 diff 的时候进行对比,需要保留老的 workInProgress Tree** 一开始 currentRoot 也是一个空指针, 直到我们所有的 commit 都更新完成之后, 才会被赋值, 本次更新的 workInProgress Tree 在下次更新的时候就成了老树.

```js
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child); // 从<App />节点开始更新
  currentRoot = wipRoot;
  wipRoot = null;
}
```

```js
// 通过递归的方式遍历整棵树
function commitDeletion(domParent, fiber) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(domParent, fiber.child);
  }
}
```

通过 commitWork(fiber),commitWork(fiber.firstChild),commitWork(fiber.sibling)三个方法的调用完成 fiber 树的遍历

```js
function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  let domParentFiber = fiber.parent;
  // 函数组件没有dom, 需要不断向上查找找到有dom的父节点
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(domParent, fiber);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate, fiber.props);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
```

### setState 与 Hooks

正是 fiber 的存在使得 Hook 的实现成为可能, hooks 只是一个保存更新情况的队列而已

- alternate(旧的 workInProgress 树)上保存了所有的 hook, 根据索引来排, **这也就是 hooks 为什么不能在条件语句中使用的原因,只要某个条件语句变为 true 或者 false 导致跳过了,后面的更新就全乱套了**
- **setState 并没有立即更新,而是将变化 push 到了 hook 队列里面**, 同时 setState 修改 nextUnitOfWork,触发更新, 进入收集->commit 阶段,

```js
let wipFiber = null;
let hookIndex = null;

// 每次使用useState, 索引递增,在hook队列中添加一个新的变化
export function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  // 每个hooks对象都有一个queue, 保存多次setState,最后一次性update
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  const setState = (action) => {
    hook.queue.push(action); // 没有立即更新
    wipRoot = {
      // 重置根节点,建立新的workInProgress树
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };

    nextUnitOfWork = wipRoot; // 从root节点开始更新
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}
```

```js
function updateFunctionalComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = []; // 搜集该组件的变化,允许多次setState
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}
```

## 四.参考资料

[Background_Tasks_API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API#Example)

[using-requestidlecallback](https://developers.google.com/web/updates/2015/08/using-requestidlecallback)

[didact](https://github.com/pomber/didact)

[Virtual DOM 背后的秘密（Diff 篇）](https://zhuanlan.zhihu.com/p/36500459)

[A Cartoon Intro to Fiber - React Conf 2017](https://www.youtube.com/watch?v=ZCuYPiUIONs)
