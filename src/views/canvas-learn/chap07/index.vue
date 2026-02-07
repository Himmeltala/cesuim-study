<!--
 * @Author: Himmeltala zhengrenfu@outlook.com
 * @Date: 2026-02-04 18:55:48
 * @LastEditors: Himmeltala zhengrenfu@outlook.com
 * @LastEditTime: 2026-02-07 23:06:42
 * @FilePath: \cesium-study\src\views\canvas-learn\chap07\index.vue
 * @Description: 
-->
<template>
  <CanvasLearnLayout>
    <canvas ref="canvasRef" width="800" height="500"></canvas>
    <template #buttons>
      <el-button @click="startMoveAnimation">位移动画</el-button>
      <el-button @click="startRotateAnimation"> 旋转动画 </el-button>
      <el-button @click="startScaleAnimation"> 缩放动画 </el-button>
      <el-button @click="startMultiAnimation">多元素动画</el-button>
      <el-button @click="stopAnimation">停止动画</el-button>
      <el-button @click="clearCanvas">清空画布</el-button>
    </template>
  </CanvasLearnLayout>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

import { ElButton } from 'element-plus'

import CanvasLearnLayout from '@/layouts/canvas-learn/CanvasLearnLayout.vue'

const canvasRef = ref(null)
let ctx = null
let animationId = null

let x = 0 // 位移动画x坐标
let speed = 3 // 位移速度
let angle = 0 // 旋转角度
let scale = 1 // 缩放比例
let scaleSpeed = 0.01 // 缩放速度
let balls = [] // 多元素动画小球数组

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
  }
})

onUnmounted(() => {
  stopAnimation()
})

// 清空画布
const clearCanvas = () => {
  if (!ctx) return
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
}

// 停止所有动画
const stopAnimation = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

const startMoveAnimation = () => {
  stopAnimation() // 先停止上一个动画
  x = 0 // 重置位置
  drawMoveAnimation()
}

const drawMoveAnimation = () => {
  clearCanvas()
  // 更新位置
  x += speed
  if (x < 0 || x > canvasRef.value.width - 100) {
    speed = -speed
  }
  // 绘制矩形
  ctx.fillStyle = '#409eff'
  ctx.fillRect(x, 200, 100, 100)
  // 循环执行
  animationId = requestAnimationFrame(drawMoveAnimation)
}

const startRotateAnimation = () => {
  stopAnimation()
  angle = 0 // 重置角度
  drawRotateAnimation()
}
const drawRotateAnimation = () => {
  clearCanvas()
  angle += 0.02 // 更新角度

  ctx.save()
  // 绕中心旋转套路
  ctx.translate(400, 250)
  ctx.rotate(angle)
  ctx.translate(-400, -250)
  // 绘制正方形
  ctx.fillStyle = '#67c23a'
  ctx.fillRect(350, 200, 100, 100)
  ctx.restore()

  animationId = requestAnimationFrame(drawRotateAnimation)
}

const startScaleAnimation = () => {
  stopAnimation()
  scale = 1 // 重置缩放
  scaleSpeed = 0.01
  drawScaleAnimation()
}

const drawScaleAnimation = () => {
  clearCanvas()
  // 更新缩放比例
  scale += scaleSpeed
  if (scale < 1 || scale > 1.5) {
    scaleSpeed = -scaleSpeed
  }

  ctx.save()
  // 中心缩放套路
  ctx.translate(400, 250)
  ctx.scale(scale, scale)
  ctx.translate(-400, -250)
  // 绘制圆形
  ctx.beginPath()
  ctx.fillStyle = '#e6a23c'
  ctx.arc(400, 250, 80, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  animationId = requestAnimationFrame(drawScaleAnimation)
}

const startMultiAnimation = () => {
  stopAnimation()
  initBalls() // 初始化小球
  drawMultiAnimation()
}

// 初始化小球
const initBalls = () => {
  balls = []
  for (let i = 0; i < 10; i++) {
    balls.push({
      x: Math.random() * 800,
      y: Math.random() * 500,
      speedX: Math.random() * 3 - 1.5,
      speedY: Math.random() * 3 - 1.5,
      radius: Math.random() * 10 + 5,
      color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
    })
  }
}

const drawMultiAnimation = () => {
  clearCanvas()
  // 循环更新并绘制小球
  balls.forEach(ball => {
    ball.x += ball.speedX
    ball.y += ball.speedY
    // 边界反弹
    if (ball.x < ball.radius || ball.x > canvasRef.value.width - ball.radius)
      ball.speedX = -ball.speedX
    if (ball.y < ball.radius || ball.y > canvasRef.value.height - ball.radius)
      ball.speedY = -ball.speedY
    // 绘制
    ctx.beginPath()
    ctx.fillStyle = ball.color
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
    ctx.fill()
  })
  animationId = requestAnimationFrame(drawMultiAnimation)
}
</script>
