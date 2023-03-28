---
title: css中的径向渐变
date: 2019-06-07
categories:
  - tech
tags:
  - css
permalink: 2019-06-07-css-radius-gradients
---

## 语法

对于径向渐变而言,无非是三要素: **圆心, 半径, 起始颜色值**

```css
radial-gradient(
 [ [ <shape> ‖ <size> ] [ at <position>]? , | at <position>, ]?
 [ <color-stop> [, <color-hint>]? ] [, <color-stop> ]+
)
```

简单解释

- 第一个参数有三种情况: 一是不设置,二是设置中心点的位置,三是设置渐变的形状或者半径的长度,并且可选择设置圆心的位置,其中形状可以是 circle 圆形,也可以是 ellipse 椭圆,长度的单位可以是百分比或者普通长度单位, **默认的背景的中心点是圆心,默认形状是椭圆**
- 第二个之后的参数为颜色中间点,至少有两个,分别为起点和终点.可带颜色提示

最简单的演示

```css
.radial {
  background-image: radial-gradient(purple, gold);
}
```

## 渐变射线(gradient ray)

和线性渐变一样, 径向渐变是通过一条渐变射线来确定每个点的颜色,再以该点距离圆形的半径作圆, 形成渐变图形.如果是椭圆,则以长轴为默认半径

## 形状和半径大小

渐变的形状有三种指定的方式,

### 显示指定

可以通过 circle 和 ellipse 参数来决定

### 隐式指定

根据半径的大小, 如**50px 100px**表示的就是**长轴为 100px,短轴为 50px**的椭圆

```css
radial-gradient(50px, purple, gold)
radial-gradient(50px 100px, purple, gold)
```

注意:

- 对于椭圆来说,可以使用百分比,轴的长度可以是使用百分比,其值分别取决于背景的长(x 轴)和宽(y 轴), 但是对于圆无法使用,因为无法确定百分比值是根据背景的长度还是宽度来确定.

```css
radial-gradient(50% 25%, purple, gold)
```

- 椭圆可以百分比值和长度值混用

```css
radial-gradient(50% 10px, purple, gold)
```

**注: 设定半径之后, 如果值比较小, 则终点之后的颜色由终点颜色一直平铺**

```css
width: 200px;
height: 200px;
background: radial-gradient(50px circle at center, purple, green, gold 80px);
```

### 关键字指定

- closest-side: 渐变的边缘形状与容器距离渐变中心点最近的一边相切（圆形）或者至少与距离渐变中心点最近的垂直和水平边相切（椭圆）
- farthest-side: 与 closest-side 相反，边缘形状与容器距离渐变中心点最远的一边相切（或最远的垂直和水平边）
- closest-corner: 渐变的边缘形状与容器距离渐变中心点最近的一个角相交
- farthest-corner(默认): 渐变的边缘形状与容器距离渐变中心点最远的一个角相交
  ![The effects of radial gradient sizing keywords](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/2019-06-07-radial-gradient/The%20effects%20of%20radial%20gradient%20sizing%20keywords.png)
  你可能注意到, 关键字默认以背景的大小为半径,因此不能够再指定半径值, 而且关键字改变了圆心的位置, 这也是我们接下来要讨论的问题

## 圆心位置

```css
radial-gradient(at bottom left, purple, gold);
radial-gradient(at center right, purple, gold);
radial-gradient(at 30px 30px, purple, gold);
radial-gradient(at 25% 66%, purple, gold);
radial-gradient(at 30px 66%, purple, gold);
```

![Changing the center position of explicitly sized radial gradients](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/2019-06-07-radial-gradient/Changing%20the%20center%20position%20of%20radial%20gradients.png)

```css
radial-gradient(30px at bottom left, purple, gold);
radial-gradient(30px 15px at center right, purple, gold);
radial-gradient(50% 15% at 30px 30px, purple, gold);
radial-gradient(farthest-side at 25% 66%, purple, gold);
radial-gradient(farthest-corner at 30px 66%, purple, gold);
```

![Changing the center position of explicitly sized radial gradients](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/2019-06-07-radial-gradient/Changing%20the%20center%20position%20of%20explicitly%20sized%20radial%20gradients.png)

## 径向渐变实现日出效果

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="css,result" data-user="okra" data-slug-hash="nlsJL" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS Sunset Sunrise">
  <span>See the Pen <a href="https://codepen.io/okra/pen/nlsJL"></a></span></p><br />

## 参考

- [css definite guide 4th edition](https://www.amazon.com/CSS-Definitive-Guide-Visual-Presentation/dp/1449393195)
- [radial-gradient-recipes](https://css-tricks.com/radial-gradient-recipes)
