<template>
  <div class="countdown-view">
    <div class="view-header">
      <div class="current-info">{{ statusText }}</div>
      <h2 class="countdown-title">倒计时</h2>
    </div>
    <div class="countdown-content">
      <!-- 时间选择器 -->
      <div class="time-selector">
        <div class="selected-time">{{ selectedMinutes }} 分钟</div>
        <div class="slider-container">
          <input
            type="range"
            min="1"
            max="60"
            v-model.number="selectedMinutes"
            :disabled="isRunning"
            class="time-slider"
            @input="handleSliderChange"
          />
          <div class="slider-ticks">
            <span 
              v-for="tick in ticks" 
              :key="tick" 
              class="tick"
              :style="{ left: `${(tick / 60) * 100}%` }"
            >
              {{ tick }}
            </span>
          </div>
        </div>
      </div>

      <!-- 倒计时显示 -->
      <div class="countdown-display">
        <CountdownDisplay :seconds="remainingSeconds" />
      </div>

      <!-- 进度条 -->
      <ProgressBar :percentage="progress" />

      <!-- 控制按钮 -->
      <div class="controls">
        <button 
          v-if="!isRunning && remainingSeconds > 0 && remainingSeconds < totalSeconds"
          @click="reset"
          class="control-button reset-button"
        >
          重置
        </button>
        <button 
          @click="toggleTimer"
          class="control-button primary-button"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useTimer } from '@/composables/useTimer';
import ProgressBar from '@/components/shared/ProgressBar.vue';
import CountdownDisplay from '@/components/shared/CountdownDisplay.vue';

const {
  totalSeconds,
  remainingSeconds,
  isRunning,
  progress,
  start,
  pause,
  reset,
  setDuration
} = useTimer();

// 选择的分钟数
const selectedMinutes = computed({
  get: () => Math.round(totalSeconds.value / 60) || 25,
  set: (value: number) => {
    if (!isRunning.value) {
      setDuration(value);
    }
  }
});

// 状态文本（左上角）
const statusText = computed(() => {
  if (isRunning.value) return '进行中';
  if (remainingSeconds.value === 0) return '已完成';
  return '待开始';
});

// 刻度线（每5分钟）
const ticks = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

// 按钮文本
const buttonText = computed(() => {
  if (remainingSeconds.value === 0) return '重置';
  return isRunning.value ? '暂停' : '开始';
});

// 处理滑动条变化
const handleSliderChange = async () => {
  if (!isRunning.value) {
    await setDuration(selectedMinutes.value);
  }
};

// 切换计时器状态
const toggleTimer = async () => {
  if (remainingSeconds.value === 0) {
    await reset();
  } else if (isRunning.value) {
    await pause();
  } else {
    await start();
  }
};

// 初始化默认时长
watch(() => totalSeconds.value, async (newValue) => {
  if (newValue === 0) {
    await setDuration(25);
  }
}, { immediate: true });
</script>

<style scoped>
.countdown-view {
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

.countdown-title {
  font-size: 48px;
  font-weight: 300;
  text-align: center;
  margin: 0;
  color: var(--color-text, #ffffff);
}

.countdown-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg, 30px);
}

.time-selector {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm, 10px);
}

.selected-time {
  font-size: 24px;
  text-align: center;
  color: var(--color-text, #ffffff);
  font-weight: 300;
}

.slider-container {
  position: relative;
  padding-bottom: var(--spacing-lg, 30px);
}

.time-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: var(--color-inactive, #333);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

.time-slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.time-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary, #FF9500);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.time-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.time-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary, #FF9500);
  cursor: pointer;
  border: none;
  transition: transform 0.2s ease;
}

.time-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
}

.slider-ticks {
  position: absolute;
  top: 25px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
}

.tick {
  position: absolute;
  transform: translateX(-50%);
  font-size: 12px;
  color: var(--color-muted, #888);
}

.countdown-display {
  text-align: center;
  padding: var(--spacing-md, 20px) 0;
}

.controls {
  display: flex;
  gap: var(--spacing-sm, 10px);
  justify-content: center;
  align-items: center;
}

.control-button {
  padding: 12px 30px;
  font-size: 16px;
  border: none;
  border-radius: var(--border-radius-lg, 30px);
  cursor: pointer;
  transition: all var(--transition-fast, 0.3s) ease;
  font-weight: 500;
  min-width: 100px;
}

.primary-button {
  background-color: var(--color-primary, #FF9500);
  color: var(--color-background, #000);
}

.primary-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 149, 0, 0.3);
}

.reset-button {
  background-color: var(--color-inactive, #333);
  color: var(--color-text, #ffffff);
}

.reset-button:hover {
  background-color: #444;
}

.control-button:active {
  transform: scale(0.95);
}

@media (max-width: 480px) {
  .current-info {
    font-size: 24px;
  }
  
  .countdown-title {
    font-size: 40px;
  }
  
  .countdown-view {
    padding: var(--spacing-sm, 10px);
  }
  
  .selected-time {
    font-size: 20px;
  }
  
  .control-button {
    padding: 10px 24px;
    font-size: 14px;
    min-width: 80px;
  }
}
</style>
