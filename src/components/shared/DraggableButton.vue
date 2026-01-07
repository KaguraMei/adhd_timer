<template>
  <button
    :class="['draggable-button', { dragging: isDragging }]"
    :style="buttonStyle"
    @mousedown="handleMouseDown"
    @touchstart="handleTouchStart"
    @click="handleClick"
    :aria-label="ariaLabel"
  >
    <slot>⚙️</slot>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  ariaLabel?: string;
  storageKey?: string;
}

interface Emits {
  (e: 'click'): void;
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: '按钮',
  storageKey: 'draggable-button-position'
});

const emit = defineEmits<Emits>();

const isDragging = ref(false);
const position = ref({ x: 20, y: 20 }); // 默认位置（右上角）

let startX = 0;
let startY = 0;
let startPosX = 0;
let startPosY = 0;
let longPressTimer: number | null = null;
let hasMoved = false;

const LONG_PRESS_DURATION = 500; // 长按时间（毫秒）
const MOVE_THRESHOLD = 5; // 移动阈值（像素）

/**
 * 按钮样式
 */
const buttonStyle = computed(() => ({
  right: `${position.value.x}px`,
  top: `${position.value.y}px`
}));

/**
 * 加载保存的位置
 */
const loadPosition = () => {
  try {
    const saved = localStorage.getItem(props.storageKey);
    if (saved) {
      const pos = JSON.parse(saved);
      position.value = pos;
    }
  } catch (error) {
    console.error('Failed to load button position:', error);
  }
};

/**
 * 保存位置
 */
const savePosition = () => {
  try {
    localStorage.setItem(props.storageKey, JSON.stringify(position.value));
  } catch (error) {
    console.error('Failed to save button position:', error);
  }
};

/**
 * 限制位置在视口内
 */
const constrainPosition = (x: number, y: number) => {
  const buttonSize = 50; // 按钮大小
  const padding = 10; // 边距
  
  const maxX = window.innerWidth - buttonSize - padding;
  const maxY = window.innerHeight - buttonSize - padding;
  
  return {
    x: Math.max(padding, Math.min(maxX, x)),
    y: Math.max(padding, Math.min(maxY, y))
  };
};

/**
 * 开始长按计时
 */
const startLongPress = (clientX: number, clientY: number) => {
  startX = clientX;
  startY = clientY;
  startPosX = position.value.x;
  startPosY = position.value.y;
  hasMoved = false;
  
  longPressTimer = window.setTimeout(() => {
    isDragging.value = true;
  }, LONG_PRESS_DURATION);
};

/**
 * 取消长按计时
 */
const cancelLongPress = () => {
  if (longPressTimer !== null) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
};

/**
 * 处理鼠标按下
 */
const handleMouseDown = (e: MouseEvent) => {
  e.preventDefault();
  startLongPress(e.clientX, e.clientY);
};

/**
 * 处理触摸开始
 */
const handleTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0];
  if (!touch) return;
  startLongPress(touch.clientX, touch.clientY);
};

/**
 * 处理移动
 */
const handleMove = (clientX: number, clientY: number) => {
  const deltaX = clientX - startX;
  const deltaY = clientY - startY;
  
  // 检测是否移动超过阈值
  if (!hasMoved && (Math.abs(deltaX) > MOVE_THRESHOLD || Math.abs(deltaY) > MOVE_THRESHOLD)) {
    hasMoved = true;
  }
  
  if (isDragging.value) {
    // 计算新位置（注意：right 和 top 的方向）
    const newX = startPosX - deltaX;
    const newY = startPosY + deltaY;
    
    const constrained = constrainPosition(newX, newY);
    position.value = constrained;
  }
};

/**
 * 处理鼠标移动
 */
const handleMouseMove = (e: MouseEvent) => {
  handleMove(e.clientX, e.clientY);
};

/**
 * 处理触摸移动
 */
const handleTouchMove = (e: TouchEvent) => {
  if (isDragging.value) {
    e.preventDefault(); // 防止页面滚动
  }
  const touch = e.touches[0];
  if (!touch) return;
  handleMove(touch.clientX, touch.clientY);
};

/**
 * 处理结束
 */
const handleEnd = () => {
  cancelLongPress();
  
  if (isDragging.value) {
    isDragging.value = false;
    savePosition();
  }
};

/**
 * 处理点击
 */
const handleClick = (e: MouseEvent) => {
  // 如果移动过或正在拖动，不触发点击事件
  if (hasMoved || isDragging.value) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  
  emit('click');
};

onMounted(() => {
  loadPosition();
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('touchend', handleEnd);
  document.addEventListener('touchcancel', handleEnd);
});

onUnmounted(() => {
  cancelLongPress();
  
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleEnd);
  document.removeEventListener('touchmove', handleTouchMove);
  document.removeEventListener('touchend', handleEnd);
  document.removeEventListener('touchcancel', handleEnd);
});
</script>

<style scoped>
.draggable-button {
  position: fixed;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--color-container-bg);
  border: 2px solid var(--color-inactive);
  color: var(--color-text);
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast) ease;
  z-index: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  /* 确保不会被状态栏遮挡 */
  margin-top: env(safe-area-inset-top, 0px);
  margin-right: env(safe-area-inset-right, 0px);
}

.draggable-button:hover {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  transform: rotate(90deg);
}

.draggable-button.dragging {
  cursor: grabbing;
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  border-color: var(--color-primary);
  opacity: 0.9;
}

.draggable-button.dragging:hover {
  transform: scale(1.1);
}

.draggable-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 149, 0, 0.3);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .draggable-button {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
}
</style>
