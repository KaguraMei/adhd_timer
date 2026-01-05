<template>
  <div class="today-view">
    <div class="view-header">
      <div class="current-info">
        <TimeDisplay />
      </div>
      <h2 class="today-title">今日</h2>
    </div>
    <div class="today-content">
      <GridDisplay 
        :total="24" 
        :current="currentHour" 
      />
      <ProgressBar :percentage="progressPercentage" />
      <StatsDisplay :text="statsText" />
      
      <!-- 时间条 - 只在今日视图显示 -->
      <TimeBar />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import GridDisplay from '../shared/GridDisplay.vue';
import ProgressBar from '../shared/ProgressBar.vue';
import StatsDisplay from '../shared/StatsDisplay.vue';
import TimeBar from '../layout/TimeBar.vue';
import TimeDisplay from '../shared/TimeDisplay.vue';
import { useSettingsStore } from '../../stores/settings';
import { useTimeStore } from '../../stores/time';

const settingsStore = useSettingsStore();
const timeStore = useTimeStore();

// 获取当前小时（从每日开始时间算起）
// 依赖 timestamp 确保每秒更新
const currentHour = computed(() => {
  // 触发响应式依赖
  timeStore.timestamp;
  
  const now = new Date();
  const startHour = settingsStore.dayStartTime.hour;
  const startMinute = settingsStore.dayStartTime.minute;
  
  // 计算从每日开始时间到现在经过的分钟数
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startHour * 60 + startMinute;
  
  let elapsedMinutes = currentMinutes - startMinutes;
  if (elapsedMinutes < 0) {
    elapsedMinutes += 24 * 60; // 跨天
  }
  
  // 转换为小时数（向上取整）
  return Math.ceil(elapsedMinutes / 60);
});

// 计算进度百分比（从每日开始时间算起）
// 依赖 timestamp 确保每秒更新
const progressPercentage = computed(() => {
  // 触发响应式依赖
  timeStore.timestamp;
  
  const now = new Date();
  const startHour = settingsStore.dayStartTime.hour;
  const startMinute = settingsStore.dayStartTime.minute;
  
  // 计算从每日开始时间到现在经过的秒数
  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const startSeconds = startHour * 3600 + startMinute * 60;
  
  let elapsedSeconds = currentSeconds - startSeconds;
  if (elapsedSeconds < 0) {
    elapsedSeconds += 24 * 3600; // 跨天
  }
  
  const daySeconds = 24 * 3600;
  return Math.round((elapsedSeconds / daySeconds) * 100);
});

// 统计信息文本
// 依赖 timestamp 确保每秒更新
const statsText = computed(() => {
  // 触发响应式依赖
  timeStore.timestamp;
  
  const now = new Date();
  const startHour = settingsStore.dayStartTime.hour;
  const startMinute = settingsStore.dayStartTime.minute;
  
  // 计算从每日开始时间到现在经过的分钟数
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startHour * 60 + startMinute;
  
  let elapsedMinutes = currentMinutes - startMinutes;
  if (elapsedMinutes < 0) {
    elapsedMinutes += 24 * 60; // 跨天
  }
  
  const hours = Math.floor(elapsedMinutes / 60);
  const minutes = elapsedMinutes % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} / 24小时`;
});
</script>

<style scoped>
.today-view {
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

.today-title {
  font-size: 48px;
  font-weight: 300;
  text-align: center;
  margin: 0;
  color: var(--color-text, #ffffff);
}

.today-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 20px);
}

@media (max-width: 480px) {
  .current-info {
    font-size: 24px;
  }
  
  .today-title {
    font-size: 40px;
  }
  
  .today-view {
    padding: var(--spacing-sm, 10px);
  }
}
</style>
