<template>
  <div class="tab-navigation">
    <button v-for="tab in tabs" :key="tab.mode" :class="['tab-button', { active: currentView === tab.mode }]"
      :aria-selected="currentView === tab.mode" :aria-label="`切换到${tab.label}视图`" role="tab"
      @click="handleTabClick(tab.mode)">
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { watch, nextTick } from 'vue';
import { type ViewMode, VIEW_TABS } from '@/types/view';
import { useAnimation } from '@/composables/useAnimation';

interface Props {
  currentView: ViewMode;
}

interface Emits {
  (e: 'change', mode: ViewMode): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const tabs = VIEW_TABS;
const { fadeIn } = useAnimation();

/**
 * 处理标签点击事件
 */
const handleTabClick = (mode: ViewMode) => {
  if (mode !== props.currentView) {
    emit('change', mode);
  }
};

/**
 * 监听当前视图变化，触发动画
 */
watch(() => props.currentView, async () => {
  await nextTick();
  const activeTab = document.querySelector('.tab-button.active');
  if (activeTab) {
    fadeIn(activeTab as HTMLElement, 300);
  }
});
</script>

<style scoped>
.tab-navigation {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg, 40px);
  padding-top: max(var(--safe-area-inset-top), var(--spacing-md));
  padding-bottom: var(--spacing-md);
  padding-left: var(--spacing-md);
  padding-right: var(--spacing-md);
  flex-wrap: wrap;
}

.tab-button {
  position: relative;
  padding: 10px 0;
  background-color: transparent;
  color: var(--color-inactive, #666);
  /* 👈 跟随主题的未选中颜色 */
  border: none;
  font-size: 18px;
  cursor: pointer;
  transition: color var(--transition-fast, 0.3s) ease;
  outline: none;
  font-weight: 400;
}

/* 底部横线 */
.tab-button::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  background-color: var(--color-primary);
  /* 👈 跟随主题的主色 */
  transform: scaleX(0);
  transition: transform var(--transition-fast, 0.3s) ease;
}

.tab-button:hover {
  color: var(--color-text);
}

.tab-button:hover::after {
  transform: scaleX(0.5);
}

.tab-button:focus-visible {
  color: var(--color-primary);
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
  border-radius: 2px;
}

/* 选中状态 */
.tab-button.active {
  color: var(--color-text);
  /* 👈 选中时使用主题文字颜色 */
  font-weight: 600;
}

.tab-button.active::after {
  transform: scaleX(1);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .tab-navigation {
    gap: var(--spacing-md, 30px);
  }

  .tab-button {
    padding: 8px 0;
    font-size: 16px;
  }

  .tab-button::after {
    height: 2px;
  }
}
</style>