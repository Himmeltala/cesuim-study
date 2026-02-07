<!--
 * @Author: Himmeltala zhengrenfu@outlook.com
 * @Date: 2026-02-04 18:54:51
 * @LastEditors: Himmeltala zhengrenfu@outlook.com
 * @LastEditTime: 2026-02-07 22:48:31
 * @Description: 递归菜单
-->
<template>
  <template v-for="item in menuList" :key="item.path">
    <el-sub-menu
      v-if="item.children && item.children.length"
      :index="getIndex(item.path)"
    >
      <template #title>
        <component
          v-if="item.meta.icon"
          :is="getIconComponent(item.meta.icon)"
          class="menu-icon mr-2"
        />
        <img
          v-else-if="item.meta.iconPath"
          :src="item.meta.iconPath"
          class="menu-icon mr-2"
        />
        <span>{{ item.meta.title }}</span>
      </template>
      <MlMenuTree
        :menu-list="item.children"
        :parent-path="getIndex(item.path)"
      />
    </el-sub-menu>
    <el-menu-item v-else :index="getIndex(item.redirect || item.path)">
      <component
        v-if="item.meta.icon"
        :is="getIconComponent(item.meta.icon)"
        class="menu-icon mr-2"
      />
      <img
        v-else-if="item.meta.iconPath"
        :src="item.meta.iconPath"
        class="menu-icon mr-2"
      />

      <span>{{ item.meta.title }}</span>
    </el-menu-item>
  </template>
</template>

<script setup lang="js">
import { computed } from 'vue'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const props = defineProps({
  menuList: {
    type: Array,
    required: true,
    default: () => [],
  },
  parentPath: {
    type: String,
    default: '',
  },
})

// 图标组件映射
const iconComponents = computed(() => {
  return ElementPlusIconsVue
})

// 获取图标组件
const getIconComponent = iconName => {
  if (typeof iconName === 'string') {
    return iconComponents.value[iconName]
  }
  return iconName
}

const getIndex = path => {
  if (!props.parentPath) return path
  if (path.startsWith('/')) return path
  return `${props.parentPath}/${path}`
}
</script>

<style lang="scss" scoped>
.menu-icon {
  width: 16px;
  height: auto;
  object-fit: contain;
}
</style>
