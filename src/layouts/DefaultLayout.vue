<!--
 * @Author: Himmeltala zhengrenfu@outlook.com
 * @Date: 2026-02-04 18:54:51
 * @LastEditors: Himmeltala zhengrenfu@outlook.com
 * @LastEditTime: 2026-02-05 11:26:01
 * @Description: 默认布局
-->
<template>
  <div class="layout-container">
    <el-aside :width="isNavCollapse ? '60px' : '240px'" class="left-container">
      <div class="logo-area">
        <el-icon class="logo-icon"><MapLocation /></el-icon>
        <span v-if="!isNavCollapse">学习笔记</span>
      </div>
      <MlMenu class="nav-menu" v-model:collapse="isNavCollapse" />
    </el-aside>
    <div class="right-container">
      <el-header class="header">
        <MlBreadcrumb />
        <div class="header-actions">
          <el-button
            type="primary"
            size="small"
            :plain="isNoteCollapse"
            @click="isNoteCollapse = !isNoteCollapse"
          >
            <el-icon>
              <DocumentChecked v-if="!isNoteCollapse" />
              <Document v-else />
            </el-icon>
            {{ isNoteCollapse ? '显示笔记' : '收起笔记' }}
          </el-button>
          <el-icon class="cursor-pointer" @click="handleDarkModeChange">
            <Moon v-if="!isDarkMode" />
            <Sunny v-else />
          </el-icon>
        </div>
      </el-header>
      <div class="main-body">
        <el-main class="content-area">
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </el-main>
        <transition name="slide-fade">
          <MlNote v-model:collapse="isNoteCollapse" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import {
  Document,
  DocumentChecked,
  MapLocation,
  Moon,
  Sunny,
} from '@element-plus/icons-vue'

import MlBreadcrumb from './MlBreadcrumb.vue'
import MlMenu from './MlMenu.vue'
import MlNote from './MlNote.vue'

const isDarkMode = ref(true)
const isNavCollapse = ref(false)
const isNoteCollapse = ref(false)

function handleDarkModeChange() {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.left-container {
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid var(--el-border-color);
}

.logo-area {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid var(--el-border-color);
}

.logo-icon {
  font-size: 24px;
  margin-right: 8px;
}

.nav-menu {
  flex: 1;
}

.collapse-btn {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.right-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--el-fill-color-blank);
}

.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: var(--el-fill-color-blank);
  border-bottom: 1px solid var(--el-border-color);
}

.breadcrumb {
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.main-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.content-area {
  flex: 1;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
