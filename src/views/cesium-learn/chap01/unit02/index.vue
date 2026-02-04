<template>
  <div class="page-view">
    <div ref="cesiumContainer" class="cesium-container"></div>

    <!-- 配置控制面板 -->
    <div class="config-panel">
      <el-card class="config-card">
        <template #header>
          <div class="card-header">
            <span>Viewer 配置控制</span>
          </div>
        </template>

        <div class="config-content">
          <div class="config-item">
            <label>底图选择器</label>
            <el-switch
              v-model="config.baseLayerPicker"
              @change="updateConfig"
            />
          </div>
          <div class="config-item">
            <label>地理搜索</label>
            <el-switch v-model="config.geocoder" @change="updateConfig" />
          </div>
          <div class="config-item">
            <label>归位按钮</label>
            <el-switch v-model="config.homeButton" @change="updateConfig" />
          </div>
          <div class="config-item">
            <label>场景模式</label>
            <el-switch
              v-model="config.sceneModePicker"
              @change="updateConfig"
            />
          </div>
          <div class="config-item">
            <label>帮助按钮</label>
            <el-switch
              v-model="config.navigationHelpButton"
              @change="updateConfig"
            />
          </div>

          <el-divider />

          <el-button type="primary" size="small" @click="recreateViewer">
            重建 Viewer
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import * as Cesium from "cesium";

const cesiumContainer = ref(null);
let viewer = null;

// 配置状态
const config = reactive({
  baseLayerPicker: true,
  geocoder: true,
  homeButton: true,
  sceneModePicker: true,
  navigationHelpButton: true,
});

// 更新配置
const updateConfig = () => {
  if (!viewer) return;

  // 动态更新控件可见性
  viewer.baseLayerPicker = config.baseLayerPicker;
  viewer.geocoder = config.geocoder;
  viewer.homeButton = config.homeButton;
  viewer.sceneModePicker = config.sceneModePicker;
  viewer.navigationHelpButton = config.navigationHelpButton;
};

// 重建 Viewer
const recreateViewer = () => {
  if (viewer) {
    viewer.destroy();
    viewer = null;
  }

  viewer = new Cesium.Viewer(cesiumContainer.value, {
    animation: false,
    timeline: false,
    ...config,
  });
};

onMounted(() => {
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    animation: false,
    timeline: false,
    ...config,
  });

  // 飞向默认位置
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(116.4, 39.9, 500000),
  });
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

.config-panel {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 100;
  max-width: 300px;
}

.config-card {
  backdrop-filter: blur(8px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.config-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  label {
    font-size: 14px;
    color: #606266;
  }
}
</style>
