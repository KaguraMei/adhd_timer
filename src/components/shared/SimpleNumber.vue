<template>
  <span class="simple-number">{{ displayValue }}</span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

interface Props {
  value: number;
  decimals?: number;
  format?: (value: number) => string;
}

const props = withDefaults(defineProps<Props>(), {
  decimals: 0
});

const displayValue = ref('');

const formatNumber = (value: number): string => {
  if (props.format) {
    return props.format(value);
  }
  return value.toFixed(props.decimals);
};

watch(() => props.value, (newValue) => {
  displayValue.value = formatNumber(newValue);
}, { immediate: true });

onMounted(() => {
  displayValue.value = formatNumber(props.value);
});
</script>

<style scoped>
.simple-number {
  font-variant-numeric: tabular-nums;
  display: inline-block;
}
</style>
