class Vector2D {
  // 静态方法，根据两个点返回一个向量
  static fromPoints(point1, point2) {
    return new Vector2D(point2.x - point1.x, point2.y - point1.y);
  }
  // 静态方法，返回两个向量之间的距离
  static distance(vector1, vector2) {
    const dx = vector1.x - vector2.x;
    const dy = vector1.y - vector2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // 静态方法，返回两个向量之间的夹角（弧度）
  static angleBetween(vector1, vector2) {
    const dotProduct = vector1.dotProduct(vector2);
    const len1 = vector1.length();
    const len2 = vector2.length();
    return Math.acos(dotProduct / (len1 * len2));
  }

  static isEqual(vector1, vector2) {
    return vector1.x === vector2.x && vector1.y === vector2.y;
  }

  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  // 返回向量的方向（以弧度表示）
  direction() {
    return Math.atan2(this.y, this.x);
  }

  // 返回向量的模
  length() {
    // length
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // 向量加法
  add(vector) {
    return new Vector2D(this.x + vector.x, this.y + vector.y);
  }

  // 向量减法
  subtract(vector) {
    return new Vector2D(this.x - vector.x, this.y - vector.y);
  }

  // 数量乘法
  multiplyScalar(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  // 向量点积
  dotProduct(vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  // 向量归一化
  normalize() {
    const len = this.length();
    if (len !== 0) {
      return this.multiplyScalar(1 / len);
    }
    return new Vector2D();
  }

  // 向量旋转
  rotate(rad) {
    // const cosAngle = Math.cos(angle);
    // const sinAngle = Math.sin(angle);
    // const x = this.x * cosAngle - this.y * sinAngle;
    // const y = this.x * sinAngle + this.y * cosAngle;
    // return new Vector2D(x, y);
    const c = Math.cos(rad),
      s = Math.sin(rad);

    const _x = this.x * c + this.y * -s;
    const _y = (y = x * s + y * c);

    return new Vector2D(_x, _y);
  }

  // 向量缩放
  scale(length) {
    return new Vector2D(this.x * length, this.y * length);
  }
  //
  copy() {
    return new Vector2D(this.x, this.y);
  }
}

// 示例用法
const vector1 = new Vector2D(3, 4);
const vector2 = new Vector2D(1, 2);
const vector3 = new Vector2D(3, 4);
const vector4 = new Vector2D(6, 8);

console.log("Vector1:", vector1);
console.log("Vector2:", vector2);
console.log("--------------------------");

const vectorFromPoints = Vector2D.fromPoints({ x: 1, y: 1 }, { x: 4, y: 5 });

console.log("--------------------------");

console.log("Addition:", vector1.add(vector2));
console.log("--------------------------");
console.log("Subtraction:", vector1.subtract(vector2));
console.log("--------------------------");
console.log("Multiplication:", vector1.multiplyScalar(2));
console.log("Dot Product:", vector1.dotProduct(vector2));
console.log("--------------------------");
const length = vector1.length();
console.log(`向量的模：${length}`);
console.log("--------------------------");
console.log("Normalized Vector1:", vector1.normalize());
console.log("--------------------------");
const distance = Vector2D.distance(vector1, vector2);
console.log("Distance between Vector1 and Vector2:", distance);
console.log("--------------------------");
const angle = Vector2D.angleBetween(vector1, vector2);
console.log("Angle between Vector1 and Vector2:", angle);

console.log("--------------------------");
console.log("Is Vector1 equal to Vector2?", Vector2D.isEqual(vector1, vector2));
console.log("Is Vector1 equal to Vector2?", Vector2D.isEqual(vector1, vector3));
console.log("Is Vector1 equal to Vector2?", Vector2D.isEqual(vector1, vector4));

console.log("--------------------------");

const vector = new Vector2D(3, 4);
const dirRadians = vector.direction(); // 获取向量的方向（以弧度表示）
console.log(`向量的方向（以弧度表示）：${dirRadians}`);
const dirDegrees = dirRadians * (180 / Math.PI); // 将弧度转换为角度
console.log(`向量的方向（以角度表示）：${dirDegrees}`);

console.log("-----------1111---------------");
const vector6 = new Vector2D(3, 4);
console.log("Original Vector:", vector);

const rotatedVector = vector.rotate(Math.PI / 4); // 45度角旋转
console.log("Rotated Vector:", rotatedVector);

const scaledVector = vector.scale(2, 3); // X轴方向缩放2倍，Y轴方向缩放3倍
console.log("Scaled Vector:", scaledVector);
