---
title: "关于关于设备自适应需要知道知识(DPI,PPI,分辨率,屏幕尺寸)"
summary: "本文总结设备自适应相关的知识点"
date: "2023-05-01"
tags: ["css"]
draft: false
authors: ["default"]
---

## 前言

本文总结设备自适应相关的知识点.

## 设备像素(Device Pixel)

一个**设备像素点**是显示器(或者其他设备)上最小的物理显示单元。每个设备像素都可以通过一个红、绿、蓝三个子像素来显示颜色。

注意这是一个**相对单位**，不同的设备像素的大小是不一样的(与显示技术有关，不同的显示技术（例如 LCD、OLED、LED 等）)，比如在 mac 上，一个设备像素的大小是 0.0213cm，而在 iphone6 上，一个设备像素的大小是 0.0018cm。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/device-pixel.png)

## 屏幕分辨率

分辨率可分为两类：(屏幕)设备分辨率和图像分辨率。

**图像分辨率**：指的是图像的像素点个数，通常用水平像素数和垂直像素数来表示，比如一张 100x100px 的图片，它的图像分辨率就是 100x100px。

**屏幕(设备)分辨率**, 适用于电子屏幕,设备分辨率反映了硬件设备处理图像时的效果是否细腻，指的是宽度上和高度上最多能显示的物理像素点个数。

举个例子，iPhone6 的`750x1334px`的分辨率的屏幕，意思是 iphone6 的屏幕有 750 个设备像素点在水平方向上，有 1334 个设备像素点在垂直方向上。

通常说的 4K 显示屏指的是 4096x2160px 的分辨率的屏幕。

### 屏幕比例与屏幕分辨率

这里提一下**屏幕比例**，我们常说的 21:9, 16:9 可由分辨率来计算得出，计算方法是取最大公约数

```js
function gcd(x, y) {
  if (x % y == 0) return y;
  return gcd(y, x % y);
}
```

比如上面的 4K 屏 4096x2160px 的分辨率的屏幕的屏幕比例为 4096/2160 = 1.89629，取最大公约数得 21:9, 之所以不用 7:3 是为了不同屏幕进行比较的时候更加直观。

比如 21:9 的屏幕和 16:9 的屏幕进行比较，21:9 的屏幕更宽一些。

## 屏幕尺寸

屏幕尺寸是指屏幕的对角线长度，单位是英寸(inch)。比如 iphone6 的屏幕尺寸是 4.7 英寸，mac 13 寸的笔记本的屏幕尺寸是 13.3 英寸。

## 屏幕尺寸，分辨率，设备像素的关系

**相同分辨率下**: 较大的屏幕会将像素分布得更开，因此每个像素的实际尺寸会更大。相比之下，较小的屏幕会将像素分布得更紧密，每个像素的实际尺寸较小。

**相同的屏幕尺寸下**：较高分辨率的屏幕会在同样的物理尺寸上拥有更多的像素，从而导致每个像素点的实际尺寸变小。比如 4.7 英寸的 iPhone6 像素尺寸为 750x1334px，而 4.7 英寸的 HTC One 像素尺寸为 1080x1920px

因此我们可以理解为什么手机的分辨率很高，因为手机屏幕很小，所以需要更高的分辨率才能让图像显示得更清晰。

## PPI(Pixel Per Inch)

屏幕像素密度， **实际单位**， 即每英寸(**1 英寸=2.54 厘米**)聚集的像素点个数，这里的一英寸还是对角线长度

这里还需要提一下的是 **DPI（Dots Per Inch）**, 两者的概念是一样的，只是运用在不同的领域：

- DPI 通常用于打印机
- PPI 通常用于屏幕。

## 换算关系

分辨率、PPI（每英寸像素数）和屏幕尺寸之间可通过计算公式进行推算(ps: 就是简单的勾股定理而已):

1. 计算像素总数：
   像素总数 = 水平像素数 × 垂直像素数

1. 计算分辨率：
   分辨率 = 水平像素数 × 垂直像素数

1. 计算 PPI：
   PPI = √(水平像素数^2 + 垂直像素数^2) / 屏幕对角线尺寸

1. 计算屏幕尺寸：
   屏幕尺寸 = √(水平像素数^2 + 垂直像素数^2) / PPI

举几个实际的例子： 小米 12 的屏幕尺寸为 6.28 英寸，分辨率为 2400x1080px，那么它的 PPI 为 419。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/xiaomi-12-ppi.png)

## CSS 像素(逻辑像素)

CSS 像素是一个**相对单位**，它是一个抽象的单位，与设备无关，是为了让开发者在开发网页时更方便的使用单位而定义的。

## 设备像素比（Device Pixel Ratio，DPR）

设备像素比（Device Pixel Ratio，DPR）是指在网页开发中，设备物理像素与 CSS 像素之间的比例关系。

如 iPhone5 使用的是 Retina 视网膜屏幕，用 2x2 的 Device Pixel 代表 1x1 的 CSS Pixel，所以设备像素数为 640x1136px，而 CSS 逻辑像素数为 320x568px。

dpi 可通过`window.devicePixelRatio`获取.

### DPR 与页面缩放的关系

实际上，页面缩放并不会直接改变设备像素比 (DPR), 因为 DPR 通常是一个固定的设备属性，代表在特定设备上一个 CSS 像素需要由多少物理像素来呈现.

那为什么我们在页面缩放的时候可以看到`window.devicePixelRatio`的值发生变化呢？

比如在 DPR 为 2 的 mac 上将页面放大至 200%, 会发现 `window.devicePixelRatio` 值变成了 4。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/dpr-with-page-scale.png)

实际上， 当用户进行页面缩放时，浏览器可能会模拟更改了设备像素比（DPR）的效果。当用户放大页面时，浏览器会在一定程度上模拟更高的设备像素比，这样 CSS 像素就会被映射到更多的物理像素上，使得页面内容在视觉上变大。反之，当用户缩小页面时，浏览器会模拟较低的设备像素比，使得页面内容在视觉上变小。

这种模拟的效果让用户可以更改页面的显示大小，但实际上并没有改变设备的硬件属性。所以在页面缩放过程中，window.devicePixelRatio 的值会发生变化，但这不代表设备的实际像素比发生了改变，而只是浏览器为了实现缩放效果而做的模拟。

## 参考

- https://juejin.cn/post/6918323869824909319

> 本文首发于个人博客[前端开发笔记](https://github.com/chenxiaoyao6228/fe-notes)，由于笔者能力有限，文章难免有疏漏之处，欢迎指正
