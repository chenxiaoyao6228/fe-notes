import Vector2D from "./Vector2D";

function regularShape(edges = 3, x, y, step) {
  const ret = [];
  const delta = Math.PI * (1 - (edges - 2) / edges);
  let p = new Vector2D(x, y);
  const dir = new Vector2D(step, 0);
  ret.push(p);
  for (let i = 0; i < edges; i++) {
    p = p.copy().add(dir.rotate(delta));
    ret.push(p);
  }
  return ret;
}

// create a draw function that accepts a list of vectors
function draw(ctx, vectors) {
  ctx.beginPath();
  ctx.moveTo(vectors[0].x, vectors[0].y);
  for (let i = 1; i < vectors.length; i++) {
    ctx.lineTo(vectors[i].x, vectors[i].y);
  }
  ctx.closePath();
  ctx.stroke();
}

// create a canvas
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext("2d");

draw(regularShape(3, 128, 128, 100)); // 绘制三角形
draw(regularShape(6, -64, 128, 50)); // 绘制六边形
draw(regularShape(11, -64, -64, 30)); // 绘制十一边形
draw(regularShape(60, 128, -64, 6)); // 绘制六十边形
