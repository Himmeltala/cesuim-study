# 获取上下文

左上角是原点（0,0）。所有元素的位置都相对于原点定位。canvas 只支持两种形式的图形绘制：矩形和路径（由一系列点连成的线段）。

通过 getContext() 获取 canvas 的上下文。

```js
let canvas = document.getElementById('tutorial')
let ctx = canvas.getContext('2d')
```

绘制两个正方形

```js
ctx.fillStyle = 'rgb(200,0,0)'
ctx.fillRect(10, 10, 55, 50)

ctx.fillStyle = 'rgba(0, 0, 200, 0.5)'
ctx.fillRect(30, 30, 55, 50)
```

# 绘制函数

canvas 提供了三种方法绘制矩形：

fillRect(x, y, width, height)
绘制一个填充的矩形

strokeRect(x, y, width, height)
绘制一个矩形的边框

clearRect(x, y, width, height)
清除指定矩形区域，让清除部分完全透明。

上面提供的方法之中每一个都包含了相同的参数。x 与 y 指定了在 canvas 画布上所绘制的矩形的左上角（相对于原点）的坐标。width 和 height 设置矩形的尺寸。
