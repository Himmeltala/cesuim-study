<!--
 * @Author: Himmeltala zhengrenfu@outlook.com
 * @Date: 2026-02-07 22:54:48
 * @LastEditors: Himmeltala zhengrenfu@outlook.com
 * @LastEditTime: 2026-02-07 23:03:26
 * @FilePath: \cesium-study\src\layouts\canvas-learn\CanvasLearnLayout.vue
 * @Description: 画布学习布局
-->
<template>
  <div class="canvas-learn-container">
    <div class="canvas-box">
      <slot></slot>
    </div>
    <div class="btn-group">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.canvas-learn-container {
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.canvas-box {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin: 0 0 20px 0;
  background: #f9fafb;
  flex: 1;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
