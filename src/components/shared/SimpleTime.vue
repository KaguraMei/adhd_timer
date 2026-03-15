<template>
  <div class="simple-time">
    <span class="time-part">{{ hours }}</span>
    <span class="time-separator">:</span>
    <span class="time-part">{{ minutes }}</span>
    <span class="time-separator">:</span>
    <span class="time-part">{{ seconds }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTimeStore } from '../../stores/time';

const timeStore = useTimeStore();

const pad = (num: number): string => {
  return num.toString().padStart(2, '0');
};

/**
 * 使用全局时间存储，响应式更新
 */
const hours = computed(() => {
  // 触发响应式依赖
  timeStore.timestamp;
  return pad(timeStore.currentTime.getHours());
});

const minutes = computed(() => {
  // 触发响应式依赖
  timeStore.timestamp;
  return pad(timeStore.currentTime.getMinutes());
});

const seconds = computed(() => {
  // 触发响应式依赖
  timeStore.timestamp;
  return pad(timeStore.currentTime.getSeconds());
});
</script>

<style scoped>
.simple-time {
  display: inline-flex;
  align-items: center;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}

.time-part {
  display: inline-block;
  min-width: 1.2em;
  text-align: center;
}

.time-separator {
  margin: 0 0.1em;
  opacity: 0.8;
}
</style>
