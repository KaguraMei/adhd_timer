<template>
  <div class="animated-countdown">
    <span ref="minutesRef" class="countdown-part">{{ displayMinutes }}</span>
    <span class="countdown-separator">:</span>
    <span ref="secondsRef" class="countdown-part">{{ displaySeconds }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

interface Props {
  seconds: number;
}

const props = defineProps<Props>();

const displayMinutes = ref('00');
const displaySeconds = ref('00');

/**
 * 格式化数字为两位
 */
const pad = (num: number): string => {
  return num.toString().padStart(2, '0');
};

/**
 * 计算分钟和秒
 */
const minutes = computed(() => Math.floor(props.seconds / 60));
const seconds = computed(() => props.seconds % 60);

/**
 * 监听时间变化
 */
watch(() => props.seconds, () => {
  displayMinutes.value = pad(minutes.value);
  displaySeconds.value = pad(seconds.value);
}, { immediate: true });
</script>

<style scoped>
.animated-countdown {
  display: inline-flex;
  align-items: center;
  font-variant-numeric: tabular-nums;
  font-weight: 300;
  font-size: 72px;
  line-height: 1;
}

.countdown-part {
  display: inline-block;
  min-width: 1.5em;
  text-align: center;
  transition: transform 0.3s ease;
}

.countdown-separator {
  margin: 0 0.2em;
  opacity: 0.8;
}

/* 当数字变化时的动画效果 */
.countdown-part {
  animation: pulse 0.3s ease;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@media (max-width: 480px) {
  .animated-countdown {
    font-size: 60px;
  }
}
</style>
