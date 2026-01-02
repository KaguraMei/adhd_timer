<template>
  <div class="progress-bar-container">
    <div 
      ref="progressBar"
      class="progress-bar-fill" 
      :style="progressStyle"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { useAnimation } from '@/composables/useAnimation';

interface Props {
  percentage: number;
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  animated: true
});

const progressBar = ref<HTMLElement | null>(null);
const { slideWidth } = useAnimation();

const progressStyle = computed(() => ({
  width: props.animated ? '0%' : `${props.percentage}%`
}));

// 初始化动画
onMounted(() => {
  if (props.animated && progressBar.value) {
    slideWidth(progressBar.value, props.percentage, 800);
  }
});

// 监听百分比变化并触发动画
watch(() => props.percentage, (newPercentage) => {
  if (props.animated && progressBar.value) {
    slideWidth(progressBar.value, newPercentage, 800);
  }
});
</script>

<style scoped>
.progress-bar-container {
  width: 100%;
  height: 8px;
  background-color: var(--color-inactive, #333);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  background-color: var(--color-primary, #FF9500);
  border-radius: 4px;
  transition: width var(--transition-slow, 0.8s) ease-in-out;
}
</style>
