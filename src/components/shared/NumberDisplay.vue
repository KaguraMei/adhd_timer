<template>
  <component 
    :is="numberComponent" 
    :value="value" 
    :duration="duration"
    :decimals="decimals"
    :format="format"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAnimation } from '../../composables/useAnimation';
import AnimatedNumber from './AnimatedNumber.vue';
import SimpleNumber from './SimpleNumber.vue';

interface Props {
  value: number;
  duration?: number;
  decimals?: number;
  format?: (value: number) => string;
}

defineProps<Props>();

const { animationsEnabled } = useAnimation();

const numberComponent = computed(() => {
  return animationsEnabled.value ? AnimatedNumber : SimpleNumber;
});
</script>
