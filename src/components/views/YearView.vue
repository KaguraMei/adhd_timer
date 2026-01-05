<template>
  <div class="year-view">
    <div class="view-header">
      <div class="header-row">
        <div class="current-info">{{ currentMonthName }}</div>
        <h2 class="year-title">{{ currentYear }}</h2>
      </div>
    </div>
    <div class="year-content">
      <GridDisplay :total="daysInYear" :current="currentDayOfYear" />
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

const { getCurrentDayOfYear, getDaysInYear } = useTimeCalc();
const timeStore = useTimeStore();

// 获取当前年份
const currentYear = computed(() => timeStore.year);

// 获取当前月份名称
// 依赖 monthString，只在月份变化时更新
const currentMonthName = computed(() => {
  // 触发响应式依赖
  const monthStr = timeStore.monthString;
  
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'];
  // 从 monthString 解析月份 (格式: YYYY-M)
  const parts = monthStr.split('-');
  const month = parseInt(parts[1] || '1');
  return monthNames[month - 1] || '1月';
});

// 获取今年的总天数（处理闰年）
const daysInYear = computed(() => getDaysInYear(currentYear.value));

// 获取当前是今年第几天
const currentDayOfYear = computed(() => {
  // 依赖 dateString，每天变化时更新
  timeStore.dateString;
  return getCurrentDayOfYear();
});

// 计算进度百分比
const progressPercentage = computed(() => {
  return Math.round((currentDayOfYear.value / daysInYear.value) * 100);
});

// 统计信息文本
const statsText = computed(() => {
  return `${currentDayOfYear.value}/${daysInYear.value}`;
});
</script>

<style scoped>
/* 最外层容器：占满高度，Flex 纵向布局 */
.year-view {
  width: 100%;
  height: 100%; 
  /* 或者 100vh，取决于你的 App.vue 怎么写的 */
  display: flex;
  flex:1;
  flex-direction: column;
  overflow: hidden;
  /* 防止整个页面滚动 */
  box-sizing: border-box;
  padding: 0 20px;
  /* 全局左右内边距 */
  background-color: var(--color-background);
}

/* 头部样式 */
.view-header {
  flex-shrink: 0;
  /* 防止被挤压 */
  padding-top: 20px;
  padding-bottom: 20px;
}

/* 
.header-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  position: relative;
} */

/* 如果你喜欢之前的标题居中，月份在左上角的设计，可以用这个覆盖上面的 .header-row */

.header-row {
  position: relative;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.current-info {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text);
}


.year-title {
  font-size: 48px;
  font-weight: 300;
  margin: 0;
  color: var(--color-text);
  line-height: 1;
}

/* 核心内容区 */
.year-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* 核心：占据 header 和 footer 剩下的所有空间 */
  overflow-y: auto;
  /* 增加一点内边距，防止滚动条贴着格子 */
  padding-right: 5px;
  gap: 120px;
}

/* 底部区域 */
.view-footer {
  flex-shrink: 0;
  /* 防止被挤压 */
  padding-bottom: 30px;
  /* 底部留白 */
  background-color: var(--color-background);
  /* 防止透明重叠 */
  z-index: 10;
}

@media (max-width: 480px) {
  .year-view-container {
    padding: 0 15px;
  }

  .current-info {
    font-size: 24px;
  }

  .year-title {
    font-size: 40px;
  }
}
</style>