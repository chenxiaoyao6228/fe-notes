## 前言

在做工具栏的时候，产品希望在不同的端(PC, 移动，IFP 大板上)工具栏位置不同

效果图大概是这样:

<img src="https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/transform-all-direction.png" height="300"/>


[在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/踩坑汇总/_demo/transform/index.html)


基本的思考思路是： toolBar作为工具栏导出给外部使用，通过position参数来支持不同的位置调用


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
