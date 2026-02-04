<!--
 * @Author: Himmeltala zhengrenfu@outlook.com
 * @Date: 2026-02-04 18:54:51
 * @LastEditors: Himmeltala zhengrenfu@outlook.com
 * @LastEditTime: 2026-02-04 23:03:04
 * @Description: 递归菜单
-->
<template>
  <template v-for="item in menuList" :key="item.path">
    <el-sub-menu
      v-if="item.children && item.children.length"
      :index="item.path"
    >
      <template #title>
        <span>{{ item.meta.title }}</span>
      </template>
      <MenuTree :menu-list="item.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="item.redirect || item.path">
      <span>{{ item.meta.title }}</span>
    </el-menu-item>
  </template>
</template>

<script setup lang="js">
defineProps({
  menuList: {
    type: Array,
    required: true,
    default: () => [],
  },
})
</script>
