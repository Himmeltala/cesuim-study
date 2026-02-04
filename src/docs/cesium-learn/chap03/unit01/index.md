# 坐标系统与坐标转换

## 笛卡尔坐标（Cartesian3）

Cesium中表示3D空间位置的坐标系统，以地球中心为原点。

```javascript
// 使用经纬度创建笛卡尔坐标
Cesium.Cartesian3.fromDegrees(longitude, latitude, height)

// 定义飞行路径点
pathPoints = [
  Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061, 500),
  Cesium.Cartesian3.fromDegrees(113.9336839, 22.538061, 600),
  Cesium.Cartesian3.fromDegrees(113.9436839, 22.548061, 700),
]
```

## 坐标转换

在笛卡尔坐标与经纬度坐标之间转换：

```javascript
// 笛卡尔坐标 与 Cartographic（经纬度弧度）转换
const cartographic = Cesium.Cartographic.fromCartesian(position)

// Cartographic 与 笛卡尔坐标转换
const cartesian = Cesium.Cartographic.toCartesian(cartographic)

// 弧度 与 角度转换
const radians = Cesium.Math.toRadians(degrees) // 角度转弧度
const degrees = Cesium.Math.toRadians(radians) // 弧度转角度
```

# 路径计算与运动插值

## 计算路径距离

```javascript
// 计算两点间的直线距离
const distance = Cesium.Cartesian3.distance(point1, point2)

// 向量归一化
const normalized = Cesium.Cartesian3.normalize(vector, new Cesium.Cartesian3())
```

## 线性插值计算位置

```javascript
// 在两点之间进行线性插值，获取任意比例的位置
const currentPosition = Cesium.Cartesian3.lerp(
  startPoint, // 起点
  endPoint, // 终点
  segmentProgress, // 插值比例（0-1）
  new Cesium.Cartesian3(), // 输出结果
)
```

## 速度控制

```javascript
// 基础速度（米/帧）
const baseSpeed = 3

// 根据倍率计算当前速度
const currentSpeed = baseSpeed * speedMultiplier.value

// 更新路径进度
segmentProgress = Math.min(1, segmentProgress + currentSpeed / segmentLength)
```

# 航向角与俯仰角计算

## 计算航向角（Heading）

航向角表示模型前进方向的方位角：

```javascript
// 使用向量夹角计算航向角
const heading =
  Cesium.Math.PI -
  Cesium.Cartesian3.angleBetween(
    Cesium.Cartesian3.normalize(startPoint, new Cesium.Cartesian3()),
    Cesium.Cartesian3.normalize(endPoint, new Cesium.Cartesian3()),
  )
```

## 计算俯仰角（Pitch）

俯仰角表示模型相对于水平面的倾斜角度：

```javascript
// 根据高度差和距离计算俯仰角
const heightDiff = endCartographic.height - startCartographic.height
const pitch = -Math.atan2(heightDiff, segmentLength)
```

## 旋转角（Roll）

旋转角表示模型绕自身轴线的旋转，用于翻滚等效果。

# 模型姿态控制

## HeadingPitchRoll

Cesium中用于表示3D旋转的标准方式：

```javascript
// 创建航向-俯仰-旋转对象
const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)

// heading: 航向角（0-360°），水平方向
// pitch:   俯仰角（-90°~90°），上下倾斜
// roll:    旋转角（-180°~180°），翻滚角度
```

## 四元数转换

将航向-俯仰-旋转转换为四元数，用于设置模型方向：

```javascript
// 将HPR转换为四元数，并应用到模型
movingModel.orientation = Cesium.Transforms.headingPitchRollQuaternion(
  currentPosition, // 位置点
  new Cesium.HeadingPitchRoll(heading, pitch, roll), // 旋转
  Cesium.Ellipsoid.WGS84, // 地球椭球体
)
```

## 叠加手动旋转

在自动计算的航向上叠加用户的旋转调整：

```javascript
// 叠加用户的航向、俯仰、旋转调整
const totalHeading = heading + Cesium.Math.toRadians(modelHeading.value)
const totalPitch = pitch + Cesium.Math.toRadians(modelPitch.value)
const totalRoll = Cesium.Math.toRadians(modelRoll.value)
```

# 视角跟随控制

## lookAt锁定目标

```javascript
// 相机锁定目标点
viewer.camera.lookAt(
  currentPosition, // 目标位置
  new Cesium.HeadingPitchRange(
    Cesium.Math.toRadians(cameraHeading.value), // 航向角
    Cesium.Math.toRadians(cameraPitch.value), // 俯仰角
    cameraRange.value, // 距离
  ),
)
```

## HeadingPitchRange

定义相机相对于目标点的位置和方向：

```javascript
// 创建视角范围对象
const hprRange = new Cesium.HeadingPitchRange(
  heading, // 航向角：相机在目标点的方位
  pitch, // 俯仰角：相机俯仰角度
  range, // 距离：相机到目标的直线距离
)
```

## 应用相机变换

```javascript
// 应用相机变换矩阵（支持Roll旋转）
if (cameraRoll.value !== 0) {
  const transform = Cesium.Matrix4.fromRotation(
    Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(cameraRoll.value)),
  )
  viewer.camera.lookAtTransform(transform)
} else {
  viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
}
```

## 矩阵操作

```javascript
// 从旋转矩阵创建4x4变换矩阵
const matrix4 = Cesium.Matrix4.fromRotation(rotationMatrix)

// 从Z轴旋转创建3x3旋转矩阵
const matrix3 = Cesium.Matrix3.fromRotationZ(angle)

// 单位矩阵（不应用变换）
Cesium.Matrix4.IDENTITY
```

# 动画循环与事件监听

## 帧监听器

```javascript
// 每帧执行（用于实时更新模型位置和视角）
viewer.clock.onTick.addEventListener(clock => {
  // 动画逻辑
})
```

## 路径循环逻辑

```javascript
// 检测路径段是否走完
if (segmentProgress >= 1) {
  currentIndex++ // 移动到下一段
  segmentProgress = 0 // 重置进度
}

// 检测是否走完整个路径
if (currentIndex >= pathPoints.length - 1) {
  currentIndex = 0 // 回到起点
  segmentProgress = 0
  traveledLength = 0
}
```

# 实体添加与管理

## 添加3D模型实体

```javascript
movingModel = viewer.entities.add({
  name: '运动飞机模型',
  position: pathPoints[0], // 初始位置
  model: {
    uri: airportModel, // 模型文件路径
    scale: modelScale.value, // 缩放比例
    minimumPixelSize: 64, // 最小像素大小
  },
})
```

## 添加路径线

```javascript
viewer.entities.add({
  name: '飞行路径',
  polyline: {
    positions: pathPoints, // 路径点数组
    width: 2, // 线宽
    material: Cesium.Color.CYAN.withAlpha(0.8), // 材质颜色
  },
})
```

## 实时更新属性

```javascript
// 更新模型位置
movingModel.position = currentPosition

// 更新模型方向
movingModel.orientation = quaternion

// 更新模型缩放
movingModel.model.scale = modelScale.value
```

# 相机飞行动画

## 初始视角定位

```javascript
// 相机飞向指定位置
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061, 3000),
  duration: 1, // 飞行时间（秒）
})
```
