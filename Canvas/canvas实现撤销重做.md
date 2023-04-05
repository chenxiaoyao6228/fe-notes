---
date: 2023-03-28
permalink:  implement-redo-and-undo-in-canvas-drawing-app
title: canvas实现撤销重做
categories: 
  - tech
tags:
  - canvas
---

## 前言

画板批注需要实现撤销重做的功能

## 需求分析

撤销重做的基本流程如下：
1. 用户执行了操作之后有能力撤销操作
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/redo-undo-process-1.png)
1. 在撤销操作之后，可再次恢复此操作
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/redo-undo-process-2.png)
1. 在撤销的过程中发生的任何改动, 都会清空当前步骤之后的所有记录
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/redo-undo-process-3.png)

除此之外，实现的时候还应该考虑下列因素：

- 兼容性：目前只有笔记和橡皮擦，后续可能会有emoji，图形移动等，需要很好兼容新增指令
- 性能：使用撤销重做栈，用户操作记录过多的情况下会不会有性能问题？
- 解耦性： 如果批量操作，该方案是否可以满足
- 是否需要支持数据的持久化
- 页面滚动/缩放，橡皮擦？
  ....

## 双栈实现撤销重做

撤销重做的实现可依赖单栈和双栈，这里采用了双栈的实现，具体图解如下：

假设用户执行了三个操作，我们分别把页面状态1, 页面状态2, 页面状态3压入normalStack栈中，此时页面的数据结构如下：
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/redo-undo-two-stack-1.png)
紧接着，用户执行了两次撤销(undo)操作, 我们就依次把页面状态3, 页面状态2从normalStack中弹出，压入backStack中，此时页面的数据结构如下：
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/redo-undo-two-stack-2.png)
接着用户执行了一次重做(redo)的操作,我们把对应的页面状态2从backStack中弹出，重新压入normalStack，此时页面的数据结构如下：
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/redo-undo-two-stack-3.png)
此时，用户执行了一个新的状态操作，生成页面状态 4， 页面状态 3 就无法再通过撤销重做操作查看了，需要清空，此时页面的数据结构如下：
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/redo-undo-two-stack-4.png)


## 撤销重做的几种实现方式

常见的撤销重做的方式包括： 命令式，数据快照式，基于数据快照的diff