# Cesium 初始化

学习 Cesium 初始化，如何创建一个 Cesium Viewer 实例。

## 初始化步骤

### 1. 创建容器

首先在 Vue 组件中创建一个 `div` 元素作为 Cesium 的容器：

```html
<template>
  <div id="cesiumContainer" class="cesium-container"></div>
</template>
```

### 2. 引入 Cesium

```javascript
import * as Cesium from "cesium";
```

### 3. 初始化 Viewer

```javascript
const viewer = new Cesium.Viewer("cesiumContainer", {
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
```

### 4. flyTo

将相机从当前位置移动到新位置。

API 文档：[Camera.flyTo](https://cesium.xin/cesium/cn/Documentation1.62/Camera.html?classFilter=camera#flyTo)

Cesium.Cartesian3.fromDegrees(104.0, 35.0, 5000000) 意思是将相机移动到中国位置，高度为 5000000 米。

fromDegrees 方法用于将经纬度转换为笛卡尔坐标。因为 Cesium 中的坐标系统是笛卡尔坐标，所以需要将经纬度转换为笛卡尔坐标才能使用。

### 5. flyHome

将相机飞到主视图。使用 Camera＃.DEFAULT_VIEW_RECTANGLE 进行设置3D场景的默认视图。

API 文档：[Camera.flyTo](https://cesium.xin/cesium/cn/Documentation1.62/Camera.html?classFilter=camera#flyHome)

## 完整示例

```vue
<template>
  <div class="hello-cesium">
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
.hello-cesium {
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
```
