---
permalink: 2023-05-01--canvas-performance
title: canvas 性能分析的手段
date: 2023-05-01
categories:
  - tech
tags:
  - canvas
---

## 前言

日常开发中，我们一般使用Performance面板与Memory面板来分析页面的性能问题，但是canvas消耗的主要是 GPU，因此我们还需要其他的辅助手段，这里主要介绍常用的几种性能检测手段

- JS 长任务检测: Chrome devtools中的Performance面板
- 帧率检测: Chrome devtools中的FPS Meter
- 内存消耗: Chrome performance monitor


## JS 长任务检测
打开chrome控制面板，选择Performance面板，点击左上角的`Record`按钮，然后在页面上进行操作，操作完成后，点击`Stop`按钮，即可看到页面的性能数据

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/chrome-performance-panel-2.png)

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/chrome-performance-panel.png)

必要的时候降低硬件并发数与 CPU, 以模拟一些低端机型的情况
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/chrome-performance-panel-3.png)

## 帧率检测

打开chrome开发者工具，mac上`shift+command+p`（windows是`shift+ctrl+p`)呼出面板，输入`fps`, 选择`Show FPS meter`，即可在页面上看到帧率

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-performance-fps.png)

帧率检测是通过`requestAnimationFrame`来实现的，通过`requestAnimationFrame`来获取每一帧的时间戳，然后计算出每一帧的时间间隔，从而计算出帧率


## 内存消耗

我们可以打开chrome performance monitor来查看内存消耗情况，打开方式同上，输入`performance monitor`，选择`Show Performance Monitor`，即可看到内存消耗情况

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/chrome-performance-monitor-3.png)

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/chrome-performance-monitor-2.png)


 
 
 > 本文首发于个人博客[前端开发笔记](https://github.com/chenxiaoyao6228/fe-notes)，由于笔者能力有限，文章难免有疏漏之处，欢迎指正