<template>
  <div class="week-view">
    <div class="view-header">
      <div class="current-info">{{ weekDayName }}</div>
      <h2 class="week-title">本周</h2>
    </div>
    <div class="week-content">
      <GridDisplay 
        :total="gridTotal" 
        :current="gridCurrent"
      />
      <ProgressBar :percentage="progressPercentage" />
      <div class="stats-display">
        <p class="stats-text">{{ statsLine1 }}</p>
        <p class="stats-text">{{ statsLine2 }}</p>
      </div>
    </div>
      <button class="view-toggle" @click="toggleView" aria-label="切换视图">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/>
        </svg>
      </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTimeCalc } from '@/composables/useTimeCalc';
import { useTimeStore } from '@/stores/time';
import GridDisplay from '@/components/shared/GridDisplay.vue';
import ProgressBar from '@/components/shared/ProgressBar.vue';

const { getCurrentDayOfWeek } = useTimeCalc();
const timeStore = useTimeStore();

// 视图切换状态：false = 周视图，true = 小时视图
const isHourView = ref(false);

// 获取当前是本周第几天（1-7，周日为7）
const currentDay = computed(() => {
  timeStore.dateString;
  return getCurrentDayOfWeek();
});

// 获取当前是本周第几小时（1-168）
const currentHour = computed(() => {
  timeStore.hour; // 依赖小时变化
  const now = new Date();
  const dayOfWeek = getCurrentDayOfWeek(); // 1-7
  const currentHourOfDay = now.getHours(); // 0-23
  return (dayOfWeek - 1) * 24 + currentHourOfDay + 1; // 1-168
});

// 获取星期几的名称
const weekDayName = computed(() => {
  timeStore.dateString;
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const dayOfWeek = getCurrentDayOfWeek();
  return days[dayOfWeek - 1];
});

// Grid 总数
const gridTotal = computed(() => {
  return isHourView.value ? 168 : 7;
});

// Grid 当前进度
const gridCurrent = computed(() => {
  return isHourView.value ? currentHour.value : currentDay.value;
});

// 计算进度百分比
const progressPercentage = computed(() => {
  if (isHourView.value) {
    return Math.round((currentHour.value / 168) * 100);
  }
  return Math.round((currentDay.value / 7) * 100);
});

// 统计信息第一行：百分比（保留1位小数）
const statsLine1 = computed(() => {
  const percentage = isHourView.value 
    ? (currentHour.value / 168) * 100 
    : (currentDay.value / 7) * 100;
  return `${percentage.toFixed(1)}%`;
});

// 统计信息第二行：进度
const statsLine2 = computed(() => {
  if (isHourView.value) {
    return `${currentHour.value}/168 小时`;
  }
  return `${currentDay.value}/7 天`;
});

// 切换视图
const toggleView = () => {
  isHourView.value = !isHourView.value;
};
</script>

<style scoped>
.week-view {
  width: 100%;
  padding: var(--spacing-md, 20px);
  padding-bottom: 0px;
  position: relative;
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

.stats-display {
  text-align: center;
  padding: var(--spacing-sm, 10px) 0;
}

.stats-text {
  font-size: 16px;
  color: var(--color-muted, #888);
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.view-toggle {
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 40px;
  height: 40px;
  padding: 8px;
  background: transparent;
  color: var(--color-text, #ffffff);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
  opacity: 0.6;
}

.view-toggle svg {
  width: 100%;
  height: 100%;
  display: block;
}

.view-toggle:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15);
  transform: rotate(180deg);
}

.view-toggle:active {
  opacity: 0.8;
  transform: scale(0.95);
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

  .stats-text {
    font-size: 14px;
  }

  .view-actions {
    padding: var(--spacing-sm, 10px) 0;
  }

  .view-toggle {
    width: 40px;
    height: 40px;
    padding: 8px;
  }
}
</style>
