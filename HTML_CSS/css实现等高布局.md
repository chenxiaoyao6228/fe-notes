## 前言

给定下面一段 html 标签，实现左右两侧无论内容多少，都能保持等高的效果

```html
<div class="container">
  <div id="colLeft" class="column-left">
    左边的内容左边的内容左边的内容左边的内容左边的内容
  </div>
  <div id="colRight" class="column-right">右边的内容</div>
</div>
```

## marigin + padding

原生的 DOM api 中有 clientHeight 和 clientWidth,指的是元素的 padding-box 的尺寸，通常也称为"可视尺寸"，padding 和 margin 都可以改变元素的可视尺寸,但是两者的作用的方式不同，**对于 padding 而言，只有当元素设置了宽度的时候才起作用，原因是 width 默认作用的是 content-box, 增加了 padding,对于元素而言，表现为可视尺寸的增加，而对于 margin 而言， 正好互补， 仅当元素处于'充分利用可用空间的时候'才起作用**
举个例子:对于下面.box 而言，设置了宽度和负 margin 值，元素的可视尺寸没有发生变化

```html
// html
<div class="box"></div>

// css .box { width: 300px; margin: 0 -20px; }
```

而如果是父元素定宽，在子元素上设置 margin 值的话，子元素可视尺寸变了，宽度表现为 340px!

```html
<div class="box-outer">
  <div class="box-inner"></div>
</div>
```

```css
.box-outer {
  width: 300px;
  height: 200px;
  background: gold;
}
.box-inner {
  height: 100%;
  background: green;
  margin: 0 -20px;
}
```

👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/HTML_CSS/_demo/css-equal-height/1.html)

了解上面的原理之后，我们来看看如何使用 margin 和 padding 来实现我们的等高布局效果

```css
.column {
  overflow: hidden;
}
.column-left,
column-right {
  margin-bottom: -999px;
  padding-bottom: 999px;
}
```

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/css-equal-height-2.png)

👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/HTML_CSS/_demo/css-equal-height/2.html)
