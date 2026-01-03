<template>
  <component :is="timeComponent" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAnimation } from '../../composables/useAnimation';
import AnimatedTime from './AnimatedTime.vue';
import SimpleTime from './SimpleTime.vue';

const { animationsEnabled } = useAnimation();

const timeComponent = computed(() => {
  return animationsEnabled.value ? AnimatedTime : SimpleTime;
});
</script>
