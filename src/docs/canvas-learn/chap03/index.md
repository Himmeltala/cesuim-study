# 绘制函数

两种渲染文本的方法：

fillText(text, x, y [, maxWidth])
在指定的 (x,y) 位置填充指定的文本。绘制的最大宽度是可选的。

strokeText(text, x, y [, maxWidth])
在指定的 (x,y) 位置绘制文本边框。绘制的最大宽度是可选的。

# fillText

```js
function draw(ctx) {
  ctx.font = '48px serif'
  ctx.fillText('你好世界', 10, 50)
}
```

# strokeText

```js
function draw(ctx) {
  ctx.font = '48px serif'
  ctx.strokeText('你好世界', 10, 50)
}
```

# 文本样式

差不多跟CSS样式保持一致

```js
function draw(ctx) {
  ctx.font = '48px serif'

  ctx.textBaseline = 'hanging'
  ctx.strokeText('hanging', 10, 50)

  ctx.textBaseline = 'middle'
  ctx.strokeText('middle', 250, 50)

  ctx.beginPath()
  ctx.moveTo(10, 50)
  ctx.lineTo(300, 50)
  ctx.stroke()
}
```

# 文本宽度

measureText()
返回一个包含以当前文本样式绘制指定文本时，其所具有的宽度（以像素为单位）的 TextMetrics 对象。

```js
const ctx = document.getElementById('canvas').getContext('2d')
const text = ctx.measureText('foo') // TextMetrics 对象
text.width
```
