<!--
 * @Author: Himmeltala zhengrenfu@outlook.com
 * @Date: 2026-02-04 18:55:48
 * @LastEditors: Himmeltala zhengrenfu@outlook.com
 * @LastEditTime: 2026-02-07 23:04:18
 * @FilePath: \cesium-study\src\views\canvas-learn\chap03\index.vue
 * @Description: 画布学习-第三节
-->
<script setup lang="js">
import { onMounted, ref } from 'vue'

import CanvasLearnLayout from '@/layouts/canvas-learn/CanvasLearnLayout.vue'

const textWidth = ref(0)

function getContext(canvasId) {
  const canvas = document.getElementById(canvasId)
  return canvas.getContext('2d')
}

onMounted(() => {
  draw(getContext('tutorial'))
  draw2(getContext('tutorial2'))
  draw3(getContext('tutorial3'))

  textWidth.value = measureText(getContext('tutorial3'), '你好世界')
})

function draw(ctx) {
  ctx.font = '48px serif'
  ctx.fillText('你好世界', 10, 50)
}

function draw2(ctx) {
  ctx.font = '48px serif'
  ctx.strokeText('你好世界', 10, 50)
}

function draw3(ctx) {
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

function measureText(ctx, text) {
  const metrics = ctx.measureText(text)
  return metrics.width
}
</script>

<template>
  <CanvasLearnLayout>
    <canvas id="tutorial" width="300" height="300"></canvas>
    <canvas id="tutorial2" width="300" height="300"></canvas>
    <canvas id="tutorial3" width="500" height="300"></canvas>
    <div class="text-black">“你好世界”的文本宽度：{{ textWidth }}px</div>
    <template #buttons></template>
  </CanvasLearnLayout>
</template>
