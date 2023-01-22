---
title: flex与margin auto为何能实现水平居中效果
date: 2019-10-18
categories:
  - tech
tags:
  - css
permalink: 2019-10-18-flex-and-margin-auto
---

## 前言

在 flex 布局出来之前，实现垂直居中效果可谓是 css 中的一大难点，各种脑洞五花八门，在 flex 出来之后，一切都变得简单起来，仅仅需要下面几行代码

```
// html
<div class="container">
    <div class="content"></div>Kv
</div>
.container {
    display: flex;
    justify-content: center;
    align-items: center
}
```

但是你可知道,下面仅仅两行代码也能实现垂直居中的效果？

```
.container {
    display: flex;
}
.content {
    margin: auto
}
```

<iframe height="265" style="width: 100%;" scrolling="no" title="flex-and-margin-auto" src="//codepen.io/Allen6228/embed/mZWNKx/?height=265&theme-id=0&default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/Allen6228/pen/mZWNKx/'>flex-and-margin-auto</a> by XiaoYao
  (<a href='https://codepen.io/Allen6228'>@Allen6228</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## 解释

css 规范是这样解释的,在 dispaly: flex 下：

> Prior to alignment via justify-content and align-self, any positive free space is distributed to auto margins in that dimension.

稍微翻译就是，容器使用了 display: flex，但是没有使用 justify-content 或者 align-self 进行元素定位之前，所有的剩余空间都会自动分配到该方向的 auto margin 中去，根据 margin: auto 的渲染规则， 当两侧为 auto 的时候，就会表现为平分两侧空间，也就是上面的效果，如果一侧 auto, 则会表现为一侧对齐

左侧对齐效果：

```
.content {
    margin-left: auto
}
```

右侧对齐效果

```
.content {
    margin-right: auto
}
```

## 参考

[the-peculiar-magic-of-flexbox-and-auto-margins](https://css-tricks.com/the-peculiar-magic-of-flexbox-and-auto-margins/)
