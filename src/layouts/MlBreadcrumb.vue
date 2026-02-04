<!--
 * @Author: Himmeltala zhengrenfu@outlook.com
 * @Date: 2026-02-04 22:54:49
 * @LastEditors: Himmeltala zhengrenfu@outlook.com
 * @LastEditTime: 2026-02-04 22:56:07
 * @Description: 面包屑
-->
<script setup lang="js">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => route.path)

const menus = computed(() => {
  return router.options.routes.filter(r => r.path && r.meta)
})

const breadcrumbItems = computed(() => {
  const items = []
  const pathSegments = activeMenu.value.split('/').filter(Boolean)

  const findRoute = (routes, index) => {
    if (index >= pathSegments.length) {
      return true
    }

    for (const route of routes) {
      if ([route.path].some(i => i.includes(pathSegments[index]))) {
        items.push({
          meta: route.meta,
        })

        if (route.children) {
          return findRoute(route.children, index + 1)
        }
        return true
      }
    }
    return false
  }

  findRoute(menus.value, 0)

  return items
})
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
      {{ item.meta?.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped lang="scss"></style>
