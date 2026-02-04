<template>
  <div class="page-view">
    <div ref="cesiumContainer" class="cesium-container"></div>

    <!-- 控制面板 -->
    <div class="control-panel">
      <el-card class="control-card">
        <template #header>
          <div class="card-header">
            <span>线实体演示</span>
          </div>
        </template>

        <div class="control-content">
          <div class="preset-buttons">
            <el-button
              v-for="route in presetRoutes"
              :key="route.name"
              type="primary"
              size="small"
              @click="flyToRoute(route)"
            >
              {{ route.name }}
            </el-button>
          </div>

          <el-divider />

          <div class="control-item">
            <label>线宽</label>
            <el-slider
              v-model="polylineConfig.width"
              :min="1"
              :max="20"
              @change="updatePolylines"
            />
          </div>

          <div class="control-item">
            <label>贴地模式</label>
            <el-switch
              v-model="polylineConfig.clampToGround"
              @change="updatePolylines"
            />
          </div>

          <el-divider />

          <div style="width: 100%">
            <el-button
              style="width: 100%"
              type="success"
              size="small"
              @click="addRandomRoute"
            >
              <el-icon><Plus /></el-icon>
              添加随机路线
            </el-button>
          </div>
          <div style="width: 100%">
            <el-button
              style="width: 100%"
              type="danger"
              size="small"
              @click="clearAll"
            >
              <el-icon><Delete /></el-icon>
              清除所有
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图例 -->
    <div class="legend-panel">
      <el-card class="legend-card">
        <template #header>
          <span>路线图例</span>
        </template>
        <div class="legend-content">
          <div
            class="legend-item"
            v-for="route in presetRoutes"
            :key="route.name"
          >
            <span class="color-dot" :style="{ background: route.color }"></span>
            <span>{{ route.name }}</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import * as Cesium from "cesium";
import { Plus, Delete } from "@element-plus/icons-vue";

const cesiumContainer = ref(null);
let viewer = null;

// 线配置
const polylineConfig = reactive({
  width: 5,
  clampToGround: true,
});

// 预设路线
const presetRoutes = [
  {
    name: "京沪线",
    color: "#FF6B6B",
    coordinates: [
      [116.4, 39.9],
      [117.2, 39.1],
      [119.4, 35.4],
      [121.5, 31.2],
    ],
  },
  {
    name: "京广线",
    color: "#4ECDC4",
    coordinates: [
      [116.4, 39.9],
      [114.3, 38.0],
      [112.6, 37.9],
      [110.0, 35.4],
      [108.4, 33.9],
      [106.7, 32.4],
      [104.9, 30.6],
      [102.3, 29.5],
      [100.0, 27.8],
      [97.4, 25.0],
      [95.3, 22.6],
      [93.0, 20.0],
      [90.5, 17.5],
      [88.0, 15.0],
      [85.5, 12.5],
      [83.0, 10.0],
    ],
  },
  {
    name: "长江沿线",
    color: "#45B7D1",
    coordinates: [
      [106.6, 29.6], // 重庆
      [104.1, 30.6], // 成都（模拟起点）
      [106.6, 29.6], // 重庆
      [108.9, 28.3], // 怀化
      [111.3, 27.3], // 衡阳
      [112.9, 28.2], // 长沙
      [114.3, 30.6], // 武汉
      [118.8, 32.1], // 南京
      [121.5, 31.2], // 上海
    ],
  },
];

// 飞向路线
const flyToRoute = (route) => {
  const positions = route.coordinates.flatMap((coord) => coord);
  const cartesianPositions = Cesium.Cartesian3.fromDegreesArray(positions);

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      route.coordinates[Math.floor(route.coordinates.length / 2)][0],
      route.coordinates[Math.floor(route.coordinates.length / 2)][1] + 5,
      3000000,
    ),
    duration: 2,
  });
};

// 添加随机路线
const addRandomRoute = () => {
  const startLon = 100 + Math.random() * 20;
  const startLat = 25 + Math.random() * 15;
  const points = [];

  // 生成随机路径点
  for (let i = 0; i < 5; i++) {
    points.push([
      startLon + (Math.random() - 0.5) * 10,
      startLat + (Math.random() - 0.5) * 8,
    ]);
  }

  const positions = points.flatMap((coord) => coord);
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];

  viewer.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray(positions),
      width: polylineConfig.width,
      material: Cesium.Color.fromCssColorString(
        colors[Math.floor(Math.random() * colors.length)],
      ),
      clampToGround: polylineConfig.clampToGround,
    },
  });

  console.log("添加路线:", points);
};

// 更新所有线
const updatePolylines = () => {
  viewer.entities.values.forEach((entity) => {
    if (entity.polyline) {
      entity.polyline.width = polylineConfig.width;
      entity.polyline.clampToGround = polylineConfig.clampToGround;
    }
  });
};

// 清除所有
const clearAll = () => {
  viewer.entities.removeAll();

  // 重新添加预设路线
  addPresetRoutes();
};

// 添加预设路线
const addPresetRoutes = () => {
  presetRoutes.forEach((route) => {
    const positions = route.coordinates.flatMap((coord) => coord);

    viewer.entities.add({
      name: route.name,
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(positions),
        width: polylineConfig.width,
        material: Cesium.Color.fromCssColorString(route.color),
        clampToGround: polylineConfig.clampToGround,
      },
    });
  });
};

onMounted(() => {
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    animation: false,
    timeline: false,
    infoBox: false,
    selectionIndicator: false,
    baseLayerPicker: false,
    fullscreenButton: false,
  });

  // 飞向中国
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(105, 35, 4000000),
  });

  // 添加预设路线
  addPresetRoutes();
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
  z-index: 100;
  width: 280px;
}

.control-card {
  backdrop-filter: blur(8px);
}

.card-header {
  font-weight: 600;
}

.control-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    color: #606266;
  }
}

.legend-panel {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 100;
  width: 180px;
}

.legend-card {
  backdrop-filter: blur(8px);
}

.legend-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
</style>
