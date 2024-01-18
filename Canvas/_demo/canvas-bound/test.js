/*
 * 涉及的知识点
 * 1. 度数转弧度
 * 2. 包围盒
 * 3. 多个元素的包围盒
 */

const element = {
  type: "rectangle",
  x: -50,
  y: -50,
  width: 100,
  height: 100,
  angle: (Math.PI / 180) * 45,
};

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

function rotate(x1, y1, x2, y2, angle) {
  // 𝑎′𝑥=(𝑎𝑥−𝑐𝑥)cos𝜃−(𝑎𝑦−𝑐𝑦)sin𝜃+𝑐𝑥
  // 𝑎′𝑦=(𝑎𝑥−𝑐𝑥)sin𝜃+(𝑎𝑦−𝑐𝑦)cos𝜃+𝑐𝑦.
  // https://math.stackexchange.com/questions/2204520/how-do-i-rotate-a-line-segment-in-a-specific-point-on-the-line
  return [
    (x1 - x2) * Math.cos(angle) - (y1 - y2) * Math.sin(angle) + x2,
    (x1 - x2) * Math.sin(angle) + (y1 - y2) * Math.cos(angle) + y2,
  ];
}

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

console.log("_bounds", getElementBounds(element));
