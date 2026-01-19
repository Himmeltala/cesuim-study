import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/views/index.vue"),
    redirect: "/chapter01/basic/hello-cesium",
    children: [
      // 第一章
      {
        path: "chapter01/basic/hello-cesium",
        name: "HelloCesium",
        component: () => import("@/views/chapter01/basic/HelloCesium.vue"),
        meta: {
          title: "Cesium 初始化",
          chapter: "第一章：基础入门",
          mdPath: "chapter01/basic/hello-cesium.md",
        },
      },
      {
        path: "chapter01/basic/viewer-options",
        name: "ViewerOptions",
        component: () => import("@/views/chapter01/basic/ViewerOptions.vue"),
        meta: {
          title: "Viewer 配置",
          chapter: "第一章：基础入门",
          mdPath: "chapter01/basic/viewer-options.md",
        },
      },
      // 第二章
      {
        path: "chapter02/entities/point-entity",
        name: "PointEntity",
        component: () => import("@/views/chapter02/entities/PointEntity.vue"),
        meta: {
          title: "点实体",
          chapter: "第二章：实体与图形",
          mdPath: "chapter02/entities/point-entity.md",
        },
      },
      {
        path: "chapter02/entities/polyline-entity",
        name: "PolylineEntity",
        component: () =>
          import("@/views/chapter02/entities/PolylineEntity.vue"),
        meta: {
          title: "线实体",
          chapter: "第二章：实体与图形",
          mdPath: "chapter02/entities/polyline-entity.md",
        },
      },
      {
        path: "chapter02/entities/parabola-flow",
        name: "ParabolaFlow",
        component: () => import("@/views/chapter02/entities/ParabolaFlow.vue"),
        meta: {
          title: "抛物线",
          chapter: "第二章：实体与图形",
          mdPath: "chapter02/entities/parabola-flow.md",
        },
      },
      {
        path: "chapter02/entities/polygon-entity",
        name: "PolygonEntity",
        component: () => import("@/views/chapter02/entities/PolygnEntity.vue"),
        meta: {
          title: "面状要素",
          chapter: "第二章：实体与图形",
          mdPath: "chapter02/entities/polygon-entity.md",
        },
      },
      {
        path: "chapter02/entities/circle-spiral-entity",
        name: "CircleSpiralEntity",
        component: () => import("@/views/chapter02/entities/CircleSpiralEntity.vue"),
        meta: {
          title: "旋转螺旋",
          chapter: "第二章：实体与图形",
          mdPath: "chapter02/entities/circle-spiral-entity.md",
        },
      },
      {
        path: "chapter03/camera-lookat",
        name: "CameraLookAt",
        component: () => import("@/views/chapter03/CameraLookAt.vue"),
        meta: {
          title: "相机 LookAt",
          chapter: "第三章：相机控制",
          mdPath: "chapter03/camera-lookat.md",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/chapter01/basic/hello-cesium",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
