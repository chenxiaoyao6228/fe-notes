## 语法

```css
linear-gradient(
 [[ <angle> | to <side-or-quadrant> ],]? [ <color-stop> [, <color-hint>]? ]# ,
 <color-stop>
)
```

这里简单解释下语法

- []表示一组规则单元。
- | 表示多组互斥的选项，也就是角度或者象限至少要指明一个。
- #表示组选项会重复 0 次或者多次，并且**出现的值由逗号进行分隔**，也就是至少有两个点(起，终)
- ? 表示 0 个或 1 个

[更多规则请看 mdn 官方文档](https://developer.mozilla.org/en-US/docs/Web/CSS/Value_definition_syntax)

## 渐变图形的形成

线性渐变是沿着一条"梯度线"（也就是渐变线）进行渐变过渡的,其上的每个点具有两种或多种的颜色，且轴上的每个点都具有独立的颜色。linear-gradient() 函数构建一系列**垂直于渐变线**的着色线，每一条着色线的颜色则取决于与之垂直相交的渐变线上的色点, 根据背景的大小截取的最终结果就形成了我们所见的渐变图形

![渐近图形](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/2019-06-07-linear-gradient/The%20calculation%20of%20color%20along%20the%20gradient%20line.png)

## 渐近线

### 渐变线的角度

渐变线的定义则取决于**包含渐变图形的容器的中心点**和**一个顺时针角度**, 根据语法可以知道, 存在两种定义角度的方式, 一种是直接指定角度,如 55deg, 另一种是 to + 方向的形式, 如 to to right

```css
<angle> | to <side-or-quadrant>
```

第一种显而易见, 按照顺时针方向,如下面这种

```css
background: linear-gradient(0deg, red, blue);
```

第二种是指定方向关键字， 如 to top, to top right, to right, to bottom 和 to left 这些值会被转换成角度 0 度、45 度, 90 度, 180 度和 270 度, 对于有两个方向的, 顺序无关

```css
background: linear-gradient(45deg, red, blue);
// 等价于
background: linear-gradient(to top right, red, blue);
// 等价于
background: linear-gradient(to right top, red, blue);
```

### 渐变线的颜色

#### 颜色的类型

任意组合,可以是 rgba,可以是关键字如 transparent, 两种颜色的渐变,也可以是一种颜色不透明到透明的渐变

```css
#ex01 {
  background-image: linear-gradient(
    to right,
    rgb(200, 200, 200),
    rgb(255, 255, 255)
  );
}

#ex02 {
  background-image: linear-gradient(
    to right,
    rgba(200, 200, 200, 1),
    rgba(200, 200, 200, 0)
  );
}
```

#### 渐变的区间

```css
<color> [ <length> | <percentage> ]?
```

length 可以是任何值,px, em, rem

#### 一个彩虹渐变的例子

```css
#spectrum {
  background-image: linear-gradient(
    90deg,
    red,
    orange 25px,
    yellow 50px,
    green 75px,
    blue 100px,
    indigo 125px,
    violet 150px
  );
}
```

![spectrum](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/2019-06-07-linear-gradient/spectrum.png)

### 渐变线的起点和终点

- 起点: 当第一个颜色值没有长度的时候默认从梯度线的起点开始(坐标轴的起点)

- 终点:当空间有剩余的时候终止颜色会一直填充, 当空间不足的时候只填充部分

假设 id 为 spectrum 的 div 只有 2000px,则下面的 indigo 和 violet 的渐变无效

```css
#spectrum {
  background-image: linear-gradient(
    90deg,
    red,
    orange 200px,
    yellow 400px,
    green 600px,
    blue 800px,
    indigo 1000px,
    violet 1200px
  );
}
```

![Gradient clipping when colors stops go too far](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/2019-06-07-linear-gradient/Gradient%20clipping%20when%20colors%20stops%20go%20too%20far.png)
对于没有指定长度的颜色, 按照区间平均分配的原则, 如下面的 orange, green, blue 会在各自的区间内平均分配

```css
#spectrum {
  background-image: linear-gradient(
    90deg,
    red,
    orange,
    yellow 50%,
    green,
    blue,
    indigo 95%,
    violet
  );
}
```

![ Distributing color stops between explicitly placed stops](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/Distributing%20color%20stops%20between%20explicitly%20placed%20stops.png)

如果两个颜色终止位置相同呢? 如下面的 green 和 blue,渐变的分配区间为 0,出现突兀的过渡效果

```css
#spectrum {
  background-image: linear-gradient(
    90deg,
    red 0%,
    orange,
    yellow,
    green 50%,
    blue 50%,
    indigo,
    violet
  );
}
```

![ The effect of coincident color stops](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/2019-06-07-linear-gradient/The%20effect%20of%20coincident%20color%20stops.png)
