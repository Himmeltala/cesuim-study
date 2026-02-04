<!--
 * @Author: Himmeltala zhengrenfu@outlook.com
 * @Date: 2026-02-04 18:54:51
 * @LastEditors: Himmeltala zhengrenfu@outlook.com
 * @LastEditTime: 2026-02-04 23:00:14
 * @Description: 菜单
-->
<template>
  <div class="menu-container">
    <el-menu
      router
      unique-opened
      mode="vertical"
      class="sidebar-menu"
      :default-active="activeMenu"
    >
      <MenuTree :menu-list="menus" />
    </el-menu>
  </div>
</template>

<script setup lang="js">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import MenuTree from './MenuTree.vue'

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => route.path)

const menus = computed(() => {
  return router.options.routes.filter(r => r.path && r.meta)
})
</script>

<style scoped lang="scss">
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
