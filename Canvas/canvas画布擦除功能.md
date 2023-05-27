---
date: 2023-03-23
permalink: 2023-03-23-canvas画布擦除功能
title: canvas画布擦除功能
categories:
  - tech
tags:
  - canvas
---

## Canvas内容擦除


## 基于全局位图实现擦除

### 重置宽高

由于 canvas 每当高度或宽度被重设时，画布内容就会被清空

```js
const canvas = document.getElementById("drawing");
canvas.width = canvas.width;
```

### clearRect

clearRect会把指定范围所有像素变成透明，并擦除之前绘制的所有内容。

```js
ctx.beginPath();
ctx.fillStyle = "#ff6";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.clearRect(10, 10, 120, 100);

```
效果参考 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect)

### globalCompositeOperation

该属性设置在绘制新形状时应用合成操作的类型


### clipPath

## 基于文档模型实现擦除

以上都是基于全局位图的擦除方案，在大多数情况下，我们的方案都会是基于文档模型开发的，因此上述的Canvas原生 API 实现擦除的功能不能直接被使用。

### 图形覆盖擦除

橡皮擦作为独立的shape进行绘制，当前画布一样的背景色填充覆盖

效果：
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-eraser-1.png)


优点：

- 实现简单, 支持任意shape

缺点：

- 背景如果不是纯色的情况下不好处理
- 不支持图形移动等场景


### 复合图形擦除

针对图形覆盖擦除的改进方案，橡皮笔记作为单独的数据储存在其他shape中

优点： 
- 在图形覆盖的基础上，支持拖拽移动

缺点： 
- 需要在shape中存储单独的橡皮擦数据，实现相比图形覆盖擦除会复杂一些

案例： [FabricJS](http://fabricjs.com/erasing)

### 笔迹标记擦除

计算橡皮擦笔迹与shape的点交集，若存在相交的部分，则进行删除

优点：
- 支持任意图形，不会造成shape model的碎片化，面对需要多端同步场景也比较容易实现。可能需要考虑用户删除过程中的取消行为，如 ESC 取消

缺点：
- 不允许用户自定义局部擦除

案例： [excalidraw](https://excalidraw.com/)

### 图形切割擦除

在用户绘制橡皮擦笔迹的时候，计算橡皮擦笔迹与其他shape的相交情况，将单个图形切割成多个图形。

优点： 
- 切割后的图形可单独进行选旋转移动缩放等操作
缺点： 
- 仅对简单的图形(如自由画笔)有效, 一些复杂的图形对应的model不容易分割

如果项目仅包含画笔的功能，可以尝试该方案。 

而部分支持复杂shape的应用可能使用该方案作为书写笔的擦除方案，而其他复杂的图形不支持橡皮擦擦除