<template>
  <div class="page-view">
    <div ref="cesiumContainer" class="cesium-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as Cesium from "cesium";
import CircleSpiralMaterialProperty from "./js/circleSpiralMaterialProperty.js";

const cesiumContainer = ref(null);
let viewer = null;

onMounted(() => {
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    animation: false,
    timeline: false,
    infoBox: false,
    selectionIndicator: false,
    baseLayerPicker: false,
    fullscreenButton: false,
  });

  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061),
    name: "螺旋圆",
    ellipse: {
      semiMinorAxis: 1000.0,
      semiMajorAxis: 1000.0,
      material: new CircleSpiralMaterialProperty({
        color: new Cesium.Color(1, 1, 0, 0.7),
        speed: 12.0,
      }),
    },
  });

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061, 30000),
    duration: 1, // 视角飞行时长
  });
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
