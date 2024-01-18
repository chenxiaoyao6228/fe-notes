## 前言

本节实现 canvas 元素选中的功能，包括：

- 单个元素的选中
- 控制器的绘制
- 多个元素的框选

## 包围盒

包围盒顾名思义就是能够把物体全部包起来的盒子,常⻅的有 OBB、AABB、球模型等等

## AABB

AABB（全称 Axis-Aligned Bounding Box，轴对齐包围盒）是一种简化的包围盒形状，它与坐标轴对齐，即包围盒的边与坐标轴平行。

计算起来也比较简单，只需要计算出物体所有顶点的最大最小值即可

```js
function getAABB(element) {
  const minX = element.x;
  const minY = element.y;
  const maxX = element.x + element.width;
  const maxY = element.y + element.height;

  return [minX, minY, maxX, maxY];
}
```

## OBB

OBB（Oriented Bounding Box）包围盒是一种以物体的朝向为基础的轴对齐矩形包围盒。与传统的 AABB（Axis-Aligned Bounding Box，轴对齐包围盒）不同，OBB 能够更精确地围绕物体，以适应其实际的朝向。

以下面的矩形为例，当我们顺时针旋转 45 度时，AABB 包围盒的边就会与物体的边不重合，这时候就需要 OBB 包围盒来更准确地包围物体。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/canvas-bounding-box-rotation.png)

OBB 包围盒通常由以下要素定义：

- 中心点(Center): 包围盒的中心点是物体的中心点。

- 半长轴(Half Extents): 用三个轴向量来表示，分别代表包围盒在三个坐标轴上的半长轴长度。

- 朝向(Orientation): 描述包围盒相对于全局坐标系的旋转。

这种包围盒的优势在于，它可以更准确地逼近物体的形状，因为它可以以物体的实际朝向进行旋转。这对于需要进行碰撞检测、物体之间的相交性检测或视锥体裁剪等场景非常有用。

```js
function getElementBounds(element) {
  const [x1, y1, x2, y2, cx, cy] = getElementAbsoluteCoords(element);

  // 找出旋转后矩形的四个顶点的值
  const [x11, y11] = rotate(x1, y1, cx, cy, element.angle);
  const [x12, y12] = rotate(x1, y2, cx, cy, element.angle);
  const [x22, y22] = rotate(x2, y2, cx, cy, element.angle);
  const [x21, y21] = rotate(x2, y1, cx, cy, element.angle);

  // 取四个新的顶点形成的包围盒
  const minX = Math.min(x11, x12, x22, x21);
  const minY = Math.min(y11, y12, y22, y21);
  const maxX = Math.max(x11, x12, x22, x21);
  const maxY = Math.max(y11, y12, y22, y21);

  return [minX, minY, maxX, maxY];
}

// 获取矩形元素的绝对坐标，包括左上角、右下角以及中心点的坐标
function getElementAbsoluteCoords(element) {
  return [
    element.x,
    element.y,
    element.x + element.width,
    element.y + element.height,
    element.x + element.width / 2,
    element.y + element.height / 2,
  ];
}

// 实现二维平面上点的旋转，用于在给定点 (x2, y2) 处将点 (x1, y1) 绕该点旋转 angle 弧度
// https://math.stackexchange.com/questions/2204520/how-do-i-rotate-a-line-segment-in-a-specific-point-on-the-line
function rotate(x1, y1, x2, y2, angle) {
  return [
    (x1 - x2) * Math.cos(angle) - (y1 - y2) * Math.sin(angle) + x2,
    (x1 - x2) * Math.sin(angle) + (y1 - y2) * Math.cos(angle) + y2,
  ];
}
```

## More

碰撞检测算法主要包括：外接图形法，光线投影法，分轴定理与最小偏移向量法, 有兴趣可以去看看
