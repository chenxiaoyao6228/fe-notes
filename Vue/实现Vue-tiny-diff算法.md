---
permalink: 2020-01-31-vue-tiny-diff-algorithm
date: 2020-01-31
title: 实现Vue-tiny-dom-diff算法
categories:
  - tech
tags:
  - vue
---

## 前言

前面我们实现了基本的数据更新到视图渲染的逻辑,但是这种方式(innerHTML)是极其低效的, 因此,我们相应引入 dom 和 diff 算法, 数据到视图的过程变为:

state -> vdom -> dom

## vNode 层

所谓 vNode, 就是一个表示 dom 结构的轻量对象

```js
{
  tag, props, children;
}
```

为了方便创建, 引入创建一个创建节点的方法`h`

```js
export function h(tag, props, children) {
  return {
    tag,
    props,
    children,
  };
}
```

我们需要修改 render 函数, 让其返回一个创建好的 vNode(vTree)

```js
render(context) {
    return h(
      'div',
      {
        id: 'id-1',
        class: 'class-1'
      },
      [h('p', null, String(context.value)), h('p', null, String(context.value))]
    )
  },
```

接下来对返回的 vTree 挂载到真实的节点

```js
let subTree = rootComponent.render(context);
mountElement(subTree, rootContainer);
```

mountElement 的实现逻辑

1. 根据标签创建元素
2. 更新属性
3. 如果子节点为文本节点,直接创建, 若为数组,则递归创建

```js
export function mountComponent(vnode, container) {
  const { tag, props, children } = vnode;
  // tag
  let ele = document.createElement(tag);
  // props
  for (const key in props) {
    if (Object.hasOwnProperty.call(props, key)) {
      const value = props[key];
      ele.setAttribute(key, value);
    }
  }
  /* children
        1. string
        2. object
    */
  if (typeof children === "string") {
    const textNode = document.createTextNode(children);
    ele.appendChild(textNode);
  } else if (isArray(children)) {
    children.forEach((vnode) => {
      mountComponent(vnode, ele);
    });
  }
  container.appendChild(ele);
}

function isArray(ele) {
  return typeof ele.sort === "function";
}
```

## diff 算法

除了第一次挂载需要生成所有节点以外, 新的更新是在旧的基础上"缝缝补补", 这个差量更新的过程交给我们的 diff 算法

我们用一个变量`isMounted`来将挂载和更新两阶段分开

```js
export default function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      let context = rootComponent.setup();
      let isMounted = false;
      let oldSubTree;
      effectWatch(() => {
        if (!isMounted) {
          isMounted = true;
          let subTree = (oldSubTree = rootComponent.render(context));
          mountElement(subTree, rootContainer);
        } else {
          let newSubTree = rootComponent.render(context);
          diff(newSubTree, oldSubTree);
          oldSubTree = newSubTree;
        }
      });
    },
  };
}
```

接下来我们就可以处理`diff`的逻辑了, 需要分别对`tag`,`props`,`children`的变更做处理,

因为 diff 的郭恒要对真实的 dom 节点进行操作, 在 mounted 过程中将 dom 渲染完成后,我们需要将其挂载到对应的 vNode 上

```js
export function mountElement(vNode, container) {
  // ...
  let ele = (vNode.el = document.createElement(tag));
  // ...
}
```

3. tag 变化的处理 ,这里用到了原生的`replaceWith`操作方法

```js
if (newTree.tag !== oldTree.tag) {
  oldTree.el.replaceWith(document.createElement(newTree.tag));
}
```

2. props 节点的处理

```js
newTree.el = oldTree.el;
// props, 对比两个对象, 各自遍历一遍,找出各自不同的地方
let { props: newProps } = newTree;
let { props: oldProps } = oldTree;
if (newProps && oldProps) {
  Object.keys(newProps).forEach((key) => {
    // 同时存在,意味着需要更新节点
    let newVal = newProps[key];
    if (Object.hasOwnProperty.call(oldProps, key)) {
      let oldVal = oldProps[key];
      if (newVal !== oldVal) {
        newTree.el.setAttribute(key, newVal);
      }
    } else {
      // 旧的不存在, 创建
      newTree.el.setAttribute(key, newVal);
    }
  });
}
// 移除已不存在的旧节点
if (oldProps) {
  Object.keys(oldProps).forEach((key) => {
    if (!Object.hasOwnProperty.call(newProps, key)) {
      newTree.el.removeAttribute(key);
    }
  });
}
```

当然, 为了演示, 这里的处理过程比较简单,

3. children 的处理

chilren 的处理相对比较麻烦,为了简化, 目前根据 children 的类型区分

即: newChildren[string, array] \* oldChildren[array, string] = 4 种情况

前三种比较简单

```js
let { children: oldChildren } = oldTree;
let { children: newChildren } = newTree;
if (typeof newChildren === "string") {
  if (typeof oldChildren === "string") {
    if (newChildren !== oldChildren) {
      newTree.el.textContent = newChildren;
    }
  } else if (isArray(oldChildren)) {
    newTree.el.textContent = newChildren;
  }
} else if (isArray(newChildren)) {
  if (typeof oldChildren === "string") {
    newTree.el.textContent = ``;
    mountElement(newTree, newTree.el);
  } else if (Array.isArray(oldChildren)) {
    // ...
  }
}
```

下面分析两者都是数组的情况, 为了简化, **只对节点的长度作处理,不处理相同长度内的节点移位操作**

```js
// 暴力解法: 只对节点的长度作处理,不处理相同长度内的节点移位操作
const length = Math.min(newChildren.length, oldChildren.length);
// 更新相同长度的部分
for (var index = 0; index < length; index++) {
  let newTree = newChildren[index];
  let oldTree = oldChildren[index];
  diff(newTree, oldTree);
}
// 创建
if (newChildren.length > oldChildren.length) {
  for (let index = length; index < newChildren.length; index++) {
    const newVNode = newChildren[index];
    mountElement(newVNode, newTree.el);
  }
}
// 删除
if (oldChildren.length > newChildren.length) {
  for (let index = length; index < oldChildren.length; index++) {
    const vNode = oldChildren[index];
    vNode.el.remove(); // 节点移除自身
  }
}
```
