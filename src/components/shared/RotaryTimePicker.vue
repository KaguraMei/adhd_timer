<template>
  <div class="rotary-time-picker">
    <!-- 小时选择器 -->
    <div class="rotary-picker">
      <div class="picker-title">点</div>
      <div 
        ref="hourDialRef"
        class="dial-container"
        @mousedown="startHourDrag"
        @touchstart="startHourDrag"
      >
        <svg class="dial-svg" viewBox="0 0 200 200">
          <!-- 背景圆 -->
          <circle cx="100" cy="100" r="90" class="dial-bg" />
          
          <!-- 刻度 -->
          <g v-for="h in 24" :key="h">
            <line
              :x1="100 + Math.sin((h - 1) * Math.PI / 12) * 75"
              :y1="100 - Math.cos((h - 1) * Math.PI / 12) * 75"
              :x2="100 + Math.sin((h - 1) * Math.PI / 12) * 85"
              :y2="100 - Math.cos((h - 1) * Math.PI / 12) * 85"
              :class="['dial-tick', { major: h % 6 === 0 }]"
            />
            <text
              v-if="h % 3 === 0"
              :x="100 + Math.sin((h - 1) * Math.PI / 12) * 65"
              :y="100 - Math.cos((h - 1) * Math.PI / 12) * 65"
              class="dial-number"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              {{ h - 1 }}
            </text>
          </g>
          
          <!-- 指针 -->
          <line
            :x1="100"
            :y1="100"
            :x2="100 + Math.sin(hourAngle) * 70"
            :y2="100 - Math.cos(hourAngle) * 70"
            class="dial-hand hour-hand"
          />
          
          <!-- 中心点 -->
          <circle cx="100" cy="100" r="8" class="dial-center" />
        </svg>
        
        <div class="dial-value">{{ selectedHour.toString().padStart(2, '0') }}</div>
      </div>
    </div>

    <!-- 分钟选择器 -->
    <div class="rotary-picker">
      <div class="picker-title">分</div>
      <div 
        ref="minuteDialRef"
        class="dial-container"
        @mousedown="startMinuteDrag"
        @touchstart="startMinuteDrag"
      >
        <svg class="dial-svg" viewBox="0 0 200 200">
          <!-- 背景圆 -->
          <circle cx="100" cy="100" r="90" class="dial-bg" />
          
          <!-- 刻度 -->
          <g v-for="m in 60" :key="m">
            <line
              v-if="m % 5 === 0"
              :x1="100 + Math.sin((m - 1) * Math.PI / 30) * 75"
              :y1="100 - Math.cos((m - 1) * Math.PI / 30) * 75"
              :x2="100 + Math.sin((m - 1) * Math.PI / 30) * 85"
              :y2="100 - Math.cos((m - 1) * Math.PI / 30) * 85"
              :class="['dial-tick', { major: m % 15 === 0 }]"
            />
            <text
              v-if="m % 15 === 0"
              :x="100 + Math.sin((m - 1) * Math.PI / 30) * 65"
              :y="100 - Math.cos((m - 1) * Math.PI / 30) * 65"
              class="dial-number"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              {{ m - 1 }}
            </text>
          </g>
          
          <!-- 指针 -->
          <line
            :x1="100"
            :y1="100"
            :x2="100 + Math.sin(minuteAngle) * 70"
            :y2="100 - Math.cos(minuteAngle) * 70"
            class="dial-hand minute-hand"
          />
          
          <!-- 中心点 -->
          <circle cx="100" cy="100" r="8" class="dial-center" />
        </svg>
        
        <div class="dial-value">{{ selectedMinute.toString().padStart(2, '0') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  hour: number;
  minute: number;
}

interface Emits {
  (e: 'update:hour', value: number): void;
  (e: 'update:minute', value: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const hourDialRef = ref<HTMLElement | null>(null);
const minuteDialRef = ref<HTMLElement | null>(null);

const selectedHour = ref(props.hour);
const selectedMinute = ref(props.minute);

const isDraggingHour = ref(false);
const isDraggingMinute = ref(false);

// 计算角度
const hourAngle = computed(() => (selectedHour.value * Math.PI) / 12);
const minuteAngle = computed(() => (selectedMinute.value * Math.PI) / 30);

/**
 * 计算鼠标/触摸点相对于圆心的角度
 */
const calculateAngle = (clientX: number, clientY: number, element: HTMLElement): number => {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const deltaX = clientX - centerX;
  const deltaY = clientY - centerY;
  
  let angle = Math.atan2(deltaX, -deltaY);
  if (angle < 0) angle += 2 * Math.PI;
  
  return angle;
};

/**
 * 开始拖动小时
 */
const startHourDrag = (e: MouseEvent | TouchEvent) => {
  e.preventDefault();
  isDraggingHour.value = true;
  updateHourFromEvent(e);
};

/**
 * 开始拖动分钟
 */
const startMinuteDrag = (e: MouseEvent | TouchEvent) => {
  e.preventDefault();
  isDraggingMinute.value = true;
  updateMinuteFromEvent(e);
};

/**
 * 从事件更新小时
 */
const updateHourFromEvent = (e: MouseEvent | TouchEvent) => {
  if (!hourDialRef.value) return;
  
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0]?.clientX;
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0]?.clientY;
  
  if (clientX === undefined || clientY === undefined) return;
  
  const angle = calculateAngle(clientX, clientY, hourDialRef.value);
  const hour = Math.round((angle * 12) / (2 * Math.PI)) % 24;
  
  if (hour !== selectedHour.value) {
    selectedHour.value = hour;
    emit('update:hour', hour);
  }
};

/**
 * 从事件更新分钟
 */
const updateMinuteFromEvent = (e: MouseEvent | TouchEvent) => {
  if (!minuteDialRef.value) return;
  
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0]?.clientX;
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0]?.clientY;
  
  if (clientX === undefined || clientY === undefined) return;
  
  const angle = calculateAngle(clientX, clientY, minuteDialRef.value);
  const minute = Math.round((angle * 30) / Math.PI) % 60;
  
  if (minute !== selectedMinute.value) {
    selectedMinute.value = minute;
    emit('update:minute', minute);
  }
};

/**
 * 处理拖动
 */
const handleDrag = (e: MouseEvent | TouchEvent) => {
  if (isDraggingHour.value) {
    updateHourFromEvent(e);
  } else if (isDraggingMinute.value) {
    updateMinuteFromEvent(e);
  }
};

/**
 * 停止拖动
 */
const stopDrag = () => {
  isDraggingHour.value = false;
  isDraggingMinute.value = false;
};

onMounted(() => {
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchmove', handleDrag);
  document.addEventListener('touchend', stopDrag);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchmove', handleDrag);
  document.removeEventListener('touchend', stopDrag);
});
</script>

<style scoped>
.rotary-time-picker {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  align-items: center;
  padding: var(--spacing-md) 0;
}

.rotary-picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.picker-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
}

.dial-container {
  position: relative;
  width: 200px;
  height: 200px;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}

.dial-container:active {
  cursor: grabbing;
}

.dial-svg {
  width: 100%;
  height: 100%;
}

.dial-bg {
  fill: var(--color-background);
  stroke: var(--color-inactive);
  stroke-width: 2;
}

.dial-tick {
  stroke: var(--color-inactive);
  stroke-width: 1;
  stroke-linecap: round;
}

.dial-tick.major {
  stroke: var(--color-text);
  stroke-width: 2;
}

.dial-number {
  fill: var(--color-text);
  font-size: 14px;
  font-weight: 600;
}

.dial-hand {
  stroke: var(--color-primary);
  stroke-width: 3;
  stroke-linecap: round;
  transition: all 0.1s ease-out;
}

.hour-hand {
  stroke-width: 4;
}

.minute-hand {
  stroke-width: 3;
}

.dial-center {
  fill: var(--color-primary);
}

.dial-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  font-weight: 700;
  color: var(--color-primary);
  pointer-events: none;
  text-shadow: 0 0 10px var(--color-background);
}

@media (max-width: 480px) {
  .rotary-time-picker {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .dial-container {
    width: 160px;
    height: 160px;
  }

  .dial-number {
    font-size: 12px;
  }

  .dial-value {
    font-size: 28px;
  }

  .picker-title {
    font-size: 16px;
  }
}
</style>
