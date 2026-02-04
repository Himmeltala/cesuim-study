<template>
  <div class="page-view">
    <div ref="cesiumContainer" class="cesium-container"></div>

    <!-- 控制面板 -->
    <div class="control-panel">
      <el-card class="control-card">
        <template #header>
          <div class="card-header">
            <span>点实体演示</span>
            <el-button type="primary" link size="small" @click="addRandomPoint">
              <el-icon><Plus /></el-icon>
              添加随机点
            </el-button>
          </div>
        </template>

        <div class="control-content">
          <div class="control-item">
            <label>点大小</label>
            <el-slider
              v-model="pointConfig.pixelSize"
              :min="5"
              :max="50"
              @change="updatePoints"
            />
          </div>

          <div class="control-item">
            <label>边框宽度</label>
            <el-slider
              v-model="pointConfig.outlineWidth"
              :min="0"
              :max="10"
              @change="updatePoints"
            />
          </div>

          <div class="control-item">
            <label>颜色</label>
            <el-color-picker
              v-model="pointConfig.color"
              @change="updatePoints"
            />
          </div>

          <el-divider />

          <el-button type="danger" size="small" @click="clearAll">
            <el-icon><Delete /></el-icon>
            清除所有点
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 信息面板 -->
    <div class="info-panel" v-if="selectedPoint">
      <el-card class="info-card">
        <template #header>
          <span>选中点信息</span>
        </template>
        <div class="info-content">
          <p><strong>经度：</strong>{{ selectedPoint.lon.toFixed(4) }}</p>
          <p><strong>纬度：</strong>{{ selectedPoint.lat.toFixed(4) }}</p>
          <p><strong>高度：</strong>{{ selectedPoint.height.toFixed(0) }} 米</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'

import { Delete, Plus } from '@element-plus/icons-vue'
import * as Cesium from 'cesium'

const cesiumContainer = ref(null)
let viewer = null
const selectedPoint = ref(null)

// 点配置
const pointConfig = reactive({
  pixelSize: 15,
  outlineWidth: 2,
  color: '#409EFF',
})

// 添加随机点
const addRandomPoint = () => {
  const lon = 70 + Math.random() * 60 // 70-130
  const lat = 15 + Math.random() * 40 // 15-55
  const height = Math.random() * 5000 // 0-5000

  viewer.entities.add({
    id: `point-${Date.now()}`,
    position: Cesium.Cartesian3.fromDegrees(lon, lat, height),
    point: {
      pixelSize: pointConfig.pixelSize,
      color: Cesium.Color.fromCssColorString(pointConfig.color),
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: pointConfig.outlineWidth,
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
    },
  })

  // 添加标签
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(lon, lat, height + 1000),
    label: {
      text: `P${viewer.entities.values.length}`,
      font: '12px sans-serif',
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -10),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1e7),
    },
  })

  console.log('添加点:', { lon, lat, height })
}

// 更新所有点的样式
const updatePoints = () => {
  viewer.entities.values.forEach(entity => {
    if (entity.point) {
      entity.point.pixelSize = pointConfig.pixelSize
      entity.point.outlineWidth = pointConfig.outlineWidth
      entity.point.color = Cesium.Color.fromCssColorString(pointConfig.color)
    }
  })
}

// 清除所有点
const clearAll = () => {
  viewer.entities.removeAll()
  selectedPoint.value = null
}

let handler = null

onMounted(() => {
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    animation: false,
    timeline: false,
    infoBox: false,
    selectionIndicator: false,
    baseLayerPicker: false,
    fullscreenButton: false,
  })

  // 飞向中国
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(100, 35, 5000000),
  })

  // 添加一些初始点
  const initialPoints = [
    { lon: 116.4, lat: 39.9, name: '北京' },
    { lon: 121.5, lat: 31.2, name: '上海' },
    { lon: 113.3, lat: 23.1, name: '广州' },
    { lon: 104.1, lat: 30.6, name: '成都' },
    { lon: 120.2, lat: 30.3, name: '杭州' },
  ]

  initialPoints.forEach((point, index) => {
    viewer.entities.add({
      id: `point-${index}`,
      position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat, 0),
      point: {
        pixelSize: pointConfig.pixelSize,
        color: Cesium.Color.fromCssColorString(pointConfig.color),
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: pointConfig.outlineWidth,
      },
    })

    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat, 500),
      label: {
        text: point.name,
        font: '14px sans-serif',
        fillColor: Cesium.Color.fromCssColorString('#fff'),
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -10),
      },
    })
  })

  // 监听点击事件
  handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

  handler.setInputAction(movement => {
    const picked = viewer.scene.pick(movement.position)

    if (Cesium.defined(picked) && picked.id && picked.id.point) {
      const entity = picked.id
      const position = entity.position.getValue(Cesium.JulianDate.now())
      const cartesian = Cesium.Cartographic.fromCartesian(position)

      selectedPoint.value = {
        lon: Cesium.Math.toDegrees(cartesian.longitude),
        lat: Cesium.Math.toDegrees(cartesian.latitude),
        height: cartesian.height,
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
})

onUnmounted(() => {
  if (handler) {
    handler.destroy()
  }
  if (viewer) {
    viewer.destroy()
    viewer = null
  }
})
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.control-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.info-panel {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 100;
  width: 200px;
}

.info-card {
  backdrop-filter: blur(8px);
}

.info-content {
  font-size: 14px;

  p {
    margin: 4px 0;
    color: #606266;
  }
}
</style>
