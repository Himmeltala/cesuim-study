<!--
 * @Author: Himmeltala zhengrenfu@outlook.com
 * @Date: 2026-02-04 18:55:48
 * @LastEditors: Himmeltala zhengrenfu@outlook.com
 * @LastEditTime: 2026-02-07 23:03:49
 * @FilePath: \cesium-study\src\views\canvas-learn\chap01\index.vue
 * @Description: 画布学习-第一节
-->
<script setup lang="js">
import { nextTick, onMounted } from 'vue'

import CanvasLearnLayout from '@/layouts/canvas-learn/CanvasLearnLayout.vue'

onMounted(() => {
  nextTick(() => {
    const canvas = document.getElementById('tutorial')
    const ctx = canvas.getContext('2d')
    draw(ctx)
  })
})

function draw(ctx) {
  ctx.fillStyle = 'rgb(200,0,0)'
  ctx.fillRect(10, 10, 55, 50)

  ctx.fillStyle = 'rgba(0, 0, 200, 0.5)'
  ctx.fillRect(30, 30, 55, 50)
}
</script>

<template>
  <CanvasLearnLayout>
    <canvas id="tutorial" width="150" height="150"></canvas>
  </CanvasLearnLayout>
</template>
