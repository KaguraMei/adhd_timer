<template>
  <div class="tab-navigation">
    <button
      v-for="tab in tabs"
      :key="tab.mode"
      :class="['tab-button', { active: currentView === tab.mode }]"
      :aria-selected="currentView === tab.mode"
      :aria-label="`切换到${tab.label}视图`"
      role="tab"
      @click="handleTabClick(tab.mode)"
    >
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
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  flex-wrap: wrap;
}

.tab-button {
  padding: 10px 20px;
  background-color: transparent;
  color: var(--color-muted);
  border: 2px solid var(--color-inactive);
  border-radius: var(--border-radius-lg);
  font-size: 16px;
  cursor: pointer;
  transition: all var(--transition-fast) ease;
  outline: none;
  font-weight: 500;
}

.tab-button:hover {
  border-color: var(--color-primary);
  color: var(--color-text);
}

.tab-button:focus-visible {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(255, 149, 0, 0.3);
}

.tab-button.active {
  background-color: var(--color-primary);
  color: #000;
  border-color: var(--color-primary);
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .tab-navigation {
    gap: var(--spacing-xs);
    padding: var(--spacing-sm);
  }

  .tab-button {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>
