<template>
  <div class="time-bar">
    <div class="time-bar-content">
      <!-- 时间刻度线 -->
      <div
        v-for="tick in ticks"
        :key="tick.position"
        :class="['time-tick', tick.type]"
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useAnimation } from '../../composables/useAnimation';

interface TimeTick {
  position: number;
  type: 'major' | 'minor';
  label?: string;
}

const { moveIndicator } = useAnimation();

const currentHour = ref(0);
const currentMinute = ref(0);
const currentSecond = ref(0);
const indicatorRef = ref<HTMLElement | null>(null);
const previousHour = ref(-1);

let updateInterval: number | null = null;

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
    
    result.push({
      position,
      type: 'major',
      label: `${displayHour.toString().padStart(2, '0')}:${displayMinute.toString().padStart(2, '0')}`
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
 * 更新时间状态
 */
const updateTime = () => {
  const now = new Date();
  const newHour = now.getHours();
  const newMinute = now.getMinutes();
  const newSecond = now.getSeconds();

  // 检测小时变更
  if (previousHour.value !== -1 && previousHour.value !== newHour) {
    // 小时变更，重置时间条（触发重新渲染）
    currentHour.value = newHour;
    currentMinute.value = 0;
    currentSecond.value = 0;
    previousHour.value = newHour;
    
    // 下一帧更新到实际时间
    setTimeout(() => {
      currentMinute.value = newMinute;
      currentSecond.value = newSecond;
    }, 50);
  } else {
    currentHour.value = newHour;
    currentMinute.value = newMinute;
    currentSecond.value = newSecond;
    previousHour.value = newHour;
  }
};

/**
 * 使用 Anime.js 平滑移动指示器
 */
watch(indicatorPosition, (newPosition) => {
  if (indicatorRef.value) {
    moveIndicator(indicatorRef.value, newPosition, 1000);
  }
});

/**
 * 组件挂载时启动定时器
 */
onMounted(() => {
  updateTime();
  updateInterval = window.setInterval(updateTime, 1000);
});

/**
 * 组件卸载时清理定时器
 */
onUnmounted(() => {
  if (updateInterval !== null) {
    clearInterval(updateInterval);
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
  background-color: var(--color-inactive);
}

.time-tick.minor {
  width: 3px;
  height: 40%;
  background-color: var(--color-inactive);
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
