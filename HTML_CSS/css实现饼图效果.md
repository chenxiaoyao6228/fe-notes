
## 前言

如何实现指定比例的饼图效果
![pie-chart-problem](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/2019-07-01-css-secrets-pie-chart/pie-chart-problem.png)

## css 实现

思路: 一个基本元素定义基本的圆形, 伪元素进行覆盖, 同时控制伪元素的旋转角度来显示饼图的比例

1. 定义基本的圆, 这里使用 border-radius: 50%来生成

```css
.pie {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: yellowgreen;
}
```

2. 使用径向渐变来生成被遮盖的颜色, 由于#655 的结束长度为 0, 因此渐变不会生效, 而是从前面 50%的地方开始,以#655 的颜色进行填充,经过这两步生成的是一个左半圆为黄绿色, 右半圆为棕色的圆形

```css
background-image: linear-gradient(to right, transparent 50%, #655 0);
```

![simple-pie-with-two-parts](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/2019-07-01-css-secrets-pie-chart/simple-pie-with-two-parts.png)

3. 使用另外一个元素进行覆盖右半部分, 也就是一个和左边颜色相同的左半圆, 这里要注意的点有几个,一是使用 border-radius 来实现半圆效果,具体可以参考[css 秘密花园:实现半椭圆效果](http://chenxiaoyao.cn/2019/06/14/css-secrets-flexible-ellipses/),二是使用 background:inherit 来减少代码重复

```css
.pie::before {
    content: '';
    display: block;
    margin-left: 50%;
    border-radius: 0 100% 100% 0 / 50%
    background-color: inheit;
}
```

4. 改变覆盖元素的旋转角度,则原图形右边的颜色就会显现出来

```css
.pie::before {
  transform-origin: 0 50%;
  transform: rotate(45deg);
}
```

![pie-rotate](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/2019-07-01-css-secrets-pie-chart/pie-rotate.png)
上面的实现方案其实是有问题的,那就是当旋转的角度超过 180 度的时候,遮盖的部分并没有按照我们预想的那样
![pie-245deg](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/2019-07-01-css-secrets-pie-chart/pie-245deg.png)
解决的思路是当角度大于 180 度的时候, 将覆盖元素的背景色变为右半圆的颜色, 并且选择角度减去 180 度,比如上面的 245deg,对应的代码是这样的

```css
.pie::before {
  background-color: #655;
  transform: rotate(45deg);
}
```

![pie-245deg-fix](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/2019-07-01-css-secrets-pie-chart/pie-245deg-fix.png)
现在离最后解决方案还有一步, 如何根据数据来改变饼图的角度,比如后台传回的比例是 30%, 这里我们遇到了一个问题: 伪元素并不属于 dom 的部分,因此我们无法选择和操控它,一种方式是使用两个标签

```css
<div class="pie" > <div class="pie-cover" > </div > </div > .pie {
  position: relative;
}
.pie-cover {
  position: absolute;
  width: 50%;
}
```

根据数据计算相应的角度

```js
var percentage = 0.65;
var pieCover = document.querySelector(".pie-cover");
if (percentage > 0.5) {
  percentage = percentage - 0.5;
  pieCover.style.backgroundColor = "#655";
}
pieCover.style.transform = "rotate(" + percentage * 360 + "deg)";
```

简单明了,但是多使用了一个标签,书中使用的是 animation 负值的形式,有更深的感悟再回来更

[完整 demo](https://codepen.io/Allen6228/pen/VJQJbK)
