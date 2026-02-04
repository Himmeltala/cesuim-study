# 基础位移动画

让图形在画布上左右 / 上下移动，核心是更新 x/y 坐标，碰到边界就反弹。

```js
let x = 0
let speed = 3 // 移动速度

const drawMoveAnimation = () => {
  clearCanvas()
  x += speed
  if (x < 0 || x > canvasRef.value.width - 100) {
    speed = -speed
  }
  ctx.fillStyle = '#409eff'
  ctx.fillRect(x, 200, 100, 100)
  animationId = requestAnimationFrame(drawMoveAnimation)
}
```

# 旋转动画

让图形绕自身中心旋转，结合之前学的 translate + rotate 套路，别忘了 save/restore 隔离状态。

```js
// 旋转动画变量
let angle = 0

const drawRotateAnimation = () => {
  clearCanvas()
  // 更新角度
  angle += 0.02

  ctx.save()
  ctx.translate(400, 250)
  ctx.rotate(angle)
  ctx.translate(-400, -250)

  // 绘制正方形
  ctx.fillStyle = '#67c23a'
  ctx.fillRect(350, 200, 100, 100)
  ctx.restore()

  animationId = requestAnimationFrame(drawRotateAnimation)
}
```

# 缩放动画

让图形放大缩小，用 scale 结合动态缩放比例，实现呼吸灯效果。

```js
// 缩放动画变量
let scale = 1;
let scaleSpeed = 0.01; // 缩放速度

const drawScaleAnimation = () => {
  clearCanvas();
  // 更新缩放比例：1~1.5之间来回缩放
  scale += scaleSpeed;
  if (scale < 1 || scale > 1.5) {
  scaleSpeed = -scaleSpeed;
  }

  ctx.save();
  // 以中心为原点缩放
  ctx.translate(400, 250);
  ctx.scale(scale, scale);
  ctx.translate(-400, -250);

  // 绘制圆形
  ctx.beginPath();
  ctx.fillStyle = "#e6a23c";
  ctx.arc(400, 250, 80, 0, Math.PI \* 2);
  ctx.fill();
  ctx.restore();

  animationId = requestAnimationFrame(drawScaleAnimation);
};
```

# 多元素动画

同时让多个图形做不同动画，比如多个小球随机移动，核心是用数组存每个元素的参数，循环更新 + 绘制。

```js
let balls = [];
// 初始化小球
const initBalls = () => {
  balls = [];
  for (let i = 0; i < 10; i++) {
    balls.push({
      x: Math.random() _ 800,
      y: Math.random() _ 500,
      speedX: Math.random() _ 3 - 1.5, // 水平速度
      speedY: Math.random() _ 3 - 1.5, // 垂直速度
      radius: Math.random() * 10 + 5, // 半径
      color: `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`
  });
  }
};

const drawMultiAnimation = () => {
  clearCanvas();
  // 循环更新每个小球
  balls.forEach(ball => {
  ball.x += ball.speedX;
  ball.y += ball.speedY;
  // 边界反弹
  if (ball.x < ball.radius || ball.x > canvasRef.value.width - ball.radius) ball.speedX = -ball.speedX;
  if (ball.y < ball.radius || ball.y > canvasRef.value.height - ball.radius) ball.speedY = -ball.speedY;
  // 绘制小球
  ctx.beginPath();
  ctx.fillStyle = ball.color;
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI \* 2);
  ctx.fill();
});

animationId = requestAnimationFrame(drawMultiAnimation);
};
```

# 停止动画

动画开了不关会一直跑，占内存！用 cancelAnimationFrame 停止，记得存动画 ID。

```js
// 停止所有动画
const stopAnimation = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}
```
