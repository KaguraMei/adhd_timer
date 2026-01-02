<template>
  <div class="grid-display" :style="gridStyle">
    <div
      v-for="index in total"
      :key="index"
      ref="gridItems"
      class="grid-item"
      :class="getItemClass(index)"
    ></div>
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

// 计算网格列数
const calculatedColumns = computed(() => {
  if (props.columns > 0) return props.columns;
  
  // 自动计算列数
  if (props.total <= 31) return 7; // 月度视图
  if (props.total <= 100) return 10; // 人生视图
  return Math.ceil(Math.sqrt(props.total)); // 年度视图
});

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${calculatedColumns.value}, 1fr)`
}));

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
  height: 30vh;
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
