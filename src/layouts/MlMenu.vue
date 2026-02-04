<!--
 * @Author: Himmeltala zhengrenfu@outlook.com
 * @Date: 2026-02-04 18:54:51
 * @LastEditors: Himmeltala zhengrenfu@outlook.com
 * @LastEditTime: 2026-02-04 23:45:25
 * @Description: 菜单
-->
<template>
  <el-menu router mode="vertical" class="ml-menu" :default-active="activeMenu">
    <MlMenuTree :menu-list="menus" />
  </el-menu>
</template>

<script setup lang="js">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import MlMenuTree from './MlMenuTree.vue'

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => route.path)

const menus = computed(() => {
  return router.options.routes.filter(r => r.path && r.meta)
})
</script>

<style scoped lang="scss">
.ml-menu {
  width: 100%;
  height: 100%;
  border-right: none;
}
</style>
