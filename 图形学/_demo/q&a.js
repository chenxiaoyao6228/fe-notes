class Vector2D {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  // 向量叉积
  crossProduct(vector) {
    return this.x * vector.y - this.y * vector.x;
  }

  // 向量点积
  dotProduct(vector) {
    return this.x * vector.x + this.y * vector.y;
  }
}

// 判断两条线段的位置关系
function checkSegmentsRelationship(
  [mx1, my1],
  [mx2, my2],
  [nx1, ny1],
  [nx2, ny2]
) {
  const mxVector = new Vector2D(mx2 - mx1, my2 - my1);
  const nxVector = new Vector2D(nx2 - nx1, ny2 - ny1);
  const displacement = new Vector2D(nx1 - mx1, ny1 - my1);
  const mxCrossNx = mxVector.crossProduct(nxVector);

  if (mxCrossNx === 0) {
    // 方向向量平行，进一步判断是否重叠
    if (
      displacement.dotProduct(mxVector) === 0 &&
      displacement.dotProduct(nxVector) === 0
    ) {
      return "重叠";
    } else {
      return "平行但不重叠";
    }
  } else {
    // 方向向量不平行，进一步判断是否相交
    const t = displacement.crossProduct(nxVector) / mxCrossNx;
    const u = displacement.crossProduct(mxVector) / mxCrossNx;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return "相交";
    } else {
      return "不相交";
    }
  }
}

// 测试用例
console.log(checkSegmentsRelationship([0, 0], [2, 2], [1, 0], [1, 3])); // 相交
console.log(checkSegmentsRelationship([0, 0], [2, 2], [3, 3], [5, 5])); // 平行但不重叠
console.log(checkSegmentsRelationship([0, 0], [2, 2], [3, 0], [5, 2])); // 平行但不重叠
console.log(checkSegmentsRelationship([0, 0], [2, 2], [1, 1], [3, 3])); // 平行但不重叠
console.log(checkSegmentsRelationship([0, 0], [2, 2], [1, 1], [1, 3])); // 相交
console.log(checkSegmentsRelationship([0, 0], [2, 2], [0, 2], [2, 0])); // 相交
console.log(checkSegmentsRelationship([0, 0], [2, 2], [1, 1], [3, 0])); // 相交
console.log(checkSegmentsRelationship([0, 0], [2, 2], [3, 3], [5, 5])); // 平行但不重叠
console.log(checkSegmentsRelationship([0, 0], [2, 2], [3, 0], [5, 2])); // 平行但不重叠
