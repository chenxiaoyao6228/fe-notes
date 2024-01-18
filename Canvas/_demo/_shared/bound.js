/**
 * 获取元素的绝对坐标，不包含旋转，AABB包围盒
 * @returns [x1, y1, x2, y2, cx, cy] => [左上角x, 左上角y, 右下角x, 右下角y, 中心x, 中心y]
 */

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

// 获取单个元素的OBB包围盒
export function getElementBounds(element) {
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
  
 const  _bounds = [minX, minY, maxX, maxY];

  return _bounds;
}

// 获取多个元素的最大包围盒
export const getCommonBounds = (elements) => {
  if (!elements.length) {
    return [0, 0, 0, 0];
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  elements.forEach((element) => {
    const [x1, y1, x2, y2] = getElementBounds(element);
    minX = Math.min(minX, x1);
    minY = Math.min(minY, y1);
    maxX = Math.max(maxX, x2);
    maxY = Math.max(maxY, y2);
  });

  return [minX, minY, maxX, maxY];
};
