---
title: 二叉搜索树的Javascript实现
date: 2019-10-07T08:53:46.000Z
categories:
  - tech
tags:
  - leetcode
permalink: 2019-10-07-data-structure-binary-search-tree
---

代码如下:

```js
function Node(value) {
  this.value = value;
  this.left = null;
  this.right = null;
}
function BST() {
  this.root = null;
}

BST.prototype.insertRecursively = function (value) {
  if (!this.root) {
    this.root = new Node(value);
    return;
  }
  let parent = this.root;
  let dir;
  insertNode(this.root, value);
  function insertNode(node, value) {
    if (!node) {
      if (dir === "left") {
        parent.left = new Node(value);
      } else {
        parent.right = new Node(value);
      }
      return;
    }
    if (value < node.value) {
      parent = node;
      dir = "left";
      insertNode(node.left, value);
    } else {
      parent = node;
      dir = "right";
      insertNode(node.right, value);
    }
  }
};
BST.prototype.insert = function (value) {
  let node = new Node(value);
  if (!this.root) {
    this.root = node;
    return;
  }
  let current = this.root;
  let parent;
  // while loop begin with true creates a loop that will continuously run util a break condition
  while (true) {
    parent = current;
    if (value < current.value) {
      current = current.left;
      if (!current) {
        parent.left = node;
        break;
      }
    } else {
      current = current.right;
      if (!current) {
        parent.right = node;
        break;
      }
    }
  }
};

BST.prototype.inOrderTraverse = function (callback) {
  inOrder(this.root, callback);
  function inOrder(node, callback) {
    if (node) {
      inOrder(node.left, callback);
      callback(node.value);
      inOrder(node.right, callback);
    }
  }
};

BST.prototype.preOrderTraverse = function (callback) {
  preOrder(this.root, callback);
  function preOrder(node, callback) {
    if (node) {
      callback(node.value);
      preOrder(node.left, callback);
      preOrder(node.right, callback);
    }
  }
};
BST.prototype.postOrderTraverse = function (callback) {
  preOrder(this.root, callback);
  function preOrder(node, callback) {
    if (node) {
      preOrder(node.left, callback);
      preOrder(node.right, callback);
      callback(node.value);
    }
  }
};

BST.prototype.getMin = function () {
  let node = this.root;
  while (node.left) {
    node = node.left;
  }
  return node.value;
};
BST.prototype.getMinRecursively = function () {
  return getMin(this.root);
  function getMin(node) {
    if (!node.left) {
      return node.value;
    }
    return getMin(node.left); //递归函数的调用要有返回值,不然上一个调用函数无法调用
  }
};

BST.prototype.getMax = function () {
  let node = this.root;
  while (node.right) {
    node = node.right;
  }
  return node.value;
};
BST.prototype.getMaxRecursively = function () {
  return getMax(this.root);
  function getMax(node) {
    if (!node.right) {
      return node.value;
    }
    return getMax(node.right); //递归函数的调用要有返回值,不然上一个调用函数无法调用
  }
};
BST.prototype.find = function (value) {
  let node = this.root;
  while (node) {
    if (value < node.value) {
      node = node.left;
    } else if (value > node.value) {
      node = node.right;
    } else {
      return node;
    }
  }
  return -1;
};

// return node or -1
// 有两种baseCase
BST.prototype.findRecursively = function (value) {
  return findRecursively(this.root, value);
  function findRecursively(node, value) {
    if (value === node.value) return node;
    if (!node.left && !node.right) return -1;
    if (value < node.value) {
      return findRecursively(node.left, value);
    } else {
      return findRecursively(node.right, value);
    }
  }
};
```
