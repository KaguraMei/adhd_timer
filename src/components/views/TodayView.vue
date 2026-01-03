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
import { computed, ref, onMounted, onUnmounted } from 'vue';
import GridDisplay from '../shared/GridDisplay.vue';
import ProgressBar from '../shared/ProgressBar.vue';
import StatsDisplay from '../shared/StatsDisplay.vue';
import TimeBar from '../layout/TimeBar.vue';
import TimeDisplay from '../shared/TimeDisplay.vue';

const currentTime = ref(new Date());
let updateInterval: number | null = null;

// 更新当前时间
const updateCurrentTime = () => {
  currentTime.value = new Date();
};

// 获取当前小时
const currentHour = computed(() => {
  return currentTime.value.getHours() + 1; // +1 因为我们显示已完成的小时
});

// 计算进度百分比
const progressPercentage = computed(() => {
  const hours = currentTime.value.getHours();
  const minutes = currentTime.value.getMinutes();
  const seconds = currentTime.value.getSeconds();
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const daySeconds = 24 * 3600;
  return Math.round((totalSeconds / daySeconds) * 100);
});

// 统计信息文本
const statsText = computed(() => {
  const hours = currentTime.value.getHours();
  const minutes = currentTime.value.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} / 24小时`;
});

onMounted(() => {
  updateInterval = window.setInterval(updateCurrentTime, 1000);
});

onUnmounted(() => {
  if (updateInterval !== null) {
    clearInterval(updateInterval);
  }
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
