<template>
  <div class="canvas-image-demo">
    <div class="canvas-box">
      <canvas ref="canvasRef" width="800" height="500"></canvas>
    </div>
    <div class="btn-group">
      <el-button @click="drawBasicImage">基础绘制图片</el-button>
      <el-button @click="drawScaleImage">缩放绘制</el-button>
      <el-button @click="drawSliceImage">切片绘制（抠图）</el-button>
      <el-button @click="drawPatternImage">平铺图片</el-button>
      <el-button @click="drawAlphaImage">半透明绘制</el-button>
      <el-button @click="saveCanvasImage">保存画布为图片</el-button>
      <el-button @click="clearCanvas">清空画布</el-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

import { ElButton } from 'element-plus'

const canvasRef = ref(null)
let ctx = null

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
  }
})

// 基础绘制图片（drawImage 3参数：图片、x坐标、y坐标）
const drawBasicImage = () => {
  clearCanvas() // 先清空画布
  const imgUrl =
    'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
  const img = new Image()
  img.src = imgUrl
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    ctx.drawImage(img, 0, 0)
  }
}

// 缩放绘制（drawImage 5参数：图片、x、y、绘制宽度、绘制高度）
const drawScaleImage = () => {
  clearCanvas()
  const imgUrl =
    'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
  const img = new Image()
  img.src = imgUrl
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    // 原图800x500，缩放到400x250，放在画布中心
    ctx.drawImage(img, 200, 125, 400, 250)
  }
}

// 切片绘制（抠图，drawImage 9参数：原图裁剪+画布绘制）
const drawSliceImage = () => {
  clearCanvas()
  const imgUrl =
    'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
  const img = new Image()
  img.src = imgUrl
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    // 参数含义：原图sx, sy, 原图裁剪宽高, 画布dx, dy, 画布绘制宽高
    // 从原图(200,100)位置，裁剪400x300的区域，画到画布(0,0)，尺寸不变
    ctx.drawImage(img, 200, 100, 400, 300, 0, 0, 400, 300)
  }
}

// 平铺图片（用createPattern创建重复图案）
const drawPatternImage = () => {
  clearCanvas()
  const imgUrl =
    'https://s1.aigei.com/src/img/png/47/4749c783cf74474ea7c3f600dbcb7e8f.png?imageMogr2/auto-orient/thumbnail/!560x560r/gravity/Center/crop/560x560/quality/85/%7CimageView2/2/w/560&e=2051020800&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:tKHv2hyZiHb9cNzls_9E0X3MzOA='
  const img = new Image()
  img.src = imgUrl
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    // 创建图案：repeat-重复、repeat-x-水平重复、repeat-y-垂直重复、no-repeat-不重复
    const pattern = ctx.createPattern(img, 'repeat')
    ctx.fillStyle = pattern
    // 用图案填充整个画布
    ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  }
}

// 半透明绘制（调整全局透明度）
const drawAlphaImage = () => {
  clearCanvas()
  const imgUrl =
    'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
  const img = new Image()
  img.src = imgUrl
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    ctx.globalAlpha = 0.5 // 透明度0-1，0完全透明，1不透明
    ctx.drawImage(img, 0, 0)
    ctx.globalAlpha = 1 // 绘制完恢复默认透明度，避免影响后续绘制
  }
}

// 保存画布为图片（生成base64，模拟下载）
const saveCanvasImage = () => {
  if (!ctx) return
  // 转成base64格式图片（png格式，质量0.9）
  const dataUrl = canvasRef.value.toDataURL('image/png', 0.9)
  // 创建a标签模拟下载
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = 'canvas-image.png' // 下载文件名
  a.click()
}

// 清空画布
const clearCanvas = () => {
  if (!ctx) return
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
}
</script>

<style scoped>
.canvas-image-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.canvas-box {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin: 20px 0;
  background: #f9fafb;
}

canvas {
  display: block;
  width: 100%;
  height: auto;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}
</style>
