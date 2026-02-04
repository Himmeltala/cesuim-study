<template>
  <div class="page-view">
    <div ref="cesiumContainer" class="cesium-container"></div>

    <el-card class="control-panel">
      <template #header>
        <div class="control-header">
          <el-icon><Plane /></el-icon>
          <span>控制面板</span>
        </div>
      </template>

      <!-- 视角跟随控制区域 -->
      <el-collapse v-model="activeCollapse">
        <el-collapse-item title="视角跟随控制" name="camera">
          <div class="control-section">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="param-item">
                  <label>开启视角跟随</label>
                  <el-switch
                    v-model="isFollowing"
                    active-text="开启"
                    inactive-text="关闭"
                  />
                </div>
              </el-col>
              <el-col :span="12">
                <div class="param-item">
                  <label>跟随距离</label>
                  <el-slider
                    v-model="cameraRange"
                    :min="50"
                    :max="1000"
                    :step="10"
                    show-input
                  />
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <div class="param-item vertical">
                  <label>视角航向角 (Heading)</label>
                  <el-slider
                    v-model="cameraHeading"
                    :min="0"
                    :max="360"
                    :step="5"
                    vertical
                    height="150px"
                  />
                  <el-input-number
                    v-model="cameraHeading"
                    :min="0"
                    :max="360"
                    :step="5"
                    size="small"
                  />
                  <span class="unit">°</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="param-item vertical">
                  <label>视角俯仰角 (Pitch)</label>
                  <el-slider
                    v-model="cameraPitch"
                    :min="-90"
                    :max="90"
                    :step="1"
                    vertical
                    height="150px"
                  />
                  <el-input-number
                    v-model="cameraPitch"
                    :min="-90"
                    :max="90"
                    :step="1"
                    size="small"
                  />
                  <span class="unit">°</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="param-item vertical">
                  <label>视角旋转角 (Roll)</label>
                  <el-slider
                    v-model="cameraRoll"
                    :min="-180"
                    :max="180"
                    :step="5"
                    vertical
                    height="150px"
                  />
                  <el-input-number
                    v-model="cameraRoll"
                    :min="-180"
                    :max="180"
                    :step="5"
                    size="small"
                  />
                  <span class="unit">°</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>

        <el-collapse-item title="模型旋转控制" name="model">
          <div class="control-section">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="param-item vertical">
                  <label>模型航向角 (Heading)</label>
                  <el-slider
                    v-model="modelHeading"
                    :min="0"
                    :max="360"
                    :step="1"
                    vertical
                    height="150px"
                  />
                  <el-input-number
                    v-model="modelHeading"
                    :min="0"
                    :max="360"
                    :step="1"
                    size="small"
                  />
                  <span class="unit">°</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="param-item vertical">
                  <label>模型俯仰角 (Pitch)</label>
                  <el-slider
                    v-model="modelPitch"
                    :min="-90"
                    :max="90"
                    :step="1"
                    vertical
                    height="150px"
                  />
                  <el-input-number
                    v-model="modelPitch"
                    :min="-90"
                    :max="90"
                    :step="1"
                    size="small"
                  />
                  <span class="unit">°</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="param-item vertical">
                  <label>模型旋转角 (Roll)</label>
                  <el-slider
                    v-model="modelRoll"
                    :min="-180"
                    :max="180"
                    :step="1"
                    vertical
                    height="150px"
                  />
                  <el-input-number
                    v-model="modelRoll"
                    :min="-180"
                    :max="180"
                    :step="1"
                    size="small"
                  />
                  <span class="unit">°</span>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="20" style="margin-top: 20px">
              <el-col :span="12">
                <el-button type="primary" @click="resetModelOrientation">
                  <el-icon><Refresh /></el-icon>
                  重置模型角度
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="warning" @click="toggleAutoRotate">
                  <el-icon><VideoPlay /></el-icon>
                  {{ isAutoRotating ? '停止自动旋转' : '开启自动旋转' }}
                </el-button>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>

        <el-collapse-item title="飞行速度控制" name="speed">
          <div class="control-section">
            <el-row :gutter="20">
              <el-col :span="16">
                <div class="param-item">
                  <label>速度倍率</label>
                  <el-slider
                    v-model="speedMultiplier"
                    :min="0.1"
                    :max="5"
                    :step="0.1"
                    :marks="speedMarks"
                    show-input
                  />
                </div>
              </el-col>
              <el-col :span="8">
                <el-tag type="primary" size="large" effect="dark">
                  当前速度: {{ speedMultiplier }}x
                </el-tag>
              </el-col>
            </el-row>

            <el-row :gutter="20" style="margin-top: 15px">
              <el-col :span="6">
                <el-button @click="setSpeed(0.5)">0.5x 慢速</el-button>
              </el-col>
              <el-col :span="6">
                <el-button type="primary" @click="setSpeed(1)"
                  >1x 正常</el-button
                >
              </el-col>
              <el-col :span="6">
                <el-button type="warning" @click="setSpeed(2)"
                  >2x 快速</el-button
                >
              </el-col>
              <el-col :span="6">
                <el-button type="danger" @click="setSpeed(5)"
                  >5x 极速</el-button
                >
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>

        <!-- 模型缩放控制区域 -->
        <el-collapse-item title="模型缩放控制" name="scale">
          <div class="control-section">
            <el-row :gutter="20">
              <el-col :span="16">
                <div class="param-item">
                  <label>模型缩放比例</label>
                  <el-slider
                    v-model="modelScale"
                    :min="0.1"
                    :max="5"
                    :step="0.1"
                    :marks="scaleMarks"
                    show-input
                  />
                </div>
              </el-col>
              <el-col :span="8">
                <el-tag type="success" size="large" effect="dark">
                  缩放比例: {{ modelScale }}x
                </el-tag>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>

      <!-- 状态信息 -->
      <div class="status-info">
        <el-divider content-position="center">实时状态</el-divider>
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="当前坐标">
            <el-tag type="info">{{ currentPosition }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="飞行高度">
            <el-tag type="success">{{ currentAltitude }}m</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

import * as Cesium from 'cesium'

import airportModel from '@/assets/models/airport.glb'

const cesiumContainer = ref(null)
let viewer = null
let movingModel = null
let pathPoints = []
let currentIndex = 0
let segmentProgress = 0
let autoRotateInterval = null

// 控制面板折叠状态
const activeCollapse = ref(['camera', 'model', 'speed'])

// 视角跟随控制参数
const isFollowing = ref(true)
const cameraRange = ref(250)
const cameraHeading = ref(0)
const cameraPitch = ref(-30)
const cameraRoll = ref(0)

// 模型旋转控制参数
const modelHeading = ref(135)
const modelPitch = ref(15)
const modelRoll = ref(0)
const modelScale = ref(1)
const isAutoRotating = ref(false)

// 飞行速度控制参数
const speedMultiplier = ref(1)
const baseSpeed = 3

// 速度滑块标记
const speedMarks = {
  0.5: '0.5x',
  1: '1x',
  2: '2x',
  3: '3x',
  4: '4x',
  5: '5x',
}

// 缩放滑块标记
const scaleMarks = {
  0.5: '0.5x',
  1: '1x',
  2: '2x',
  3: '3x',
  4: '4x',
  5: '5x',
}

// 实时状态数据
const currentPosition = ref('--')
const currentAltitude = ref(0)
const pathProgress = ref(0)

// 路径相关变量
let totalPathLength = 0
let segmentLengths = []
let traveledLength = 0

// 计算实时位置信息
const updateCurrentPosition = position => {
  const cartographic = Cesium.Cartographic.fromCartesian(position)
  const longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6)
  const latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6)
  const altitude = cartographic.height.toFixed(0)

  currentPosition.value = `${longitude}, ${latitude}`
  currentAltitude.value = altitude
}

onMounted(() => {
  // 初始化Cesium Viewer
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    animation: false,
    timeline: false,
    infoBox: false,
    selectionIndicator: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    scene3DOnly: true,
    shadows: false,
    terrainShadows: Cesium.ShadowMode.DISABLED,
  })

  // 优化渲染性能
  viewer.scene.globe.depthTestAgainstTerrain = false
  viewer.scene.fog.enabled = false
  viewer.scene.hdr = false

  // 定义模型运动路径
  pathPoints = [
    Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061, 500),
    Cesium.Cartesian3.fromDegrees(113.9336839, 22.538061, 600),
    Cesium.Cartesian3.fromDegrees(113.9436839, 22.548061, 700),
    Cesium.Cartesian3.fromDegrees(113.9536839, 22.558061, 650),
    Cesium.Cartesian3.fromDegrees(113.9636839, 22.568061, 600),
  ]

  // 预计算各线段长度
  segmentLengths = []
  totalPathLength = 0
  for (let i = 0; i < pathPoints.length - 1; i++) {
    const length = Cesium.Cartesian3.distance(pathPoints[i], pathPoints[i + 1])
    segmentLengths.push(length)
    totalPathLength += length
  }

  // 创建运动模型
  movingModel = viewer.entities.add({
    name: '运动飞机模型',
    position: pathPoints[0],
    model: {
      uri: airportModel,
      scale: modelScale.value,
      minimumPixelSize: 64,
    },
  })

  // 创建路径线（可视化）
  viewer.entities.add({
    name: '飞行路径',
    polyline: {
      positions: pathPoints,
      width: 2,
      material: Cesium.Color.CYAN.withAlpha(0.8),
    },
  })

  // 实时更新模型位置和姿态 + 视角跟随
  viewer.clock.onTick.addEventListener(() => {
    // 路径循环逻辑
    if (currentIndex >= pathPoints.length - 1) {
      currentIndex = 0
      segmentProgress = 0
      traveledLength = 0
    }

    const startPoint = pathPoints[currentIndex]
    const endPoint = pathPoints[currentIndex + 1]
    const segmentLength = segmentLengths[currentIndex]

    // 速度更新进度
    const currentSpeed = baseSpeed * speedMultiplier.value
    segmentProgress = Math.min(
      1,
      segmentProgress + currentSpeed / segmentLength,
    )

    // 线性插值计算当前位置
    const currentPosition = Cesium.Cartesian3.lerp(
      startPoint,
      endPoint,
      segmentProgress,
      new Cesium.Cartesian3(),
    )

    // 计算航向角和俯仰角
    const startCartographic = Cesium.Cartographic.fromCartesian(startPoint)
    const endCartographic = Cesium.Cartographic.fromCartesian(endPoint)
    const heading =
      Cesium.Math.PI -
      Cesium.Cartesian3.angleBetween(
        Cesium.Cartesian3.normalize(startPoint, new Cesium.Cartesian3()),
        Cesium.Cartesian3.normalize(endPoint, new Cesium.Cartesian3()),
      )
    const heightDiff = endCartographic.height - startCartographic.height
    const pitch = -Math.atan2(heightDiff, segmentLength)

    // 应用模型位置和姿态
    const totalHeading = heading + Cesium.Math.toRadians(modelHeading.value)
    const totalPitch = pitch + Cesium.Math.toRadians(modelPitch.value)
    const totalRoll = Cesium.Math.toRadians(modelRoll.value)

    movingModel.position = currentPosition
    movingModel.orientation = Cesium.Transforms.headingPitchRollQuaternion(
      currentPosition,
      new Cesium.HeadingPitchRoll(totalHeading, totalPitch, totalRoll),
      Cesium.Ellipsoid.WGS84,
    )

    // 更新模型缩放
    movingModel.model.scale = modelScale.value

    // 视角跟随逻辑
    if (isFollowing.value) {
      viewer.camera.lookAt(
        currentPosition,
        new Cesium.HeadingPitchRange(
          Cesium.Math.toRadians(cameraHeading.value),
          Cesium.Math.toRadians(cameraPitch.value),
          cameraRange.value,
        ),
      )
      // 应用Roll旋转
      if (cameraRoll.value !== 0) {
        const transform = Cesium.Matrix4.fromRotation(
          Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(cameraRoll.value)),
        )
        viewer.camera.lookAtTransform(transform)
      } else {
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
      }
    }

    // 更新当前位置信息
    updateCurrentPosition(currentPosition)

    // 更新路径进度
    traveledLength = 0
    for (let i = 0; i < currentIndex; i++) {
      traveledLength += segmentLengths[i]
    }
    traveledLength += segmentProgress * segmentLengths[currentIndex]

    // 切换下一段路径
    if (segmentProgress >= 1) {
      currentIndex++
      segmentProgress = 0
    }
  })

  // 初始视角定位
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061, 3000),
    duration: 1,
  })
})

// 重置模型角度
const resetModelOrientation = () => {
  modelHeading.value = 0
  modelPitch.value = 0
  modelRoll.value = 0
}

// 切换自动旋转
const toggleAutoRotate = () => {
  isAutoRotating.value = !isAutoRotating.value

  if (isAutoRotating.value) {
    autoRotateInterval = setInterval(() => {
      modelRoll.value = (modelRoll.value + 2) % 360
    }, 50)
  } else {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval)
      autoRotateInterval = null
    }
  }
}

// 设置速度
const setSpeed = speed => {
  speedMultiplier.value = speed
}

// 清理资源
onUnmounted(() => {
  if (viewer) {
    viewer.clock.onTick.removeAllListeners()
    viewer.entities.removeAll()
    viewer.destroy()
    viewer = null
    movingModel = null
  }

  if (autoRotateInterval) {
    clearInterval(autoRotateInterval)
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

.control-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 480px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  z-index: 1000;
}

.control-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 16px;
}

.control-section {
  padding: 10px 0;
}

.param-item {
  margin-bottom: 15px;
}

.param-item.vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.param-item label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 13px;
  color: #606266;
}

.param-item .unit {
  font-size: 12px;
  color: #909399;
}

.status-info {
  margin-top: 15px;
}
</style>
