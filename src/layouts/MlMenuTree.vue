<!--
 * @Author: Himmeltala zhengrenfu@outlook.com
 * @Date: 2026-02-04 18:54:51
 * @LastEditors: Himmeltala zhengrenfu@outlook.com
 * @LastEditTime: 2026-02-04 23:55:56
 * @Description: 递归菜单
-->
<template>
  <template v-for="item in menuList" :key="item.path">
    <el-sub-menu
      v-if="item.children && item.children.length"
      :index="getIndex(item.path)"
    >
      <template #title>
        <span>{{ item.meta.title }}</span>
      </template>
      <MlMenuTree
        :menu-list="item.children"
        :parent-path="getIndex(item.path)"
      />
    </el-sub-menu>
    <el-menu-item v-else :index="getIndex(item.redirect || item.path)">
      <span>{{ item.meta.title }}</span>
    </el-menu-item>
  </template>
</template>

<script setup lang="js">
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

const getIndex = path => {
  if (!props.parentPath) return path
  if (path.startsWith('/')) return path
  return `${props.parentPath}/${path}`
}
</script>
