<!--
 * @Author: Himmeltala zhengrenfu@outlook.com
 * @Date: 2026-02-04 18:55:48
 * @LastEditors: Himmeltala zhengrenfu@outlook.com
 * @LastEditTime: 2026-02-07 23:07:40
 * @FilePath: \cesium-study\src\views\canvas-learn\chap08\index.vue
 * @Description: 
-->
<template>
  <CanvasLearnLayout>
    <canvas ref="canvasRef" width="800" height="500"></canvas>
    <template #buttons>
      <el-button @click="drawOriginal">绘制原图</el-button>
      <el-button @click="applyGray">灰度滤镜</el-button>
      <el-button @click="applyInvert">反色滤镜</el-button>
      <el-button @click="applyBlur">简单模糊</el-button>
      <el-button @click="applyReplaceColor">红换蓝</el-button>
      <el-button @click="resetCanvas">重置画布</el-button>
      <el-button @click="clearCanvas">清空画布</el-button>
    </template>
  </CanvasLearnLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'

import { ElButton } from 'element-plus'

import CanvasLearnLayout from '@/layouts/canvas-learn/CanvasLearnLayout.vue'

const canvasRef = ref(null)
let ctx = null
let originalImg = null
const imgUrl =
  'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    loadOriginalImage()
  }
})

const loadOriginalImage = () => {
  originalImg = new Image()
  originalImg.src = imgUrl
  originalImg.crossOrigin = 'anonymous' // 跨域关键
  originalImg.onload = () => {
    console.log('图片加载成功')
  }
  originalImg.onerror = () => {
    console.error('图片加载失败，检查地址或跨域配置')
  }
}

// 绘制原图
const drawOriginal = () => {
  if (!originalImg || !ctx) return
  clearCanvas()
  ctx.drawImage(
    originalImg,
    0,
    0,
    canvasRef.value.width,
    canvasRef.value.height,
  )
}

// 灰度滤镜
const applyGray = () => {
  if (!ctx) return
  const imageData = ctx.getImageData(
    0,
    0,
    canvasRef.value.width,
    canvasRef.value.height,
  )
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] + data[i + 1] + data[i + 2]) / 3
    data[i] = data[i + 1] = data[i + 2] = gray
  }

  ctx.putImageData(imageData, 0, 0)
}

// 反色滤镜
const applyInvert = () => {
  if (!ctx) return
  const imageData = ctx.getImageData(
    0,
    0,
    canvasRef.value.width,
    canvasRef.value.height,
  )
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]
    data[i + 1] = 255 - data[i + 1]
    data[i + 2] = 255 - data[i + 2]
  }

  ctx.putImageData(imageData, 0, 0)
}

// 简单模糊滤镜
const applyBlur = () => {
  if (!ctx) return
  const imageData = ctx.getImageData(
    0,
    0,
    canvasRef.value.width,
    canvasRef.value.height,
  )
  const data = imageData.data
  const width = canvasRef.value.width
  const height = canvasRef.value.height
  const tempData = new Uint8ClampedArray(data) // 复制原始数据

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4
      let r = 0,
        g = 0,
        b = 0
      // 遍历 3x3 邻域
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const tempIdx = ((y + dy) * width + (x + dx)) * 4
          r += tempData[tempIdx]
          g += tempData[tempIdx + 1]
          b += tempData[tempIdx + 2]
        }
      }
      // 赋值平均值
      data[idx] = r / 9
      data[idx + 1] = g / 9
      data[idx + 2] = b / 9
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

// 颜色替换（红→蓝）
const applyReplaceColor = () => {
  if (!ctx) return
  const imageData = ctx.getImageData(
    0,
    0,
    canvasRef.value.width,
    canvasRef.value.height,
  )
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    // 匹配红色范围
    if (r > 150 && g < 100 && b < 100) {
      data[i] = 0
      data[i + 1] = 0
      data[i + 2] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

const resetCanvas = () => {
  drawOriginal()
}

const clearCanvas = () => {
  if (!ctx) return
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
}
</script>
