<template>
  <div class="grid-display" :style="gridStyle">
    <div v-for="index in total" :key="index" ref="gridItems" class="grid-item" :class="getItemClass(index)"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useAnimation } from '@/composables/useAnimation';

interface Props {
  total: number;
  current: number;
  columns?: number;
}

const props = withDefaults(defineProps<Props>(), {
  columns: 0
});

const gridItems = ref<HTMLElement[]>([]);
const { staggerGrid } = useAnimation();

// 计算网格样式
const gridStyle = computed(() => {
  // 1. 如果有明确传入列数，使用固定列数
  if (props.columns > 0) {
    return { gridTemplateColumns: `repeat(${props.columns}, 1fr)` };
  }
  
  // 2. 月度视图（31天以内），固定7列
  if (props.total <= 31) {
    return { gridTemplateColumns: `repeat(7, 1fr)` };
  }
  
  // 3. 人生视图（100天以内），固定10列
  if (props.total <= 100) {
    return { gridTemplateColumns: `repeat(10, 1fr)` };
  }
  
  // 4. 年度视图（365天），使用 auto-fill 自动填充
  // 根据方块大小自动决定每行能放多少个，放不下自动换行
  return {
    gridTemplateColumns: `repeat(auto-fill, minmax(var(--grid-size, 20px), 1fr))`
  };
});

// 判断格子状态
const getItemClass = (index: number) => {
  if (index === props.current) return 'highlight';
  if (index < props.current) return 'active';
  return 'inactive';
};

// 初始化动画
onMounted(() => {
  if (gridItems.value.length > 0) {
    staggerGrid(gridItems.value);
  }
});

// 监听变化并触发动画
watch(() => props.current, () => {
  if (gridItems.value.length > 0) {
    staggerGrid(gridItems.value, 300);
  }
});
</script>

<style scoped>
.grid-display {
  display: grid;
  gap: 5px;
  width: 100%;
  height: auto;
  /* 👈 从 30vh 改成 auto */
  min-height: 35vh;
}

.grid-item {
  width: var(--grid-size, 20px);
  height: var(--grid-size, 20px);
  /* aspect-ratio: 1 / 1; */
  border-radius: var(--border-radius-sm, 2px);
  transition: all var(--transition-fast, 0.3s) ease;
  background-color: var(--color-inactive, #333);
}

.grid-item.active {
  background-color: var(--color-secondary, #ffffff);
}

.grid-item.highlight {
  background-color: var(--color-primary, #FF9500);
  box-shadow: 0 0 10px var(--color-primary, #FF9500);
}

@media (max-width: 480px) {
  .grid-display {
    gap: 3px;
  }
}
</style>
