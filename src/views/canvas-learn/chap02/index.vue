<!--
 * @Author: Himmeltala zhengrenfu@outlook.com
 * @Date: 2026-02-04 18:55:48
 * @LastEditors: Himmeltala zhengrenfu@outlook.com
 * @LastEditTime: 2026-02-07 23:04:05
 * @FilePath: \cesium-study\src\views\canvas-learn\chap02\index.vue
 * @Description: 画布学习-第二节
-->
<script setup lang="js">
import { onMounted } from 'vue'

import CanvasLearnLayout from '@/layouts/canvas-learn/CanvasLearnLayout.vue'

onMounted(() => {
  const canvas = document.getElementById('tutorial')
  const ctx = canvas.getContext('2d')
  const canvas2 = document.getElementById('tutorial2')
  const ctx2 = canvas2.getContext('2d')
  draw(ctx)
  draw2(ctx2)
})

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

function draw2(ctx) {
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
</script>

<template>
  <CanvasLearnLayout>
    <canvas id="tutorial" width="150" height="150"></canvas>
    <canvas id="tutorial2" width="150" height="150"></canvas>
  </CanvasLearnLayout>
</template>
