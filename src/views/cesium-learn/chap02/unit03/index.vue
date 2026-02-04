<template>
  <div class="page-view">
    <div ref="cesiumContainer" class="cesium-container"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

import * as Cesium from 'cesium'

const cesiumContainer = ref(null)
let viewer = null

// 不同类型的颜色配置
const colorConfig = {
  行政区: new Cesium.Color(255 / 255, 99 / 255, 132 / 255, 0.7),
  地标: new Cesium.Color(54 / 255, 162 / 255, 235 / 255, 0.7),
  公园: new Cesium.Color(75 / 255, 192 / 255, 192 / 255, 0.7),
  商业区: new Cesium.Color(255 / 255, 206 / 255, 86 / 255, 0.7),
  交通枢纽: new Cesium.Color(153 / 255, 102 / 255, 255 / 255, 0.7),
}

// 成都市面状数据
const chengduData = [
  {
    name: '锦江区',
    type: '行政区',
    coordinates: [
      104.075, 30.658, 104.085, 30.658, 104.085, 30.668, 104.075, 30.668,
    ],
    height: 45,
  },
  {
    name: '青羊区',
    type: '行政区',
    coordinates: [
      104.045, 30.668, 104.065, 30.668, 104.065, 30.688, 104.045, 30.688,
    ],
    height: 40,
  },
  {
    name: '金牛区',
    type: '行政区',
    coordinates: [
      104.025, 30.688, 104.045, 30.688, 104.045, 30.708, 104.025, 30.708,
    ],
    height: 38,
  },
  {
    name: '武侯区',
    type: '行政区',
    coordinates: [
      104.045, 30.638, 104.065, 30.638, 104.065, 30.658, 104.045, 30.658,
    ],
    height: 42,
  },
  {
    name: '成华区',
    type: '行政区',
    coordinates: [
      104.085, 30.638, 104.105, 30.638, 104.105, 30.658, 104.085, 30.658,
    ],
    height: 35,
  },
  {
    name: '天府广场',
    type: '地标',
    coordinates: [
      104.065, 30.648, 104.075, 30.648, 104.075, 30.658, 104.065, 30.658,
    ],
    height: 1000,
  },
  {
    name: '人民公园',
    type: '公园',
    coordinates: [
      104.055, 30.648, 104.065, 30.648, 104.065, 30.658, 104.055, 30.658,
    ],
    height: 15,
  },
  {
    name: '春熙路商圈',
    type: '商业区',
    coordinates: [
      104.075, 30.648, 104.085, 30.648, 104.085, 30.658, 104.075, 30.658,
    ],
    height: 50,
  },
  {
    name: '成都东站',
    type: '交通枢纽',
    coordinates: [
      104.145, 30.618, 104.155, 30.618, 104.155, 30.628, 104.145, 30.628,
    ],
    height: 30,
  },
  {
    name: '成都南站',
    type: '交通枢纽',
    coordinates: [
      104.105, 30.608, 104.115, 30.608, 104.115, 30.618, 104.105, 30.618,
    ],
    height: 28,
  },
]

onMounted(() => {
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    animation: false,
    timeline: false,
    infoBox: false,
    selectionIndicator: false,
    baseLayerPicker: false,
    fullscreenButton: false,
  })

  // 设置初始视角到成都
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(104.065, 30.659, 12000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-45),
      roll: 0.0,
    },
  })

  // 创建面状要素并实现立体拉伸效果
  chengduData.forEach(data => {
    viewer.entities.add({
      name: data.name,
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray(data.coordinates),
        material: colorConfig[data.type] || Cesium.Color.GREEN.withAlpha(0.6),
        outline: true,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        extrudedHeight: data.height,
      },
    })
  })
})

onUnmounted(() => {
  if (viewer) {
    viewer.destroy()
    viewer = null
  }
})
</script>

<style scoped>
.page-view {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.cesium-container {
  width: 100%;
  height: 100%;
}
</style>
