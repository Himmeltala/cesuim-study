<template>
  <div class="layout-container">
    <!-- 左侧导航 -->
    <el-aside :width="isNavCollapsed ? '64px' : '240px'" class="left-aside">
      <div class="logo-area">
        <el-icon class="logo-icon"><MapLocation /></el-icon>
        <span v-if="!isNavCollapsed">Cesium 学习</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        class="nav-menu"
        :collapse="isNavCollapsed"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <!-- 动态生成菜单 -->
        <template v-for="group in groupedRoutes" :key="group.key">
          <el-sub-menu :index="group.key">
            <template #title>
              <span>{{ group.name }}</span>
            </template>

            <el-menu-item
              v-for="route in group.routes"
              :key="route.path"
              :index="route.path"
              @click="navigate(route.path)"
            >
              <span>{{ route.meta?.title || route.name }}</span>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>

      <div class="collapse-btn" @click="toggleNav">
        <el-icon>
          <Fold v-if="!isNavCollapsed" />
          <Expand v-else />
        </el-icon>
      </div>
    </el-aside>

    <!-- 右侧内容区 -->
    <div class="right-container">
      <!-- 头部 -->
      <el-header class="header">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentRouteMeta?.chapter">
              {{ currentRouteMeta.chapter }}
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{
              currentRouteMeta?.title || "学习内容"
            }}</el-breadcrumb-item>
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
import { ref, computed, watch, defineAsyncComponent, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  MapLocation,
  Document,
  Fold,
  Expand,
  DocumentChecked,
  Notebook,
  ArrowRight,
} from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();

// 状态
const isNavCollapsed = ref(false);
const isNotesCollapsed = ref(false);
const currentMdComponent = ref(null);

// 计算属性
const activeMenu = computed(() => route.path);
const currentRouteMeta = computed(() => route.meta);

// 从路由配置中提取子路由
const childRoutes = computed(() => {
  const rootRoute = router.options.routes.find((r) => r.path === "/");
  if (rootRoute && rootRoute.children) {
    return rootRoute.children.filter((r) => r.path && r.meta?.chapter);
  }
  return [];
});

// 按章节分组路由
const groupedRoutes = computed(() => {
  const groups = {};

  childRoutes.value.forEach((r) => {
    const chapter = r.meta?.chapter || "未分类";
    if (!groups[chapter]) {
      groups[chapter] = [];
    }
    groups[chapter].push(r);
  });

  return Object.entries(groups).map(([chapterName, routes], index) => {
    return {
      key: `chapter_${index}`,
      name: chapterName,
      routes: routes,
    };
  });
});

// 切换导航栏
const toggleNav = () => {
  isNavCollapsed.value = !isNavCollapsed.value;
};

// 切换笔记区域
const toggleNotes = () => {
  isNotesCollapsed.value = !isNotesCollapsed.value;
};

const navigate = (path) => {
  router.push("/" + path);
};

// 动态加载 markdown 文件
const loadMarkdown = async (mdPath) => {
  if (!mdPath) {
    currentMdComponent.value = null;
    return;
  }

  try {
    const modules = import.meta.glob("/src/docs/**/*.md");
    const fullPath = `/src/docs/${mdPath}`;

    if (modules[fullPath]) {
      const mod = await modules[fullPath]();
      currentMdComponent.value = defineAsyncComponent(() =>
        Promise.resolve(mod.default),
      );
    } else {
      console.warn(`Markdown file not found: ${fullPath}`);
      currentMdComponent.value = null;
    }
  } catch (error) {
    console.error("Failed to load markdown:", error);
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
