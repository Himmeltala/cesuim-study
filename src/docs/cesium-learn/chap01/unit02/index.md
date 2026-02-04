# Viewer 配置详解

Cesium Viewer 是整个 3D 地球应用的核心组件。

## Viewer 架构

Viewer 由以下核心组件构成：

![](./viewer%20架构.png)

## 性能优化配置

```javascript
const viewer = new Cesium.Viewer('cesiumContainer', {
  // 渲染优化
  requestRenderMode: true, // 请求渲染模式
  maximumRenderTimeChange: Infinity, // 最大渲染时间变化
  // 内存优化
  contextOptions: {
    webgl: {
      alpha: true,
      preserveDrawingBuffer: true,
    },
  },
})

// 手动控制渲染
viewer.scene.requestRender()
```

## 响应式配置

```javascript
// 监听窗口大小变化
window.addEventListener('resize', () => {
  viewer.resize()
  viewer.scene.requestRender()
})

// 禁用响应式（提升性能）
viewer.scene.useDefaultRenderLoop = false
```

## 自定义底图

```javascript
const viewer = new Cesium.Viewer('cesiumContainer', {
  // 自定义底图
  imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
  }),
})
```

> 生产环境建议禁用不需要的控件以提升性能。
