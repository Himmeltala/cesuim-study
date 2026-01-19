# 准备面状数据

获取 geojson，获取经纬度数组

# 坐标转换

用 Cesium.Cartesian3.fromDegreesArray(经纬度数组) 将地理坐标转为 Cesium 可识别的笛卡尔坐标，赋值给 polygon.hierarchy；

# 面状属性

通过 viewer.entities.add({ polygon: {} }) 添加多边形实体，核心配置包括：
material：设置填充颜色（支持按类型匹配预设颜色）；
extrudedHeight：设置拉伸高度，实现立体效果；
outline 相关：开启描边并配置颜色 / 宽度；
