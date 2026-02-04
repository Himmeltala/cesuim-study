<template>
  <!-- 菜单容器：固定宽度，适配侧边栏布局 -->
  <div class="menu-container">
    <el-menu
      :default-active="activeMenu"
      mode="vertical"
      router
      unique-opened
      class="sidebar-menu"
    >
      <MenuTree :menu-list="menuData" />
    </el-menu>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import MenuTree from "./MenuTree.vue";

const props = defineProps({
  menuData: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const route = useRoute();
const activeMenu = computed(() => route.path);
</script>

<style scoped>
.menu-container {
  width: 100%;
  height: 100%;
}
.sidebar-menu {
  width: 100%;
  height: 100%;
  border-right: none;
}
</style>
