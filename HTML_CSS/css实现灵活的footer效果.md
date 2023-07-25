## 前言

要求实现下面的效果： 给定下面的 html,要求.content 的内容高度较小的时候 footer 贴在底部，.content 高度比较高的时候 footer 跟随 content, 注意: footer 的高度不一定

```html
<main class="container">
  <content class="content">内容</content>
  <footer class="footer">底部</footer>
</main>
```

审题要点:

- footer 高度不一定
- content 不拉升
- 不影响浏览器的默认滚动

## flex

这也是最容易想到的实现方式

```css
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}
```
缺点: IE9 不支持

👉 [Github在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/HTML_CSS/_demo/flexible-footer/flex.html)


## grid 布局

原理大同小异

```css
.container {
  min-height: 100vh;
  display: grid;
  align-content: space-between;
}
```

👉 [Github在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/HTML_CSS/_demo/flexible-footer/grid.html)

## flex + margin-top:auto

这也是本期的最佳实现

```css
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.footer {
  margin-top: auto;
}
```

👉 [Github在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/HTML_CSS/_demo/flexible-footer/grid.html)

这里值得注意的是 margin-top: auto, 根据《css 世界》一书的解释， 要使 margin:auto 能够实现自动分配空间的效果，对应的方向必须具有自动填充的特性，在正常的情况下， 只有左右具有自动填充的效果，因此 margin: 0 auto 能够实现元素的水平居中， 但是 margin: auto 0 并不能实现垂直方向的居中效果，而绝对定位的元素使元素处于一种尺寸可拉伸的上下文环境，如下列的例子， margin-top: auto 能够实现贴底部效果

```css
.outer {
  height: 500px;
  position: relative;
}
.inner {
  height: 200px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin-top: auto;
}
```

和绝对定位的元素一样， flex 布局下，所有元素处于一种尺寸可拉伸的上下文环境，此时，footer 设置 margin-top:auto 是可以实现顶部对齐的

注: 如果 footer 的高度一定， 那么实现的方式就多了，这里不赘述
