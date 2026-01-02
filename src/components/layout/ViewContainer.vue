<template>
  <div class="view-container">
    <Transition
      name="view-fade"
      mode="out-in"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @leave="onLeave"
    >
      <component :is="currentViewComponent" :key="currentView" class="timer-display" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue';
import { type ViewMode } from '@/types/view';
import { useAnimation } from '@/composables/useAnimation';
import TodayView from '@/components/views/TodayView.vue';
import MonthView from '@/components/views/MonthView.vue';
import WeekView from '@/components/views/WeekView.vue';
import CountdownView from '@/components/views/CountdownView.vue';
import YearView from '@/components/views/YearView.vue';
import LifeView from '@/components/views/LifeView.vue';
import TaskView from '@/components/views/TaskView.vue';

interface Props {
  currentView: ViewMode;
}

const props = defineProps<Props>();
const { fadeIn, fadeOut } = useAnimation();

/**
 * 视图组件映射
 */
const viewComponents: Record<ViewMode, Component> = {
  today: TodayView,
  week: WeekView,
  month: MonthView,
  year: YearView,
  life: LifeView,
  task: TaskView,
  countdown: CountdownView
};

/**
 * 当前视图组件
 */
const currentViewComponent = computed(() => viewComponents[props.currentView]);

/**
 * 进入前钩子
 */
const onBeforeEnter = (el: Element) => {
  (el as HTMLElement).style.opacity = '0';
};

/**
 * 进入钩子 - 使用 Anime.js 淡入动画
 */
const onEnter = (el: Element, done: () => void) => {
  fadeIn(el as HTMLElement, 300).then(done);
};

/**
 * 离开钩子 - 使用 Anime.js 淡出动画
 */
const onLeave = (el: Element, done: () => void) => {
  fadeOut(el as HTMLElement, 300).then(done);
};
</script>

<style scoped>
.view-container {
  width: 100%;
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: var(--spacing-md);
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-display {
  width: 100%;
}

/* Vue Transition 类名（作为后备） */
.view-fade-enter-active,
.view-fade-leave-active {
  transition: opacity var(--transition-fast) ease;
}

.view-fade-enter-from,
.view-fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .view-container {
    padding: var(--spacing-sm);
    min-height: 350px;
  }
}

@media (min-width: 481px) {
  .view-container {
    min-height: 450px;
  }
}
</style>
