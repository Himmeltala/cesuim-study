# 点实体

学习如何在 Cesium 中添加和点实体。

## 实体概述

Cesium 实体（Entity）是用于表示地理空间对象的高层抽象，包括：

- **点（Point）**：用于标记特定位置
- **折线（Polyline）**：用于表示路径和边界
- **多边形（Polygon）**：用于表示区域
- **模型（Model）**：用于加载 3D 模型
- **标签（Label）**：用于显示文字信息

## 添加点实体

### 基本语法

```javascript
const entity = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(116.4, 39.9, 0),
  point: {
    pixelSize: 10,
    color: Cesium.Color.RED,
  },
});
```

### 完整属性

```javascript
const entity = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(116.4, 39.9, 100),
  // 点样式
  point: {
    pixelSize: 20, // 像素大小
    color: Cesium.Color.RED, // 颜色
    outlineColor: Cesium.Color.WHITE, // 边框颜色
    outlineWidth: 2, // 边框宽度
    disableDepthTestDistance: Number.POSITIVE_INFINITY, // 禁用深度测试
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 高度参考
    scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5), // 距离缩放
    translucencyByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5), // 距离透明度
  },
});
```

## 点属性详解

| 属性                       | 类型            | 说明                           |
| -------------------------- | --------------- | ------------------------------ |
| `pixelSize`                | Number          | 点的大小（像素）               |
| `color`                    | Color           | 点的颜色                       |
| `outlineColor`             | Color           | 边框颜色                       |
| `outlineWidth`             | Number          | 边框宽度（像素）               |
| `heightReference`          | HeightReference | 高度参考（CLAMP_TO_GROUND 等） |
| `disableDepthTestDistance` | Number          | 禁用深度测试的距离             |
| `scaleByDistance`          | NearFarScalar   | 距离缩放效果                   |
| `translucencyByDistance`   | NearFarScalar   | 距离透明度效果                 |

## 颜色常量

```javascript
// 内置颜色
Cesium.Color.RED;
Cesium.Color.GREEN;
Cesium.Color.BLUE;
Cesium.Color.WHITE;
Cesium.Color.BLACK;
Cesium.Color.YELLOW;
Cesium.Color.ORANGE;
Cesium.Color.PURPLE;

// 自定义颜色
Cesium.Color.fromCssColorString("#ff0000");
Cesium.Color.fromBytes(255, 0, 0);
Cesium.Color.fromCssColorString("rgba(255, 0, 0, 0.5)");
```

## 高度参考

```javascript
// 绝对高度
Cesium.HeightReference.NONE;

// 贴地（地形高度）
Cesium.HeightReference.CLAMP_TO_GROUND;

// 相对地形的高度
Cesium.HeightReference.RELATIVE_TO_GROUND;
```

## 距离效果

```javascript
// 缩放效果：近处放大，远处缩小
entity.point.scaleByDistance = new Cesium.NearFarScalar(
  1.0e3,
  2.0, // 近处：1000米内放大2倍
  1.0e6,
  0.5, // 远处：1000公里外缩小到0.5倍
);

// 透明度效果：远处渐隐
entity.point.translucencyByDistance = new Cesium.NearFarScalar(
  1.0e3,
  1.0, // 近处：不透明
  1.0e6,
  0.2, // 远处：20%透明度
);
```

## 批量添加点

```javascript
const locations = [
  { name: "北京", lon: 116.4, lat: 39.9 },
  { name: "上海", lon: 121.5, lat: 31.2 },
  { name: "广州", lon: 113.3, lat: 23.1 },
  { name: "深圳", lon: 114.1, lat: 22.5 },
];

locations.forEach((loc) => {
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(loc.lon, loc.lat, 0),
    point: {
      pixelSize: 15,
      color: Cesium.Color.fromCssColorString("#409EFF"),
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2,
    },
    label: {
      text: loc.name,
      font: "14px sans-serif",
      fillColor: Cesium.Color.BLACK,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -10),
    },
  });
});
```

## 交互操作

```javascript
// 监听点击事件
const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

handler.setInputAction(function (movement) {
  const picked = viewer.scene.pick(movement.position);

  if (Cesium.defined(picked) && picked.id) {
    const entity = picked.id;
    console.log("点击的实体:", entity);

    // 高亮显示
    viewer.selectedEntity = entity;
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
```

## 实体管理

```javascript
// 获取所有实体
const entities = viewer.entities.values;

// 移除指定实体
viewer.entities.remove(entity);

// 移除所有实体
viewer.entities.removeAll();

// 查找实体
const entity = viewer.entities.getById("entity-id");

// 遍历实体
for (let i = 0; i < viewer.entities.length; i++) {
  const entity = viewer.entities.get(i);
  console.log(entity);
}
```
