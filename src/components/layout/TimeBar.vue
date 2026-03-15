<template>
  <div class="time-bar">
    <div class="time-bar-content">
      <!-- 时间刻度线 -->
      <div
        v-for="tick in ticks"
        :key="tick.position"
        :class="['time-tick', tick.type, { past: tick.isPast }]"
        :style="{ left: `${tick.position}%` }"
      >
        <!-- <span v-if="tick.label" class="tick-label">{{ tick.label }}</span> -->
      </div>

      <!-- 当前分钟指示器 -->
      <div
        ref="indicatorRef"
        class="time-indicator"
        :style="{ left: `${indicatorPosition}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useAnimation } from '../../composables/useAnimation';
import { useTimeStore } from '../../stores/time';

interface TimeTick {
  position: number;
  type: 'major' | 'minor';
  label?: string;
  isPast: boolean; // 👈 新增：标记是否已过去
}

const { moveIndicator } = useAnimation();
const timeStore = useTimeStore();

const indicatorRef = ref<HTMLElement | null>(null);
const previousHour = ref(-1);

/**
 * 使用全局时间存储，响应式更新
 */
const currentHour = computed(() => {
  // 触发响应式依赖
  timeStore.timestamp;
  return timeStore.currentTime.getHours();
});

const currentMinute = computed(() => {
  // 触发响应式依赖
  timeStore.timestamp;
  return timeStore.currentTime.getMinutes();
});

const currentSecond = computed(() => {
  // 触发响应式依赖
  timeStore.timestamp;
  return timeStore.currentTime.getSeconds();
});

/**
 * 计算时间刻度
 * 每 15 分钟一个主要刻度（粗高竖条）
 */
const ticks = computed<TimeTick[]>(() => {
  const result: TimeTick[] = [];
  
  // 生成 15 分钟间隔的主要刻度
  for (let minute = 0; minute <= 60; minute += 15) {
    const position = (minute / 60) * 100;
    const displayMinute = minute === 60 ? 0 : minute;
    const displayHour = minute === 60 ? (currentHour.value + 1) % 24 : currentHour.value;
    
    // 👇 判断刻度是否已经过去
    // 如果刻度的分钟数小于当前分钟数，说明已经过去
    const isPast = minute < currentMinute.value;
    
    result.push({
      position,
      type: 'major',
      label: `${displayHour.toString().padStart(2, '0')}:${displayMinute.toString().padStart(2, '0')}`,
      isPast // 👈 添加 isPast 属性
    });
  }
  
  return result;
});

/**
 * 计算当前分钟指示器位置（百分比）
 */
const indicatorPosition = computed(() => {
  // 精确计算位置，包含秒数
  const totalSeconds = currentMinute.value * 60 + currentSecond.value;
  return (totalSeconds / 3600) * 100;
});

/**
 * 监听小时变更
 */
watch(currentHour, (newHour, oldHour) => {
  if (oldHour !== undefined && oldHour !== newHour) {
    // 小时变更，记录前一个小时
    previousHour.value = oldHour;
  }
});

/**
 * 使用 Anime.js 平滑移动指示器
 */
watch(indicatorPosition, (newPosition) => {
  if (indicatorRef.value) {
    moveIndicator(indicatorRef.value, newPosition, 1000);
  }
});
</script>

<style scoped>
.time-bar {
  position: relative;
  width: 100%;
  height: 3vh;
  min-height: 150px;
  background-color: transparent;
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md) 0;
}

.time-bar-content {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 时间刻度线 */
.time-tick {
  position: absolute;
  bottom: 0;
  transform: translateX(-50%);
  transition: background-color var(--transition-fast) ease;
}

.time-tick.major {
  width: 6px;
  height: 80%;
  background-color: var(--color-inactive); /* 默认：未来时间 */
}

/* 👇 过去的时间：使用主题文字颜色 */
.time-tick.major.past {
  background-color: var(--color-text);
}

.time-tick.minor {
  width: 3px;
  height: 40%;
  background-color: var(--color-inactive);
}

.time-tick.minor.past {
  background-color: var(--color-text);
}

/* 刻度标签 */
.tick-label {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  color: var(--color-text);
  white-space: nowrap;
  font-weight: 700;
}

/* 当前分钟指示器 */
.time-indicator {
  position: absolute;
  bottom: 0;
  width: 8px;
  height: 60%;
  background-color: var(--color-primary);
  transform: translateX(-50%);
  box-shadow: 0 0 16px var(--color-primary);
  border-radius: 4px 4px 0 0;
  z-index: 10;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .time-bar {
    height: 30vh;
    min-height: 120px;
    padding: var(--spacing-sm) 0;
  }

  .time-tick.major {
    height: 75%;
    width: 5px;
  }

  .time-tick.minor {
    height: 35%;
    width: 2px;
  }

  .time-indicator {
    height: 55%;
    width: 6px;
  }

  .tick-label {
    font-size: 14px;
    top: -30px;
  }
}
</style>