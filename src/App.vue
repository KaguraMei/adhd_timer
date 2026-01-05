<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { type ViewMode } from './types/view';
import { useTheme } from './composables/useTheme';
import { useTimeStore } from './stores/time';
import TabNavigation from './components/layout/TabNavigation.vue';
import ViewContainer from './components/layout/ViewContainer.vue';
import SettingsDrawer from './components/settings/SettingsDrawer.vue';
import AppFooter from './components/layout/AppFooter.vue';
import DraggableButton from './components/shared/DraggableButton.vue';

// 当前视图状态
const currentView = ref<ViewMode>('today');

// 设置抽屉显示状态
const showSettings = ref(false);

// 使用主题 composable
const { loadTheme } = useTheme();

// 使用全局时间 store
const timeStore = useTimeStore();

/**
 * 切换视图
 */
const switchView = (mode: ViewMode): void => {
  currentView.value = mode;
};

/**
 * 切换设置抽屉显示状态
 */
const toggleSettings = (): void => {
  showSettings.value = !showSettings.value;
};

/**
 * 关闭设置抽屉
 */
const closeSettings = (): void => {
  showSettings.value = false;
};

/**
 * 组件挂载时初始化
 */
onMounted(() => {
  // 从 localStorage 加载主题并应用
  loadTheme();
  
  // 启动全局时间更新
  timeStore.startTimeUpdates();
});

/**
 * 组件卸载时清理
 */
onUnmounted(() => {
  // 停止全局时间更新
  timeStore.stopTimeUpdates();
});
</script>

<template>
  <div class="app-container">
    <!-- 可拖动的设置按钮 -->
    <DraggableButton
      aria-label="打开设置"
      storage-key="settings-button-position"
      @click="toggleSettings"
    >
      ⚙️
    </DraggableButton>

    <!-- 标签导航 -->
    <TabNavigation 
      :current-view="currentView" 
      @change="switchView" 
    />

    <!-- 视图容器 -->
    <ViewContainer :current-view="currentView" />

    <!-- 底部栏 -->
    <AppFooter />

    <!-- 设置抽屉 -->
    <SettingsDrawer 
      :visible="showSettings" 
      @close="closeSettings" 
    />
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  flex: 1; 
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
  position: relative;
}
</style>
