<template>
  <span class="animated-number">{{ displayValue }}</span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { animate } from 'animejs';

interface Props {
  value: number;
  duration?: number;
  decimals?: number;
  format?: (value: number) => string;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 500,
  decimals: 0
});

const displayValue = ref('');
const currentValue = ref(0);

/**
 * 格式化数字
 */
const formatNumber = (value: number): string => {
  if (props.format) {
    return props.format(value);
  }
  return value.toFixed(props.decimals);
};

/**
 * 动画到新值
 */
const animateToValue = (newValue: number) => {
  const obj = { value: currentValue.value };
  
  animate(obj, {
    value: { to: newValue },
    duration: props.duration,
    ease: 'outQuad',
    onUpdate: () => {
      currentValue.value = obj.value;
      displayValue.value = formatNumber(obj.value);
    }
  });
};

/**
 * 监听值变化
 */
watch(() => props.value, (newValue) => {
  animateToValue(newValue);
}, { immediate: true });

onMounted(() => {
  displayValue.value = formatNumber(props.value);
  currentValue.value = props.value;
});
</script>

<style scoped>
.animated-number {
  font-variant-numeric: tabular-nums;
  display: inline-block;
}
</style>
