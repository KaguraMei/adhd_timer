<template>
  <component :is="countdownComponent" :seconds="seconds" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAnimation } from '../../composables/useAnimation';
import AnimatedCountdown from './AnimatedCountdown.vue';
import SimpleCountdown from './SimpleCountdown.vue';

interface Props {
  seconds: number;
}

defineProps<Props>();

const { animationsEnabled } = useAnimation();

const countdownComponent = computed(() => {
  return animationsEnabled.value ? AnimatedCountdown : SimpleCountdown;
});
</script>
