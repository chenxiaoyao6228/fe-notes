## 前言

这篇文章源于同事问了我两个问题:

(1)为什么 height 和 line-height 设置相同的值能够使得单行文字垂直居中?
(2)如何实现多行文字水平垂直居中效果?

经过学习,大致形成了自己的思路,也顺利解决了同事的疑惑,觉得有必要写篇文章记录,一来是给自己做备忘,二来是给恰好有此疑惑的同行一个解决问题的思路,鉴于本人水平有限,文中不当之处欢迎批评指教.

(一)从文字和图片的间隙说起:

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/vertical-align-img-text-gap.png)

代码如下:

```html
<style>
  .box {
    background-color: green;
  }
  .box > img {
    width: 100px;
    height: 100px;
  }
</style>
<div class="box">this is a picture<img src="3.png"</div>
```

当你无法理解某项概念的时候,很有可能你遗漏了某些底层的知识,我们来看看要理解这个概念,我们需要哪些知识:

1、line-height 与行距

1.1 行距

> 两行文字之间的距离,与传统印刷行业等不同, css 中行距分别在一行的上下,各占一半,称半行距

1.2 line-height 与半行距的关系

> line-height - 半行距 = 1 embox 的作用范围,1em box 可以近似理解为 font-size 的作用范围或者文字选中的范围

1.3 line-height 的默认值 normal 以及和 font-size 的关系;

> line-height 具有继承性,默认值为 normal,且与 font-size 和 font-family 紧密相关,css 规范中规定为 font-size 的 1.0~1.2 倍。

1.4 line-height 的作用对象

> 对于 inline 和 inline-block 元素作用于元素自身,对于 block 元素,子元素通过继承被作用

1.5 line-height 与替换元素

> line-height 只能决定行框盒子的最小高度(行框盒子后面会讲),img 高度大于 line-height 的时候,line-height 是不起作用的

有了知识 1,我们已经可以解决同事的第一个问题:为什么 height 和 line-height 设置相同的值能够使得单行文字垂直居中?

```html
<style>
  div {
    height: 50px;
    line-height: 50px;
    background-color: green;
  }
  span {
    background-color: yellow;
  }
</style>
<div>
  <span>这里是文字这里是文字这里是文字这里是文字这里是文字这里是文字</span>
</div>
```

事实是:单行文字的居中与 height 无关,只需要一个 line-height 就可以实现.

```html
<style>
  div {
    line-height: 50px;
  }
</style>
```

对于多行文字而言,效果是这样的,可以看到,block 元素的高度可以通过 inline 元素的高度叠加撑起来,同时加上盒子模型的 padding, margin, border,就构成了 css 中内容的高度

下面回到我们之前文字和图片空隙的问题,了解这一点,还需要 vertical-align 的知识

2.1 各种线

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/typography-term.png)

2.2 line-height 作用范围以及默认作用 vertical-align: baseline

(1)inline:如文字

默认 font-size 下 x 的基线为基准,以各自的基线进行对齐,但注意不同 font-size 和 font-family 的文字的基线是不一样的

(2)inline-block:

默认 font-size 下 x 的基线为基准,如果里面没有 inline 元素(类似 img,或者空 span 设置了 display:inline-block),或者 overflow 不是 visible,该元素的基线就是其 margin 的底;如果有 inline 元素,其基线就是最后一行 inline 元素的基线

(3)block:不起作用

现在可以解决我们的疑问了.文字和图片是按照基线来对齐的,因此下面出现的空隙就是半行间距

终于松了一口气,可是当我们把 img 标签前面的文字去掉, 却惊人地发现,效果还是和原来一样,空隙依然存在!!!

要理解这一点,就要引入另外两个概念: 行内框盒子模型与幽灵空白节点

3.行内框盒子模型

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/inline-box-model.png)

3.1 幽灵空白节点
浏览器在渲染的时候,会每一个行框盒子(linebox)前面渲染一个宽度为零高度为行高的空白节点,就跟文字的表现一样

我们现在来解释一个图片的间隙:

首先:浏览器有默认的 font-size,如在 chrome 中为 16px

其次:line-height 不作用于外部的 div,作用于内部的元素,line-heiht 默认的属性值为 normal, 为 font-size 的 1.0~1.2 倍,具体由浏览器决定,导致了行间距和半行间距大于 0

再次:文字和图片按基线对齐,因此底部会出现宽度为半行距的空隙

最后:由于浏览器的渲染机制,导致空白节点的表现和文字的变现一样.

搞清楚原理之后,我们可以着手来消除这个间隙

方法一:设置 vertical-align:top/middle/bottom

```css
.box > img {
  vertical-align: middle;
}
```

方法二:将 img 设置为 block 元素

```css
.box > img {
  display: block;
}
```

方法三:去除行间距,line-height 或者 font-size 为 0

```css
.box {
  line-height: 0;
  /*font-size: 0;*/
}
```

(二)实现多行文字垂直居中效果

```html
<style>
  .container {
    height: 300px;
    line-height: 300px;
    background-color: red;
    text-align: center;
    overflow: hidden;
  }
  .content {
    display: inline-block;
    width: 200px;
    height: 200px;
    line-height: 20px;
    vertical-align: middle;
    text-align: left;
    background-color: yellow;
  }
</style>
<div class="container">
  <span class="content"
    >这里是文字这里是文字这里是文字这里是文字这里是字这里是字这里是字这里是字这里是字这里是字这里是字这里是文字这里是文字这里是文字这里是文字这里是文字这里是文字这里是文字</span
  >
</div>
```

效果如下：

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/multipline-text-vertical-align.png)

原理根本在于为外部的 container 和内部的 content 设置不同的 line-height,利用幽灵空白节点和 content 的 vertical-align: middle 对齐来实现垂直居中效果

1.span 为内联元素,其内容形成一个内联盒子,进而形成一个行框盒子(line box)

2.浏览器在渲染的时候会在每个 line-box 前面渲染一个空白节点,container 高度由这个节点的 line-height 撑起

3.利用 vertical-align:middle 实现与幽灵空白节点的居中对齐

4.设置为 inline-block 可以对 content 的宽高进行设置

## 总结

实现垂直居中的效果还有其他的方法,这里只是提供了一种思路,本文主要参考了《css 世界》中的内容,并且进行了按照自己的逻辑简化，避免了事无巨细的描述，如想了解更多，可以读一下此书。

本文首发于 [CSDN](https://blog.csdn.net/zhuanyemanong/article/details/81266172)
