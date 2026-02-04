<template>
  <div class="canvas-transform-demo">
    <div class="canvas-box">
      <canvas ref="canvasRef" width="800" height="500"></canvas>
    </div>
    <div class="btn-group">
      <el-button @click="drawTranslate">平移画布</el-button>
      <el-button @click="drawRotate">基础旋转</el-button>
      <el-button @click="drawRotateCenter">中心旋转</el-button>
      <el-button @click="drawScale">缩放画布</el-button>
      <el-button @click="drawScaleFlip">水平翻转</el-button>
      <el-button @click="drawTransform">矩阵变换</el-button>
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

// 平移画布原点
const drawTranslate = () => {
  clearCanvas()
  ctx.save()
  ctx.translate(200, 200)
  ctx.fillStyle = '#409eff'
  ctx.fillRect(0, 0, 100, 100)
  ctx.restore()
}

// 绕原点旋转
const drawRotate = () => {
  clearCanvas()
  ctx.save()
  ctx.rotate((45 * Math.PI) / 180)
  ctx.fillStyle = '#67c23a'
  ctx.fillRect(50, 50, 100, 100)
  ctx.restore()
}

// 绕图形中心旋转
const drawRotateCenter = () => {
  clearCanvas()
  const x = 300
  const y = 200
  const w = 100
  const h = 100

  ctx.save()
  ctx.translate(x + w / 2, y + h / 2)
  ctx.rotate((30 * Math.PI) / 180)
  ctx.translate(-x - w / 2, -y - h / 2)
  ctx.fillStyle = '#e6a23c'
  ctx.fillRect(x, y, w, h)
  ctx.restore()
}

// 缩放画布
const drawScale = () => {
  clearCanvas()
  ctx.save()
  ctx.scale(2, 1.5)
  ctx.fillStyle = '#f56c6c'
  ctx.fillRect(50, 50, 50, 50)
  ctx.restore()
}

// 水平翻转
const drawScaleFlip = () => {
  clearCanvas()
  ctx.save()
  ctx.translate(canvasRef.value.width, 0)
  ctx.scale(-1, 1)
  ctx.fillStyle = '#9c6cef'
  ctx.fillRect(50, 50, 100, 100)
  ctx.restore()
}

// 矩阵变换
const drawTransform = () => {
  clearCanvas()
  ctx.save()
  ctx.setTransform(1.2, 0.1, 0.1, 1.2, 200, 100)
  ctx.fillStyle = '#42b983'
  ctx.fillRect(0, 0, 80, 80)
  ctx.restore()
}

// 清空画布
const clearCanvas = () => {
  if (!ctx) return
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
}
</script>

<style scoped>
.canvas-transform-demo {
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
