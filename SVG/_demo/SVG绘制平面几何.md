## 前言

- 平面向量的知识回顾
- 如何 svg 绘制弧形

## 向量的知识回顾

见[向量计算](../计算机图形学/向量计算.md)

## svg 绘制弧形

如果知道圆心 O, 以及圆上的两个点 A, B,以及圆的半径 r, 该如何用 svg 或者 canvas 画出这个圆弧

```html
<svg width="200" height="200">
  <path
    fill="none"
    stroke="black"
    d="M A_x A_y
      A r r, 0, largeArcFlag, sweepFlag, B_x B_y"
  />
</svg>
```

要计算 largeArcFlag, sweepFlag

如果是 canvas 呢?

```html
<canvas id="myCanvas" width="200" height="200"></canvas>
<script>
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  var A_x = 50; // 点 A 的 X 坐标
  var A_y = 50; // 点 A 的 Y 坐标
  var B_x = 150; // 点 B 的 X 坐标
  var B_y = 100; // 点 B 的 Y 坐标
  var centerX = 100; // 圆心 X 坐标
  var centerY = 100; // 圆心 Y 坐标
  var radius = 50; // 圆的半径

  // 计算起始角度和终止角度
  var angleStart = Math.atan2(A_y - centerY, A_x - centerX);
  var angleEnd = Math.atan2(B_y - centerY, B_x - centerX);
  var sweepFlag = angleEnd - angleStart <= Math.PI ? 1 : 0;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, angleStart, angleEnd, sweepFlag);
  ctx.stroke();
</script>
```

还是要计算角度, 为什么这么麻烦呢?

## 参考

- 【有道云笔记】元素-平面几何 https://note.youdao.com/s/PbcfwLl
- https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths
- 彻底理解 Canvas/SVG 圆弧算法: https://zhuanlan.zhihu.com/p/85891095
- https://zhuanlan.zhihu.com/p/359975221
- https://kb.cvte.com/pages/viewpage.action?pageId=223293856
- https://kb.cvte.com/pages/viewpage.action?pageId=223288524
- https://zhuanlan.zhihu.com/p/441246835
