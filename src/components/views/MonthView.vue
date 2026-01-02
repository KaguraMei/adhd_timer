<template>
  <div class="month-view">
    <div class="view-header">
      <div class="current-info">{{ currentDate }}</div>
      <h2 class="month-title">{{ monthName }}</h2>
    </div>
    <div class="month-content">
      <GridDisplay 
        :total="daysInMonth" 
        :current="currentDay" 
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

const { getCurrentDayOfMonth, getDaysInMonth } = useTimeCalc();

// 获取当前月份数据
const currentDay = computed(() => getCurrentDayOfMonth());
const daysInMonth = computed(() => getDaysInMonth());

// 获取当前日期（如"1月15日"）
const currentDate = computed(() => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `${month}月${day}日`;
});

// 获取月份名称
const monthName = computed(() => {
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', 
                      '7月', '8月', '9月', '10月', '11月', '12月'];
  return monthNames[new Date().getMonth()];
});

// 计算进度百分比
const progressPercentage = computed(() => {
  return Math.round((currentDay.value / daysInMonth.value) * 100);
});

// 统计信息文本
const statsText = computed(() => {
  return `${currentDay.value}/${daysInMonth.value}`;
});
</script>

<style scoped>
.month-view {
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

.month-title {
  font-size: 48px;
  font-weight: 300;
  text-align: center;
  margin: 0;
  color: var(--color-text, #ffffff);
}

.month-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 20px);
}

@media (max-width: 480px) {
  .current-info {
    font-size: 24px;
  }
  
  .month-title {
    font-size: 40px;
  }
  
  .month-view {
    padding: var(--spacing-sm, 10px);
  }
}
</style>
