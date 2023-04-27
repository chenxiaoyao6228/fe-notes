---
date: 2023-03-23
permalink:  从零实现canvas画板
title: 从零实现canvas画板
categories: 
  - tech
tags:
  - canvas
---

## 目标

- 无框架，让没基础的同学都能看懂

## 大纲

- canvas基础 API
  - (宽高，DPI, context, canvas对象, 坐标)
- 使用canvas进行基础绘图
  - 基本原理：监听mousedown等事件，调用api进行绘制(线段，矩形)
  - dom逐帧渲染 vs canvas(手动调用draw vs requestAnimationFrame+loop)
  - canvas 对于我们来说是输出设备，一旦输出给它，信息就丢失而读不回来了 => 引出数据驱动
  - 静态描述：不能实现我们所看到的画笔移动的效果
  - 传统web开发HTML是声明式的, 但是canvas的 API 是命令式的
    - SVG是基于XML的，这意味着每个元素都在SVG DOM中可用, 可以为元素附加JavaScript事件处理程序。在SVG中，将每个绘制的形状记住为对象。如果更改了SVG对象的属性，则浏览器可以自动重新呈现形状。
    - canvas： 本身只是相当于一块画布，不具有绘图能力，必须通过脚本(通常是JavaScript)动态地绘制图形，脚本充当画笔的角色
  - 架构选择：MVC or 单向数据流
    - MVC: 浏览器有事件委托，在canvas实现绘图的时候也可以使用这个技巧(通过controller)
- 基类实现
  - 我们要绘制某个物体，那不就是在画布的某个位置（top、left值）根据某些属性（宽高大小等）画上某个物体（比如矩形、多边形、图片或者路径等等）吗，并且之后还可以对每个物体进行一些交互操作（主要就是平移+旋转+缩放）
  - Rect类以及Canvas主类的流程(render, renderAll)
- 控制器 && 拖拽
  - 包围盒 && hitTest(点在图形内部的判断，射线法等)
  - hover && click && 拖拽效果
- 框选 && 组合
  - 实现元素组合与拖拽
- 事件系统的实现
  - 
- 撤销重做
  - 正向重做，反向重做，数据快照，数据diff
- 橡皮擦功能
  - 四种实现方式
- canvas动画
  - 动画的原理
  - 实现rect.animate
- canvas性能优化
  - 双层画布，离屏canvas，减少指令等
- 互动白板
  - 本地持久化 && 网络协议制定