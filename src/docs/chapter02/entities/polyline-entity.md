# 线实体

学习如何在 Cesium 中创建和配置线实体。

## 折线概述

折线用于表示地球表面的路径、边界、轨迹等线性要素。Cesium 支持多种类型的折线：

- **简单折线**：由一系列点连接而成的线
- **有宽度的线**：支持设置线宽
- **带材质的线**：支持渐变、纹理等效果
- **贴地线**：跟随地形起伏

## 创建基本折线

### 基本语法

```javascript
const entity = viewer.entities.add({
  polyline: {
    // 位置数组（必需）
    positions: Cesium.Cartesian3.fromDegreesArray([
      116.4, 39.9, 121.5, 31.2, 113.3, 23.1,
    ]),

    // 线条宽度（像素）
    width: 5,

    // 线条材质
    material: Cesium.Color.RED,

    // 高度参考
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,

    // 贴地跟随地形
    clampToGround: true,

    // 距离显示条件
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1e8),

    // 跟随地球曲率
    arcType: Cesium.ArcType.GEODESIC,
  },
});
```

## 折线属性详解

| 属性              | 类型            | 说明                            |
| ----------------- | --------------- | ------------------------------- |
| `positions`       | Cartesian3[]    | 折线顶点位置                    |
| `width`           | Number          | 线宽（像素）                    |
| `material`        | Material        | 线条材质                        |
| `clampToGround`   | Boolean         | 是否贴地                        |
| `heightReference` | HeightReference | 高度参考                        |
| `arcType`         | ArcType         | 弧线类型（GEODESIC/RHUMB/NONE） |

## 材质类型

### 纯色材质

```javascript
entity.polyline.material = Cesium.Color.RED;
entity.polyline.material = Cesium.Color.BLUE.withAlpha(0.5);
```

### 渐变材质

```javascript
entity.polyline.material = new Cesium.PolylineGlowMaterialProperty({
  glowPower: 0.2,
  color: Cesium.Color.RED,
});
```

### 虚线材质

```javascript
entity.polyline.material = new Cesium.PolylineDashMaterialProperty({
  color: Cesium.Color.YELLOW,
  dashLength: 16,
  gapColor: Cesium.Color.TRANSPARENT,
  dashPattern: 255, // 二进制：11111111
});
```

### 链环材质

```javascript
entity.polyline.material = new Cesium.PolylineChainLinkMaterialProperty({
  color: Cesium.Color.CYAN,
  lengthRatio: 0.5,
});
```

## 贴地折线

```javascript
// 方式一：使用 clampToGround
const entity = viewer.entities.add({
  polyline: {
    positions: Cesium.Cartesian3.fromDegreesArray([116.4, 39.9, 121.5, 31.2]),
    width: 5,
    material: Cesium.Color.RED,
    clampToGround: true, // 贴地
  },
});

// 方式二：使用 heightReference
const entity2 = viewer.entities.add({
  polyline: {
    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
      116.4, 39.9, 0, 121.5, 31.2, 0,
    ]),
    width: 5,
    material: Cesium.Color.BLUE,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
  },
});
```

## 弧线类型

```javascript
// 大圆航线（测地线）- 默认
entity.polyline.arcType = Cesium.ArcType.GEODESIC;

// 恒向线（罗盘方向）
entity.polyline.arcType = Cesium.ArcType.RHUMB;

// 直线（不跟随地球曲率）
entity.polyline.arcType = Cesium.ArcType.NONE;
```

## 批量添加折线

```javascript
const routes = [
  {
    name: "京沪线",
    color: Cesium.Color.RED,
    coordinates: [
      [116.4, 39.9],
      [121.5, 31.2],
    ],
  },
  {
    name: "京广线",
    color: Cesium.Color.BLUE,
    coordinates: [
      [116.4, 39.9],
      [113.3, 23.1],
    ],
  },
];

routes.forEach((route) => {
  const positions = route.coordinates.flatMap((coord) => coord);

  viewer.entities.add({
    name: route.name,
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray(positions),
      width: 3,
      material: route.color,
      clampToGround: true,
    },
  });
});
```

## 交互与事件

```javascript
// 监听折线点击
const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

handler.setInputAction(function (movement) {
  const picked = viewer.scene.pick(movement.position);

  if (Cesium.defined(picked) && picked.id && picked.id.polyline) {
    const entity = picked.id;
    console.log("点击的折线:", entity.name);

    // 高亮显示
    entity.polyline.material = Cesium.Color.YELLOW;
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
```

> 使用 `clampToGround: true` 时，线会自动跟随地形起伏，适合表示道路、河流等自然地物。
