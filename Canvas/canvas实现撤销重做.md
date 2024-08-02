## 前言

本节探究如何实现画板撤销重做的功能

## 需求分析

撤销重做的基本流程如下：

1. 用户执行了操作之后有能力撤销操作
   ![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/redo-undo-process-1.png)
1. 在撤销操作之后，可再次恢复此操作
   ![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/redo-undo-process-2.png)
1. 在撤销的过程中发生的任何改动, 都会清空当前步骤之后的所有记录
   ![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/redo-undo-process-3.png)

## 撤销重做的几种实现方式

### 逆向指令撤销

定义一个存放反操作的数组,每次操作后将对应反操作的类型和数据保存到数组中（每个操作实现对应的反操作）。每次撤销时，根据数组执行反操作

### 正向指令撤销

定义一个用于存放操作的二维数组 actionList。每次操作开始，定义一个 action 数组存放本次操作，操作过程往数组里存放对应的方法(参数)，相当于“打点记录”，在 mouseup 时标记该次操作结束，把 action push 到 actionList 中。每次撤销时，首先将当前 model 重置为初始状态，再将数组中的 0 ～ N-2 个操作依次执行一次

### 数据快照式撤销

快照式实现的撤销与重做,在历史记录中保存的是应用数据的快照。在用户每一步操作之后,都对应用数据中需要保存的部分保存到历史记录里(使用深拷⻉,或者不可变数据)。在撤销或者重做时,直接取出相应的快照,恢复到应用中。按照这种思路,只要取出相应的数据快照,可以恢复到任意一次状态。

### 基于数据 diff 的撤销重做

## 双栈实现撤销重做

撤销重做的实现可依赖单栈和双栈，这里采用了双栈的实现，具体图解如下：

假设用户执行了三个操作，我们分别把页面状态 1, 页面状态 2, 页面状态 3 压入 normalStack 栈中，此时页面的数据结构如下：
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/redo-undo-two-stack-1.png)
紧接着，用户执行了两次撤销(undo)操作, 我们就依次把页面状态 3, 页面状态 2 从 normalStack 中弹出，压入 backStack 中，此时页面的数据结构如下：
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/redo-undo-two-stack-2.png)
接着用户执行了一次重做(redo)的操作,我们把对应的页面状态 2 从 backStack 中弹出，重新压入 normalStack，此时页面的数据结构如下：
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/redo-undo-two-stack-3.png)
此时，用户执行了一个新的状态操作，生成页面状态 4， 页面状态 3 就无法再通过撤销重做操作查看了，需要清空，此时页面的数据结构如下：
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/redo-undo-two-stack-4.png)

> 本文首发于个人博客[前端开发笔记](https://github.com/chenxiaoyao6228/fe-notes)，由于笔者能力有限，文章难免有疏漏之处，欢迎指正
