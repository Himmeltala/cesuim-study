<template>
  <div class="layout-container">
    <!-- 左侧导航 -->
    <el-aside :width="isNavCollapsed ? '64px' : '240px'" class="left-aside">
      <div class="logo-area">
        <el-icon class="logo-icon"><MapLocation /></el-icon>
        <span v-if="!isNavCollapsed">学习笔记</span>
      </div>

      <menu-container
        class="nav-menu"
        v-model="isNavCollapsed"
        :menu-data="menus"
      />
    </el-aside>

    <!-- 右侧内容区 -->
    <div class="right-container">
      <!-- 头部 -->
      <el-header class="header">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item
              v-for="(item, index) in breadcrumbItems"
              :key="index"
            >
              {{ item.meta?.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-actions">
          <el-button
            type="primary"
            :plain="isNotesCollapsed"
            size="small"
            @click="toggleNotes"
          >
            <el-icon>
              <DocumentChecked v-if="!isNotesCollapsed" />
              <Document v-else />
            </el-icon>
            {{ isNotesCollapsed ? "显示笔记" : "收起笔记" }}
          </el-button>
        </div>
      </el-header>

      <!-- 主体 -->
      <div class="main-body">
        <!-- 中间渲染区 -->
        <el-main class="content-area">
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </el-main>

        <!-- 右侧笔记区 -->
        <transition name="slide-fade">
          <el-aside
            v-show="!isNotesCollapsed"
            class="right-aside"
            :class="{ collapsed: isNotesCollapsed }"
          >
            <div class="notes-header">
              <span class="notes-title">
                <el-icon><Notebook /></el-icon>
                学习笔记
              </span>
              <el-button type="primary" link size="small" @click="toggleNotes">
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>

            <div class="notes-content">
              <component
                :is="currentMdComponent"
                v-if="currentMdComponent"
                class="markdown-body"
              />
              <div v-else class="empty-notes">
                <el-empty description="暂无学习笔记">
                  <el-button
                    type="primary"
                    @click="$router.push('/chapter01/basic/hello-cesium')"
                  >
                    前往第一章
                  </el-button>
                </el-empty>
              </div>
            </div>
          </el-aside>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  defineAsyncComponent,
  onMounted,
  shallowRef,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  MapLocation,
  Document,
  DocumentChecked,
  Notebook,
  ArrowRight,
} from "@element-plus/icons-vue";
import MenuContainer from "./MenuContainer.vue";

const route = useRoute();
const router = useRouter();

// 状态
const isNavCollapsed = ref(false);
const isNotesCollapsed = ref(false);
const currentMdComponent = shallowRef(null);

// 计算属性
const activeMenu = computed(() => route.path);

const menus = computed(() => {
  return router.options.routes.filter((r) => r.path && r.meta);
});

const breadcrumbItems = computed(() => {
  const items = [];
  const pathSegments = activeMenu.value.split("/").filter(Boolean);

  const findRoute = (routes, index) => {
    if (index >= pathSegments.length) {
      return true;
    }

    for (const route of routes) {
      if ([route.path].some((i) => i.includes(pathSegments[index]))) {
        items.push({
          meta: route.meta,
        });

        if (route.children) {
          return findRoute(route.children, index + 1);
        }
        return true;
      }
    }
    return false;
  };

  findRoute(menus.value, 0);

  return items;
});

// 切换笔记区域
const toggleNotes = () => {
  isNotesCollapsed.value = !isNotesCollapsed.value;
};

// 动态加载 markdown 文件
const loadMarkdown = async (mdPath) => {
  if (!mdPath) {
    currentMdComponent.value = null;
    return;
  }

  try {
    currentMdComponent.value = defineAsyncComponent({
      loader: mdPath,
    });
  } catch (error) {
    currentMdComponent.value = null;
  }
};

// 监听路由变化
watch(
  () => route.path,
  async (newPath) => {
    if (newPath !== "/") {
      await loadMarkdown(route.meta.mdPath);
    }
  },
  { immediate: true },
);

// 初始化
onMounted(() => {
  const queryNotes = route.query.notes;
  if (queryNotes === "false") {
    isNotesCollapsed.value = true;
  }
});
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.left-aside {
  background-color: #304156;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.logo-area {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #263445;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
}

.logo-icon {
  font-size: 24px;
  margin-right: 8px;
}

.nav-menu {
  flex: 1;
  border-right: none;
  overflow-y: auto;
}

.collapse-btn {
  height: 48px;
  background: #263445;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #bfcbd9;
}

.right-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f5f7fa;
}

.header {
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
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

.right-aside {
  width: 420px;
  background: #fff;
  border-left: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  transition:
    width 0.3s ease,
    opacity 0.3s ease;
  overflow: hidden;
}

.notes-header {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #ebeef5;
  background: #fafafa;
}

.notes-title {
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.notes-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.empty-notes {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
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
