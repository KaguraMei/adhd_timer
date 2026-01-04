<template>
  <div class="ios-time-picker">
    <div class="picker-container">
      <!-- 小时选择器 -->
      <div class="picker-column">
        <div class="picker-label">点</div>
        <div 
          ref="hourScrollRef"
          class="picker-scroll"
          @scroll="handleHourScroll"
        >
          <div class="picker-padding"></div>
          <!-- 重复3次以实现无限滚动效果 -->
          <template v-for="repeat in 3" :key="`hour-repeat-${repeat}`">
            <div
              v-for="h in hours"
              :key="`hour-${repeat}-${h}`"
              :class="['picker-item', { active: h === selectedHour && repeat === 2 }]"
              @click="selectHour(h)"
            >
              {{ h.toString().padStart(2, '0') }}
            </div>
          </template>
          <div class="picker-padding"></div>
        </div>
      </div>

      <!-- 分钟选择器 -->
      <div class="picker-column">
        <div class="picker-label">分</div>
        <div 
          ref="minuteScrollRef"
          class="picker-scroll"
          @scroll="handleMinuteScroll"
        >
          <div class="picker-padding"></div>
          <!-- 重复3次以实现无限滚动效果 -->
          <template v-for="repeat in 3" :key="`minute-repeat-${repeat}`">
            <div
              v-for="m in minutes"
              :key="`minute-${repeat}-${m}`"
              :class="['picker-item', { active: m === selectedMinute && repeat === 2 }]"
              @click="selectMinute(m)"
            >
              {{ m.toString().padStart(2, '0') }}
            </div>
          </template>
          <div class="picker-padding"></div>
        </div>
      </div>
    </div>

    <!-- 选中指示器 -->
    <div class="picker-indicator"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';

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

const hourScrollRef = ref<HTMLElement | null>(null);
const minuteScrollRef = ref<HTMLElement | null>(null);

const selectedHour = ref(props.hour);
const selectedMinute = ref(props.minute);

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

const ITEM_HEIGHT = 40;
const HOUR_COUNT = 24;
const MINUTE_COUNT = 60;

let isScrolling = false;
let isAdjusting = false; // 标记是否正在调整位置

const selectHour = (hour: number) => {
  selectedHour.value = hour;
  emit('update:hour', hour);
  scrollToHour(hour, true);
};

const selectMinute = (minute: number) => {
  selectedMinute.value = minute;
  emit('update:minute', minute);
  scrollToMinute(minute, true);
};

/**
 * 滚动到指定小时（在中间的重复组）
 */
const scrollToHour = (hour: number, smooth = false) => {
  if (!hourScrollRef.value || isAdjusting) return;
  // 滚动到中间的重复组（第2组，索引为1）
  const scrollTop = (HOUR_COUNT + hour) * ITEM_HEIGHT;
  hourScrollRef.value.scrollTo({
    top: scrollTop,
    behavior: smooth ? 'smooth' : 'auto'
  });
};

/**
 * 滚动到指定分钟（在中间的重复组）
 */
const scrollToMinute = (minute: number, smooth = false) => {
  if (!minuteScrollRef.value || isAdjusting) return;
  // 滚动到中间的重复组（第2组，索引为1）
  const scrollTop = (MINUTE_COUNT + minute) * ITEM_HEIGHT;
  minuteScrollRef.value.scrollTo({
    top: scrollTop,
    behavior: smooth ? 'smooth' : 'auto'
  });
};

/**
 * 处理小时滚动 - 实现无限滚动
 */
const handleHourScroll = () => {
  if (!hourScrollRef.value || isScrolling || isAdjusting) return;
  
  const scrollTop = hourScrollRef.value.scrollTop;
  const singleGroupHeight = HOUR_COUNT * ITEM_HEIGHT;
  
  // 检测是否需要循环
  if (scrollTop < singleGroupHeight * 0.5) {
    // 接近顶部，跳转到中间组
    isAdjusting = true;
    hourScrollRef.value.scrollTop = scrollTop + singleGroupHeight;
    nextTick(() => {
      isAdjusting = false;
    });
  } else if (scrollTop > singleGroupHeight * 2.5) {
    // 接近底部，跳转到中间组
    isAdjusting = true;
    hourScrollRef.value.scrollTop = scrollTop - singleGroupHeight;
    nextTick(() => {
      isAdjusting = false;
    });
  }
  
  // 计算当前选中的小时
  const index = Math.round(scrollTop / ITEM_HEIGHT) % HOUR_COUNT;
  const hour = Math.max(0, Math.min(23, index));
  
  if (hour !== selectedHour.value) {
    selectedHour.value = hour;
    emit('update:hour', hour);
  }
};

/**
 * 处理分钟滚动 - 实现无限滚动
 */
const handleMinuteScroll = () => {
  if (!minuteScrollRef.value || isScrolling || isAdjusting) return;
  
  const scrollTop = minuteScrollRef.value.scrollTop;
  const singleGroupHeight = MINUTE_COUNT * ITEM_HEIGHT;
  
  // 检测是否需要循环
  if (scrollTop < singleGroupHeight * 0.5) {
    // 接近顶部，跳转到中间组
    isAdjusting = true;
    minuteScrollRef.value.scrollTop = scrollTop + singleGroupHeight;
    nextTick(() => {
      isAdjusting = false;
    });
  } else if (scrollTop > singleGroupHeight * 2.5) {
    // 接近底部，跳转到中间组
    isAdjusting = true;
    minuteScrollRef.value.scrollTop = scrollTop - singleGroupHeight;
    nextTick(() => {
      isAdjusting = false;
    });
  }
  
  // 计算当前选中的分钟
  const index = Math.round(scrollTop / ITEM_HEIGHT) % MINUTE_COUNT;
  const minute = Math.max(0, Math.min(59, index));
  
  if (minute !== selectedMinute.value) {
    selectedMinute.value = minute;
    emit('update:minute', minute);
  }
};

watch(() => props.hour, (newHour) => {
  if (newHour !== selectedHour.value) {
    selectedHour.value = newHour;
    scrollToHour(newHour);
  }
});

watch(() => props.minute, (newMinute) => {
  if (newMinute !== selectedMinute.value) {
    selectedMinute.value = newMinute;
    scrollToMinute(newMinute);
  }
});

onMounted(() => {
  isScrolling = true;
  // 初始化时滚动到中间组
  scrollToHour(props.hour);
  scrollToMinute(props.minute);
  setTimeout(() => {
    isScrolling = false;
  }, 100);
});
</script>

<style scoped>
.ios-time-picker {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: var(--color-background);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.picker-container {
  display: flex;
  height: 100%;
  gap: var(--spacing-md);
  padding: 0 var(--spacing-lg);
}

.picker-column {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
}

.picker-label {
  position: absolute;
  top: 50%;
  right: -30px;
  transform: translateY(-50%);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  z-index: 10;
  pointer-events: none;
}

.picker-scroll {
  flex: 1;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.picker-scroll::-webkit-scrollbar {
  display: none;
}

.picker-padding {
  height: 80px;
  flex-shrink: 0;
}

.picker-item {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--color-inactive);
  cursor: pointer;
  transition: all 0.2s ease;
  scroll-snap-align: center;
  user-select: none;
}

.picker-item:hover {
  color: var(--color-text);
}

.picker-item.active {
  color: var(--color-text);
  font-weight: 700;
  font-size: 24px;
}

.picker-indicator {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 40px;
  transform: translateY(-50%);
  border-top: 2px solid var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
  pointer-events: none;
  opacity: 0.3;
}

@media (max-width: 480px) {
  .ios-time-picker {
    height: 180px;
  }

  .picker-item {
    font-size: 18px;
  }

  .picker-item.active {
    font-size: 22px;
  }

  .picker-label {
    font-size: 16px;
    right: -25px;
  }
}
</style>
