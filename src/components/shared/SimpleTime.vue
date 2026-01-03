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
import { ref, onMounted, onUnmounted } from 'vue';

const hours = ref('00');
const minutes = ref('00');
const seconds = ref('00');

let updateInterval: number | null = null;

const pad = (num: number): string => {
  return num.toString().padStart(2, '0');
};

const updateTime = () => {
  const now = new Date();
  hours.value = pad(now.getHours());
  minutes.value = pad(now.getMinutes());
  seconds.value = pad(now.getSeconds());
};

onMounted(() => {
  updateTime();
  updateInterval = window.setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (updateInterval !== null) {
    clearInterval(updateInterval);
  }
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
