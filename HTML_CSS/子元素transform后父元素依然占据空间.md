## 前言

在做工具栏的时候，产品希望在不同的端(PC, 移动，IFP 大板上)工具栏位置不同

效果图大概是这样:

<img src="https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/transform-all-direction.png" height="300"/>

👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/踩坑汇总/_demo/transform/index.html)

基本的思考思路是： toolBar 作为工具栏导出给外部使用，通过 position 参数来支持不同的位置调用

在实现左边工具栏的过程中遇到了几个问题，记录一下:

### transform-origin: left bottom

一开始想的是通过变换`transform-origin`为`left bottom`, 然后再通过`transform(Y)` 后来发现这种实现会影响使用方的定位，这是不可接受的

### transform 的顺序问题:

`先偏移后旋转`与`先旋转后偏移`会有不同的效果

```css
.toolBar.left {
  transform: translateX(-50%) rotate(90deg);
}
```

### 子元素 transform 后父元素依然占据空间:

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/transform-left.png)

这个可以通过`height: 0`解决:

```css
.toolBar {
  height: 0;
}
```

### 与空间占据相关的另外一个问题

为了实现 10px 的文字，这里使用了 transform, 但是还是占据了之前的空间，这里希望是能自动跟随间距(项目支持多语言)， 够的时候不换行，不够的时候移动到下一行， 总结来说就是在缩放的情况下实现类似流体布局自适应效果

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/css-transform-but-space-still-occupy.png)

```css
@media @small-iframe {
  font-size: 12px;
  width: 120%; // 解决登录注册页面文字换行的问题
  transform: scale(0.833333333); // 解决登录注册页面文字换行的问题
}
```

同时，为避免滚动， 在父容器中需要设置 overflow:hidden

