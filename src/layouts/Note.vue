<!--
 * @Author: Himmeltala zhengrenfu@outlook.com
 * @Date: 2026-02-04 22:41:21
 * @LastEditors: Himmeltala zhengrenfu@outlook.com
 * @LastEditTime: 2026-02-04 23:28:18
 * @Description: 学习笔记
-->
<script setup lang="js">
import {
  computed,
  defineAsyncComponent,
  defineProps,
  shallowRef,
  watch,
} from 'vue'
import { useRoute } from 'vue-router'

import { ArrowRight, Notebook } from '@element-plus/icons-vue'

const route = useRoute()

const props = defineProps({
  collapse: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['update:collapse'])

const collapseModel = computed({
  get: () => props.collapse,
  set: val => {
    emit('update:collapse', val)
  },
})

const currentMdComponent = shallowRef(null)

const loadMarkdown = async mdPath => {
  if (!mdPath) {
    currentMdComponent.value = null
    return
  }

  try {
    currentMdComponent.value = defineAsyncComponent({
      loader: mdPath,
    })
  } catch (error) {
    currentMdComponent.value = null
  }
}

const changeNoteCollapse = () => {
  collapseModel.value = !collapseModel.value
}

watch(
  () => route.path,
  async nv => {
    if (nv !== '/') {
      await loadMarkdown(route.meta.mdPath)
    }
  },
  { immediate: true },
)
</script>

<template>
  <el-aside
    v-show="!collapseModel"
    class="note-aside"
    :class="{ collapsed: collapseModel }"
  >
    <div class="note-header">
      <span class="note-title">
        <el-icon class="mr-2"><Notebook /></el-icon>
        学习笔记
      </span>
      <el-button type="primary" link size="small" @click="changeNoteCollapse">
        <el-icon><ArrowRight /></el-icon>
      </el-button>
    </div>

    <div class="note-content">
      <component
        v-if="currentMdComponent"
        :is="currentMdComponent"
        class="markdown-body"
      />
      <div v-else class="empty-note">
        <el-empty description="暂无学习笔记">
          <el-button type="primary" @click="$router.push('/')">
            前往第一章
          </el-button>
        </el-empty>
      </div>
    </div>
  </el-aside>
</template>

<style scoped lang="scss">
.note-aside {
  width: 420px;
  background-color: var(--el-fill-color-blank);
  border-left: 1px solid var(--el-border-color);
  display: flex;
  flex-direction: column;
  transition:
    width 0.3s ease,
    opacity 0.3s ease;
  overflow: hidden;
}

.note-header {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--el-border-color);
  background-color: var(--el-fill-color-blank);
}

.note-title {
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.note-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.empty-note {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}
</style>
