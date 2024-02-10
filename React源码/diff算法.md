## 前言

本节总结 VDOM diff 算法的实现。

## 什么是 diff 算法

diff 算法不是 VDOM 的专利，比如 linux 中就有 diff 命令, 对两个文件进行 diff 处理

```bash
diff a.txt b.txt
```

Git 工具也提供了类似的 diff 功能，用于比较代码文件在不同版本之间的差异。

```bash
git diff <commit or branch> <commit or branch> -- <file>
```

例如，要比较当前分支与另一个分支之间的差异

```bash
git diff mybranch master -- myfile.txt
```

## VDOM diff 算法

VDOM diff 的基本思想是在更新用户界面时，先生成新的虚拟 DOM 树，然后将新旧两棵树进行比较，找出它们之间的差异。这些差异通常被称为变更集（或补丁），它们描述了需要对实际 DOM 进行的修改操作。然后，VDOM diff 算法会根据这些差异来最小化对实际 DOM 的操作，从而提高性能。

VDOM diff 算法不是某个单一的算法，而是一系列算法的集合, 有些作为单独的包， 有些则整合在对应的框架中

- snabbdom.js
- React.js
- Inferno.js

需要提前的是，写一个完整的 dom diff 库需要耗费很大的精力，考虑很多的边界场景，比如《Vue.js 设计与实现》中就整整用了三章来介绍 diff 算法

## 实现简单的 diff 算法

下面我们来实现一个比较简单的 diff 算法，步骤如下：

- 利用 JavaScript 创建 DOM 树
- 树的 diff，同层对比，输出 patchs(listDiff / diffChildren / diffProps)
  - 没有新的节点，返回
  - 新的节点 tagName 与 key 不变，对比 props，继续递归遍历子树
    - 对比属性（对比新旧属性列表）
    - 都存在的是否有变化
    - 是否出现旧列表中没有的新属性
  - tagName 和 key 值变化了，则直接替换成新节点
- 渲染差异
  - 遍历 patchs，把需要更改的节点取出来
  - 局部更新 DOM

```js
function diff(oldTree, newTree) {
  const patchs = {}; // 差异收集
  dfs(oldTree, newTree, 0, patchs);
  return patchs;
}

function dfs(oldNode, newNode, index, patchs) {
  let curPatchs = [];
  if (newNode) {
    // 当新旧节点的 tagName 和 key 完全一致时
    if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
      // 继续对比属性差异
      const props = diffProps(oldNode.props, newNode.props);
      curPatchs.push({ type: "changeProps", props });

      // 递归进入下一层级比较
      diffChildren(oldNode.children, newNode.children, index, patchs);
    } else {
      curPatchs.push({ type: "replaceNode", node: newNode });
    }
  }

  // 构建出整个差异树
  if (curPatchs.length) {
    if (patchs[index]) {
      patchs[index] = patchs[index].concat(curPatchs);
    } else {
      patchs[index] = curPatchs;
    }
  }
}

// 属性对比实现
function diffProps(oldProps, newProps) {
  const propsPatchs = [];
  // 遍历新旧属性列表
  // 查找删除项
  // 查找修改项
  // 查找新增项
  for (const key in oldProps) {
    if (!newProps.hasOwnProperty(key))
      propsPatchs.push({ type: "remove", prop: oldProps[key] });
    // 移除
    else if (oldProps[key] !== newProps[key])
      propsPatchs.push({
        type: "change",
        prop: oldProps[key],
        value: newProps[k],
      }); // 修改
  }

  for (const key in newProps) {
    if (!oldProps.hasOwnProperty(key))
      propsPatchs.push({ type: "add", prop: newProps[key] }); // 新增
  }
  return propsPatchs;
}

// 对比子级差异
function diffChildren(oldChild, newChild, index, patchs) {
  // 标记子级的删除/新增/移动
  let { change, list } = diffList(oldChild, newChild, index, patchs);
  if (change.length) {
    if (patchs[index]) patchs[index] = patchs[index].concat(change);
    else patchs[index] = change;
  }

  // 根据 key 获取原本匹配的节点，进一步递归从头开始对比
  oldChild.map((item, i) => {
    let keyIndex = list.indexOf(item.key);
    if (keyIndex) {
      let node = newChild[keyIndex];
      // 进一步递归对比
      dfs(item, node, index, patchs);
    }
  });
}

// 对比列表，主要也是根据 key 值查找匹配项
// 对比出新旧列表的新增/删除/移动
function diffList(oldList, newList, index, patchs) {
  let change = [];
  let list = [];
  const newKeys = newList.map((item) => item.key);
  oldList.forEach((item) => {
    if (newKeys.includes(item.key)) list.push(item.key);
    else list.push(null);
  });

  // 标记删除
  for (let i = list.length - 1; i >= 0; i--) {
    if (!list[i]) {
      list.splice(i, 1);
      change.push({ type: "remove", index: i });
    }
  }

  // 标记新增和移动
  newList.forEach((item, i) => {
    const { key } = item;
    const index = list.indexOf(key);
    if (index === -1 || key === null) {
      // 新增
      change.push({ type: "add", node: item, index: i });
      list.splice(i, 0, key);
    } else if (index !== i) {
      // 移动
      change.push({ type: "move", form: index, to: i });
      move(list, index, i);
    }
  });

  return { change, list };
}
```

## React diff 算法的优势

## 参考

- [snabbdom](https://github.com/snabbdom/snabbdom)
