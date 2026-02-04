# 自定义材质基本流程

## 1.定义材质类

所有自定义材质，都需要创建一个**独立的类**，类名建议规范命名：`XXXMaterialProperty`（XXX为材质功能，如LineFlow、Glow、Flash）

- 初始化材质的可配置参数（私有变量）
- 创建 Cesium 标准的属性变更事件，用于监听参数修改

```javascript
import * as Cesium from 'cesium'

class 自定义材质类名MaterialProperty {
  constructor(options) {
    // 创建属性变更事件，Cesium材质体系的标准要求
    this._definitionChanged = new Cesium.Event()

    // 声明所有需要配置的私有变量，前缀统一加_，规范区分
    this._属性1 = undefined
    this._属性2 = undefined
    this._属性3 = undefined
    // ... 按需添加N个属性

    // 初始化传入的配置参数，赋值给私有变量
    this.属性1 = options.属性1
    this.属性2 = options.属性2
    this.属性3 = options.属性3
  }
}
```

## 2.流动线材质

```javascript
class LineFlowMaterialProperty {
  constructor(options) {
    this._definitionChanged = new Cesium.Event()
    this._color = undefined // 流动线颜色
    this._speed = undefined // 流动速度
    this._percent = undefined // 流动段占比
    this._gradient = undefined // 渐变透明度
    this.color = options.color
    this.speed = options.speed
    this.percent = options.percent
    this.gradient = options.gradient
  }
}
```

## 3.实现 Cesium 材质

Cesium 的材质渲染引擎，会自动调用这些属性和方法，实现材质的生命周期管理、参数获取、类型识别，**所有自定义材质的该部分代码，除业务逻辑外，结构完全一致**

### 3.1 实现属性

属性为固定名称、固定返回值，无任何业务逻辑，直接复制复用即可

```javascript
// 挂载到 步骤一定义的类中，类的内部
// ① 固定：标识材质是否为「常量材质」，自定义动态材质一律返回 false
get isConstant() {
  return false;
}

// ② 固定：返回属性变更事件，供Cesium监听参数变化
get definitionChanged() {
  return this._definitionChanged;
}
```

### 3.2 实现方法

方法为固定名称、固定入参、固定返回值规范，仅需修改方法内部的业务逻辑

#### 方法1：`getType(time)`

- 作用：告诉 Cesium 该材质的「唯一标识类型」
- 要求：返回一个**字符串常量**（自定义，如`LineFlowMaterialType`），需保证全局唯一
- 注意：**不能返回 Cesium.Material.xxx**，遵守不可扩展规则

```javascript
getType(time) {
  // 返回自定义的材质类型字符串，唯一即可
  return "自定义材质类型字符串";
}
```

#### 方法2：`getValue(time, result)`

- 作用：向着色器传递**最新的参数值**，是 JS 与 GLSL 着色器的「数据桥梁」
- 入参规范：
  - `time`：Cesium 的时间戳，用于动态材质的帧同步
  - `result`：返回的参数对象，Cesium 做了缓存优化，优先使用传入的result
- 核心API：`Cesium.Property.getValueOrDefault(私有变量, time, 默认值, 缓存对象)`，标准化取值，自动处理参数为空的情况
- 返回值：必返回包含所有uniform参数的对象，对象的key需和着色器中的`uniform`变量名**完全一致**

```javascript
getValue(time, result) {
  // 固定写法：如果result为空，初始化空对象
  if (!Cesium.defined(result)) {
    result = {};
  }
  // 核心逻辑：为result赋值，key与着色器uniform变量名一一对应
  result.参数名1 = Cesium.Property.getValueOrDefault(this._私有变量1, time, 默认值1, result.参数名1);
  result.参数名2 = Cesium.Property.getValueOrDefault(this._私有变量2, time, 默认值2, result.参数名2);
  // 返回参数对象，传递给着色器
  return result;
}
```

#### 方法3：`equals(other)`

- 作用：Cesium 用于判断两个材质实例是否相等，做渲染优化（相等则不重新渲染）
- 逻辑：对比当前实例和传入实例的**所有私有参数**是否一致，一致返回true，否则false
- 写法：固定结构，仅需替换私有变量即可，无业务逻辑

```javascript
equals(other) {
  return (this === other ||
    (other instanceof 自定义材质类名MaterialProperty &&
      Cesium.Property.equals(this._属性1, other._属性1) &&
      Cesium.Property.equals(this._属性2, other._属性2) &&
      // 所有私有变量都要做对比
      Cesium.Property.equals(this._属性n, other._属性n))
  )
}
```

### 4.材质类绑定属性描述

通过 Cesium 官方提供的 `Cesium.createPropertyDescriptor(属性名)` API，为私有变量创建**响应式的公共属性**：

1. 当你修改材质实例的参数（如 `material.color = Cesium.Color.BLUE`）时，会自动更新私有变量的值
2. 自动触发 `_definitionChanged` 事件，告知 Cesium 参数已变更，需要重新渲染材质
3. 无需手动写setter/getter，Cesium 封装了完整的响应式逻辑

```javascript
// 写在类的外部，类定义完成后
Object.defineProperties(自定义材质类名MaterialProperty.prototype, {
  属性名1: Cesium.createPropertyDescriptor('属性名1'),
  属性名2: Cesium.createPropertyDescriptor('属性名2'),
  属性名3: Cesium.createPropertyDescriptor('属性名3'),
  // 所有需要响应式的属性都要在这里绑定
})
```

### 5.编写着色器源码

1. 着色器源码定义为 **独立的字符串常量**，不挂载到 `Cesium.Material`，遵守不可扩展规则
2. 着色器基于 Cesium 内置的 `czm` 体系开发，无需自己写顶点着色器，只需要实现片元着色器的 `czm_getMaterial` 方法
3. 着色器中通过 `uniform 变量` 接收 JS 中传递的参数，**uniform变量名必须和 `getValue` 返回的result的key完全一致**
4. 所有自定义材质的着色器，都遵循「固定结构 + 自定义渲染逻辑」的规范

```javascript
const 着色器常量名 = `
    // 声明uniform统一变量，与JS的getValue返回的key一一对应
    uniform 变量类型 变量名1;
    uniform 变量类型 变量名2;

    // czm_getMaterial，Cesium会自动调用，入参固定为materialInput
    czm_material czm_getMaterial(czm_materialInput materialInput){
      // 获取默认材质，初始化材质对象
      czm_material material = czm_getDefaultMaterial(materialInput);
      
      // 获取纹理坐标st，是材质渲染的核心坐标，st.s为横向坐标，st.t为纵向坐标
      vec2 st = materialInput.st;

      // 为材质赋值最终的颜色、透明度等属性
      material.diffuse = 最终颜色值; // 漫反射颜色，rgb格式
      material.alpha = 最终透明度值; // 透明度，0-1之间
      
      // 返回材质对象
      return material;
    }
`
```

### 6.将材质注册到Cesium材质缓存

Cesium 内部维护了一个材质缓存池 `Cesium.Material._materialCache`，所有自定义材质必须**注册到缓存池**后才能被 Cesium 识别和使用，这是最后一步核心操作，**固定流程，无任何变体**，可直接复用模板。

```javascript
Cesium.Material._materialCache.addMaterial('步骤二的材质类型字符串', {
  fabric: {
    type: '步骤二的材质类型字符串', // 必须和getType返回的字符串一致
    uniforms: {
      // 材质的默认参数，与uniform变量一一对应，和JS中的默认值保持一致
      参数名1: 默认值,
      参数名2: 默认值,
    },
    source: 步骤四的着色器常量名, // 传入着色器源码
  },
  // 固定：声明材质是否为半透明材质，动态材质/带透明度的材质一律返回true
  translucent: function (material) {
    return true
  },
})
```

### 7.业务中导入并使用

所有自定义材质的使用方式完全一致，在Entity的polyline/rectangle/ellipse等图形的`material`属性中，**new 导入的材质类 + 传入配置参数**即可，示例基于你的流动线材质：

```javascript
import * as Cesium from 'cesium'

import LineFlowMaterialProperty from './你的文件路径/lineFlowMaterialProperty.js'

// 示例：创建流动线
viewer.entities.add({
  polyline: {
    positions: Cesium.Cartesian3.fromDegreesArray([116.39, 39.9, 117.39, 39.9]),
    width: 8,
    // 直接new导入的类，传入配置参数
    material: new LineFlowMaterialProperty({
      color: Cesium.Color.BLUE,
      speed: 15,
      percent: 0.2,
      gradient: 0.02,
    }),
    clampToGround: true,
  },
})
```
