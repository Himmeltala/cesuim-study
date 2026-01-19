<template>
  <div class="page-view">
    <div ref="cesiumContainer" class="cesium-container"></div>
    <div class="control-panel">
      <el-button type="primary" size="small" @click="flyToChina">
        <el-icon><Location /></el-icon>
        飞向中国
      </el-button>
      <el-button type="success" size="small" @click="flyToWorld">
        <el-icon><Aim /></el-icon>
        飞向全球
      </el-button>
      <el-button type="info" size="small" @click="resetView">
        <el-icon><Refresh /></el-icon>
        重置视图
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as Cesium from "cesium";
import { Location, Aim, Refresh } from "@element-plus/icons-vue";

const cesiumContainer = ref(null);
let viewer = null;

// 飞向中国
const flyToChina = () => {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(104.0, 35.0, 5000000),
    duration: 3,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
  });
};

// 飞向全球
const flyToWorld = () => {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(0, 0, 20000000),
    duration: 3,
  });
};

// 重置视图
const resetView = () => {
  viewer.camera.flyHome(3);
};

onMounted(() => {
  // 初始化 Cesium Viewer
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    // 配置选项
    animation: false, // 隐藏动画控件
    timeline: false, // 隐藏时间线
    infoBox: true, // 启用信息框
    selectionIndicator: true, // 启用选择指示器
    baseLayerPicker: true, // 底图选择器
    geocoder: true, // 地理编码器
    homeButton: true, // 归位按钮
    sceneModePicker: true, // 场景模式选择器
    navigationHelpButton: true, // 导航帮助
  });

  // 飞向初始位置
  flyToChina();
});

onUnmounted(() => {
  if (viewer) {
    viewer.destroy();
    viewer = null;
  }
});
</script>

<style scoped>
.page-view {
  width: 100%;
  height: 100%;
  position: relative;
}

.cesium-container {
  width: 100%;
  height: 100%;
}

.control-panel {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 8px;
  z-index: 100;
}
</style>
