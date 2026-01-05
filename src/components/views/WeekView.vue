<template>
  <div class="week-view">
    <div class="view-header">
      <div class="current-info">{{ weekDayName }}</div>
      <h2 class="week-title">本周</h2>
    </div>
    <div class="week-content">
      <GridDisplay 
        :total="7" 
        :current="currentDay" 
        :columns="7"
      />
      <ProgressBar :percentage="progressPercentage" />
      <StatsDisplay :text="statsText" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTimeCalc } from '@/composables/useTimeCalc';
import { useTimeStore } from '@/stores/time';
import GridDisplay from '@/components/shared/GridDisplay.vue';
import ProgressBar from '@/components/shared/ProgressBar.vue';
import StatsDisplay from '@/components/shared/StatsDisplay.vue';

const { getCurrentDayOfWeek } = useTimeCalc();
const timeStore = useTimeStore();

// 获取当前是本周第几天（1-7，周日为7）
// 依赖 dateString，只在日期变化时更新
const currentDay = computed(() => {
  // 触发响应式依赖
  timeStore.dateString;
  return getCurrentDayOfWeek();
});

// 获取星期几的名称
// 依赖 dateString，只在日期变化时更新
const weekDayName = computed(() => {
  // 触发响应式依赖
  timeStore.dateString;
  
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  // 使用 getCurrentDayOfWeek 获取调整后的星期几
  const dayOfWeek = getCurrentDayOfWeek(); // 1-7 (周一到周日)
  // 直接使用 dayOfWeek - 1 作为索引（1->0, 2->1, ..., 7->6）
  return days[dayOfWeek - 1];
});

// 计算进度百分比
const progressPercentage = computed(() => {
  return Math.round((currentDay.value / 7) * 100);
});

// 统计信息文本
const statsText = computed(() => {
  return `${currentDay.value}/7`;
});
</script>

<style scoped>
.week-view {
  width: 100%;
  padding: var(--spacing-md, 20px);
}

.view-header {
  position: relative;
  margin-bottom: var(--spacing-lg, 30px);
}

.current-info {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text, #ffffff);
  line-height: 1;
}

.week-title {
  font-size: 48px;
  font-weight: 300;
  text-align: center;
  margin: 0;
  color: var(--color-text, #ffffff);
}

.week-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 20px);
}

@media (max-width: 480px) {
  .current-info {
    font-size: 24px;
  }
  
  .week-title {
    font-size: 40px;
  }
  
  .week-view {
    padding: var(--spacing-sm, 10px);
  }
}
</style>
