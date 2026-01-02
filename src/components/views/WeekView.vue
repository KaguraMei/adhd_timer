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
import GridDisplay from '@/components/shared/GridDisplay.vue';
import ProgressBar from '@/components/shared/ProgressBar.vue';
import StatsDisplay from '@/components/shared/StatsDisplay.vue';

const { getCurrentDayOfWeek } = useTimeCalc();

// 获取当前是本周第几天（1-7，周日为7）
const currentDay = computed(() => getCurrentDayOfWeek());

// 获取星期几的名称
const weekDayName = computed(() => {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const dayIndex = new Date().getDay();
  return days[dayIndex];
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
