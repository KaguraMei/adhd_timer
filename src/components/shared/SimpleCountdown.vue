<template>
  <div class="simple-countdown">
    <span class="countdown-part">{{ displayMinutes }}</span>
    <span class="countdown-separator">:</span>
    <span class="countdown-part">{{ displaySeconds }}</span>
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

const pad = (num: number): string => {
  return num.toString().padStart(2, '0');
};

const minutes = computed(() => Math.floor(props.seconds / 60));
const seconds = computed(() => props.seconds % 60);

watch(() => props.seconds, () => {
  displayMinutes.value = pad(minutes.value);
  displaySeconds.value = pad(seconds.value);
}, { immediate: true });
</script>

<style scoped>
.simple-countdown {
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
}

.countdown-separator {
  margin: 0 0.2em;
  opacity: 0.8;
}

@media (max-width: 480px) {
  .simple-countdown {
    font-size: 60px;
  }
}
</style>
