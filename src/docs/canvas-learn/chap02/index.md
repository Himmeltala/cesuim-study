# 填充属性

通过以下两个属性可以设置图形的填充颜色和轮廓颜色。

fillStyle = color
设置图形的填充颜色。

strokeStyle = color
设置图形轮廓的颜色。

# fillStyle

用两层 for 循环来绘制方格阵列，每个方格不同的颜色。仅修改红色和绿色通道的值。

```js
function draw(ctx) {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      ctx.fillStyle = `rgb(${Math.floor(255 - 42.5 * i)} ${Math.floor(
        255 - 42.5 * j,
      )} 0)`
      ctx.fillRect(j * 25, i * 25, 25, 25)
    }
  }
}
```

# strokeStyle

通过 strokeStyle 绘制圆形轮廓。

```js
function draw(ctx) {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      ctx.strokeStyle = `rgb(0 ${Math.floor(255 - 42.5 * i)} ${Math.floor(
        255 - 42.5 * j,
      )})`
      ctx.beginPath()
      ctx.arc(12.5 + j * 25, 12.5 + i * 25, 10, 0, 2 * Math.PI, true)
      ctx.stroke()
    }
  }
}
```
