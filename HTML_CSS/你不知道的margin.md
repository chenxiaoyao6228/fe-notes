## 前言

本文总结了 CSS 中 Margin 的一些知识点。

## margin 和容器尺寸

### 元素尺寸:

- 可视尺寸: content + padding + border
- 占据尺寸: 包括 margin 值,类似 jquery 中的 outerWidth()方法

### margin 与可视尺寸(content + padding)

#### 前提:

- 适用于没有设定 width/height 的 block 水平元素(不包括设置了 float,absolute/fixed/inline 水平/table cell 等元素）

- 只适用于水平方向的尺寸,比如修改下面元素的 margin 为-50,其宽度就超出了容器(普通元素没有设置宽高,由于元素的流体属性,在水平方向会主动占满父元素的宽度,但在竖直方向上则不会)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20181202021952472.png)

#### 实践：一侧定宽布局

无论外面的容器怎么变化,文字都会占满剩余的宽度

```html
<div class="container">
  <img width="100px" style="float:left" />
  <p style="margin-left: 100px">
    这是文字这是文字这是文字这是文字这是文字这是文字这是文字
  </p>
  <p></p>
</div>
```

#### margin 与占据尺寸

(1)前提:

- block/inline-block 元素均适用
- 与有没有设定 width/height 值无关
- 适用于水平方向和垂直方向

(2)滚动容器上下留白:

```html
<div style="height: 200px;">
  <img width="300px" style="margin: 50px 0;" />
  <p style="margin-left: 100px">
    这是文字这是文字这是文字这是文字这是文字这是文字这是文字
  </p>
  <p></p>
</div>
```

![滚动容器上下留白](https://img-blog.csdnimg.cn/20181202023421104.png)

## margin 与百分比单位

- 普通元素的百分比值: 都是相对容器的**宽度**(包括垂直方向)
-  绝对定位元素的百分比值: 相对容器的**宽度**(包括垂直方向), 相对于**第一个定位**祖先元素计算
-  实践: 宽高比为 2: 1 自适应矩形

```html
<div
  class="father"
  style="width: 600px;background-color: red; overflow: hidden;"
>
  <div class="child" style="margin: 50%;"></div>
</div>
```

![宽高比为2: 1自适应矩形](https://img-blog.csdnimg.cn/20181202025222393.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3podWFueWVtYW5vbmc=,size_16,color_FFFFFF,t_70)

## margin 重叠

##### 1. 条件:

- blcok 水平元素(不包括 float 和 absolute 元素)
- 不考虑 writing-mode, 只发生在垂直方向上(margin-top, margin-bottom)

##### 2. 情境

(1)相邻的兄弟元素![相邻的兄弟元素margin重叠](https://img-blog.csdnimg.cn/20181202031042779.png)
(2)父级和第一/最后一个子元素
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181202031218610.png)
去除 margin 重叠:

- 父元素 BFC(如设置 overflow: hidden)
- 父元素设置 border 或者 padding

##### 3.计算规则

- 正正取最大
- 正负值相加
- 负负取最小

## margin: auto

block 水平元素具有宽度流体属性,会自动填充剩余的空间,但是在设置了宽度之后,流体属性就会丢失,margin:auto 就是为了填充剩下尺寸而设计的

![margin-auro](https://img-blog.csdnimg.cn/20181202033541112.png)

规则: 如果一侧定值,一侧 auto, auto 为剩余空间大小,如果两侧都是 auto,则平分剩余空间, 因此对于**定宽的 block 元素: 使用 margin: 0 auto 能实现左右垂直居中效果**

问题场景以及解释:

- 图片不居中: 图片此时为 inline 水平, 就算没有宽度,也不会占满容器

```html
img{width: 200px; margin: 0 auto} -> img{display: block; width: 200px; margin: 0
auto}
```

- 容器定高, 元素定高,margin: auto 0 无法实现垂直居中: 在高度上并没有流体属性,
- 绝对定位元素的水平垂直居中![绝对定位元素的水平垂直居中](https://img-blog.csdnimg.cn/20181202034704918.png)

## margin 无效

在输入 css 的时候,可能会出现更改 margin 的值但是页面没有发生相应的变化,可以从以下方面进行排查:

- margin 重叠
- margin 不适用于 display 为 table 的类型(table-caption, table, inline-table)

## 参考资料

- css 世界
