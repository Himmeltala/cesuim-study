<template>
  <div class="canvas-compositing-demo">
    <div class="canvas-box">
      <canvas ref="canvasRef" width="800" height="500"></canvas>
    </div>
    <div class="btn-group">
      <el-button @click="drawDefault">默认叠加（覆盖）</el-button>
      <el-button @click="drawClear">清除旧图</el-button>
      <el-button @click="drawSourceIn">只显示交集</el-button>
      <el-button @click="drawDestOut">旧图减新图</el-button>
      <el-button @click="drawClip">圆形遮罩</el-button>
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

const drawDefault = () => {
  clearCanvas()
  ctx.fillStyle = 'pink'
  ctx.fillRect(50, 50, 150, 150)
  ctx.beginPath()
  ctx.fillStyle = 'orange'
  ctx.arc(150, 150, 80, 0, Math.PI * 2)
  ctx.fill()
}

const drawClear = () => {
  clearCanvas()
  ctx.fillStyle = 'red'
  ctx.fillRect(50, 50, 150, 150)
  ctx.globalCompositeOperation = 'clear'
  ctx.beginPath()
  ctx.fillStyle = 'yellow'
  ctx.arc(150, 150, 80, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalCompositeOperation = 'source-over'
}

const drawSourceIn = () => {
  clearCanvas()
  ctx.fillStyle = 'blue'
  ctx.fillRect(50, 50, 150, 150)
  ctx.globalCompositeOperation = 'source-in'
  ctx.beginPath()
  ctx.fillStyle = 'green'
  ctx.arc(150, 150, 80, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalCompositeOperation = 'source-over'
}

const drawDestOut = () => {
  clearCanvas()
  ctx.fillStyle = 'purple'
  ctx.fillRect(50, 50, 150, 150)
  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  ctx.fillStyle = 'black'
  ctx.arc(150, 150, 80, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalCompositeOperation = 'source-over'
}

const drawClip = () => {
  clearCanvas()
  ctx.save()
  ctx.beginPath()
  ctx.arc(400, 250, 150, 0, Math.PI * 2)
  ctx.clip()
  ctx.fillStyle = '#f5f5f5'
  ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * 800
    const y = Math.random() * 500
    const size = Math.random() * 30 + 10
    ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
    ctx.fillRect(x, y, size, size)
  }
  ctx.restore()
}

// 清空画布
const clearCanvas = () => {
  if (!ctx) return
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
}
</script>

<style scoped>
.canvas-compositing-demo {
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
