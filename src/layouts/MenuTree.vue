<template>
  <!-- 循环渲染当前层级菜单 -->
  <template v-for="item in menuList" :key="item.path">
    <!-- 情况1：有子节点 → 渲染 el-sub-menu（可展开的多级菜单） -->
    <el-sub-menu
      v-if="item.children && item.children.length"
      :index="item.path"
    >
      <!-- 菜单标题 -->
      <template #title>
        <span>{{ item.meta.title }}</span>
      </template>
      <!-- 递归调用自身，渲染子菜单 -->
      <MenuTree :menu-list="item.children" />
    </el-sub-menu>

    <!-- 情况2：无子节点 → 渲染 el-menu-item（叶子节点） -->
    <el-menu-item v-else :index="item.redirect || item.path">
      <span>{{ item.meta.title }}</span>
    </el-menu-item>
  </template>
</template>

<script setup>
// 递归组件必须显式声明组件名称（关键！否则递归失效）
defineOptions({
  name: "MenuTree",
});

// 接收当前层级的菜单列表
defineProps({
  menuList: {
    type: Array,
    required: true,
    default: () => [],
  },
});
</script>

<style scoped>
/* 子菜单缩进优化，区分层级 */
:deep(.el-sub-menu .el-menu-item) {
  padding-left: 30px !important;
}
:deep(.el-sub-menu .el-sub-menu .el-menu-item) {
  padding-left: 45px !important;
}
</style>
