## 前言

学习本文将学习如何使用 css 实现椭圆效果

## 圆

如果需求来了, 需要实现一个半径为 50px 的圆(如圆形头像效果),你可能会不假思索写出下列的代码

```css
div {
  width: 100px;
  height: 100px;
  background: gold;
  border-radius: 50px;
}
```

那么, border-radius: 50px 究竟是怎么构建出来的呢?

```css
div {
  width: 100px;
  height: 100px;
  background: gold;
  border: red 1px solid;
  border-radius: 50px;
}
```

实际上, border-radius 分别是四个属性的缩写,**按照顺时针分别为**border-top-left-radius, border-top-right-radius,border-bottom-right-radius, border-bottom-left-radius,因此上面的代码等价于

```css
border-radius: 50px 50px 50px 50px;
```

实际上 border-radius 接受不同的水平和垂直半径,使用斜线（/）来分隔, /前面是水平半径， /后面是垂直半径，由于上述实现的是圆, 因此在大多数情况下我们省略了/, 完整的写法应该是这样的

```css
border-radius: 50px 50px 50px 50px / 50px 50px 50px 50px;
```

也就是说，**上述 border-radius 的构建方式是在正方形的内部作一个半径为 50 的圆，套在正方形内部，再把多余的边角去掉**
我们可以把四个垂直半径改一下

```css
border-radius: 50px 50px 50px 50px / 30px 30px 30px 30px;
```

![long-short-radius](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/2019-6-15-css-secrets-flexible-ellipse/long-short-radius.png)

相当于使用一个椭圆对原图像进行了修饰， 如果原矩形长宽大一点的话会是这样

![long-short-ellipse](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/2019-6-15-css-secrets-flexible-ellipse/long-short-ellipse.png)

## 实现椭圆

通过上面的知识我们可以猜想，如果我们需要实现椭圆的效果,就要在水平半径和垂直半径上做手脚, 也就是说**椭圆的长半径和短半径分别是原矩形长和宽的一半**，用代码表示就是

```css
.ellipse {
  width: 300px;
  height: 200px;
  background: gold;
  border-radius: 150px / 100px;
}
```

完整写法是

```css
border-radius: 150px 150px 150px 150px / 100px 100px 100px 100px;
```

## border-radius 的百分比值

border-radius 实际上接受百分比值, **其值分别根据水平和垂直半径进行计算**, 上面的例子可以写为

```css
border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
```

可简写为

```css
border-radius: 50%;
```

## 四分之一椭圆

还是先从四分之一圆开始,

```css
width: 300px;
height: 300px;
background: gold;
border-radius: 300px 0 0 0;
```

![quarter-circle](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/2019-6-15-css-secrets-flexible-ellipse/quarter-circle.png)
稍微变化一下就可以实现其他三个角的四分之一圆，这里就不演示了， 回到我们的四分之一椭圆,如法炮制即可

```css
.quarter-ellipse {
  width: 300px;
  height: 200px;
  background: gold;
  border-radius: 100% 0 0 0;
}
```

![quarter-ellipse](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/2019-6-15-css-secrets-flexible-ellipse/quarter-ellipse.png)

## 半椭圆

实现半椭圆大同小异， 只是将某个半径分成了两份而已，如实现左椭圆效果，则包含左上角和坐下角两部分，对应的垂直半径就不能是 100%了，而是 50%

```css
.half-ellipse-left {
  border-radius: 100% 0 0 100% / 50%;
}
.half-ellipse-up {
  border-radius: 50% / 100% 100% 0 0;
}
.half-ellipse-right {
  border-radius: 0 100% 100% 0 / 50%;
}
.half-ellipse-down {
  border-radius: 50% / 0 0 100% 100%;
}
```

对应的效果请看 [demo](https://codepen.io/Allen6228/pen/KjVPQP/)

## 参考

- [秋月何时了，CSS3 border-radius 知多少？](https://www.zhangxinxu.com/wordpress/2015/11/css3-border-radius-tips/)
