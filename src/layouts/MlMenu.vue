<!--
 * @Author: Himmeltala zhengrenfu@outlook.com
 * @Date: 2026-02-04 18:54:51
 * @LastEditors: Himmeltala zhengrenfu@outlook.com
 * @LastEditTime: 2026-02-07 22:34:46
 * @Description: 菜单
-->
<template>
  <div class="ml-menu">
    <el-menu
      router
      mode="vertical"
      class="ml-menu w-full"
      :collapse="collapseModel"
      :default-active="activeMenu"
    >
      <MlMenuTree :menu-list="menus" />
    </el-menu>
    <div
      class="w-full flex justify-center items-center h-[40px] cursor-pointer"
    >
      <el-icon @click="collapseModel = !collapseModel">
        <ArrowRightBold v-if="collapseModel" />
        <ArrowLeftBold v-else />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="js">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'

import MlMenuTree from './MlMenuTree.vue'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  collapse: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:collapse'])

const activeMenu = computed(() => route.path)
const collapseModel = computed({
  get() {
    return props.collapse
  },
  set(val) {
    emit('update:collapse', val)
  },
})

const menus = computed(() => {
  return router.options.routes.filter(r => r.path && r.meta)
})
</script>

<style scoped lang="scss">
.ml-menu {
  height: calc(100vh - 100px);
  border-right: 0 !important;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
