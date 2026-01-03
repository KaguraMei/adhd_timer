<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { type ViewMode } from './types/view';
import { useTheme } from './composables/useTheme';
import { useAnimation } from './composables/useAnimation';
import TabNavigation from './components/layout/TabNavigation.vue';
import ViewContainer from './components/layout/ViewContainer.vue';
import SettingsDrawer from './components/settings/SettingsDrawer.vue';

// 当前视图状态
const currentView = ref<ViewMode>('today');

// 设置抽屉显示状态
const showSettings = ref(false);

// 主题管理
const { loadTheme } = useTheme();

// 动画管理
const { loadAnimationSettings } = useAnimation();

// 自动更新定时器
let autoUpdateInterval: number | null = null;

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
 * 自动更新当前视图（每 60 秒）
 */
const setupAutoUpdate = (): void => {
  autoUpdateInterval = window.setInterval(() => {
    // 强制重新渲染当前视图
    const temp = currentView.value;
    currentView.value = '' as ViewMode;
    setTimeout(() => {
      currentView.value = temp;
    }, 10);
  }, 60000);
};

/**
 * 组件挂载时初始化
 */
onMounted(() => {
  // 加载保存的主题配置
  loadTheme();
  
  // 加载动画设置
  loadAnimationSettings();
  
  // 设置自动更新
  setupAutoUpdate();
});

/**
 * 组件卸载时清理
 */
const cleanup = (): void => {
  if (autoUpdateInterval !== null) {
    clearInterval(autoUpdateInterval);
  }
};

// 注册清理函数
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', cleanup);
}
</script>

<template>
  <div class="app-container">
    <!-- 设置按钮 -->
    <button 
      class="settings-button" 
      @click="toggleSettings"
      aria-label="打开设置"
    >
      ⚙️
    </button>

    <!-- 标签导航 -->
    <TabNavigation 
      :current-view="currentView" 
      @change="switchView" 
    />

    <!-- 视图容器 -->
    <ViewContainer :current-view="currentView" />

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
  min-height: 90vh;
  background-color: var(--color-background);
  position: relative;
}

.settings-button {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--color-container-bg);
  border: 2px solid var(--color-inactive);
  color: var(--color-text);
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast) ease;
  z-index: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.settings-button:hover {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  transform: rotate(90deg);
}

.settings-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 149, 0, 0.3);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .settings-button {
    top: 15px;
    right: 15px;
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
}
</style>
