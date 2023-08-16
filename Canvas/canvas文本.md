## 前言

大纲：

- 如何在 canvas 中实现多行文本
- 如何实现文本的两端对齐效果
- canvas 中如何动态加载文本
- 如何为不同的字体设置行高
- 如何实现删除线的功能

## 实现删除线

```js
if (element.textDecoration === TEXT_DECORATION.lineThrough) {
  context.textBaseline = "alphabetic";

  const text = lines[index];
  const x = horizontalOffset;
  const y = index * lineHeightPx + lineHeightPx / 2;
  const textWidth = context.measureText(text).width;

  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + textWidth, y);
  context.strokeStyle = element.strokeColor;
  context.lineWidth = getLineThrough(element.fontSize);
  context.stroke();
}
```

## 参考

- https://dev.to/thehomelessdev/how-to-add-a-custom-font-to-an-html-canvas-1m3g

- [canvas 文本绘制自动换行、字间距、竖排等实现](https://www.zhangxinxu.com/wordpress/2018/02/canvas-text-break-line-letter-spacing-vertical/)
