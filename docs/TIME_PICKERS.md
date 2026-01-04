# 时间选择器组件

本项目提供两种风格的时间选择器，适用于不同的使用场景。

## 组件对比

| 特性 | 旋转选择器 | 无限滚动选择器 |
|------|-----------|---------------|
| 交互方式 | 拖动旋转表盘 | 滚动列表 |
| 视觉风格 | 时钟表盘 | iOS 原生 |
| 空间占用 | 较大（双表盘） | 较小（单列表） |
| 精确度 | 高（可精确点击） | 高（自动对齐） |
| 触摸友好度 | 高 | 高 |
| 学习成本 | 低（类似时钟） | 低（类似 iOS） |

## 1. 旋转时间选择器

### 功能说明

类似传统时钟表盘的交互方式，通过拖动旋转来设置时间。

### 特性

- **双表盘设计**：左侧小时（0-23），右侧分钟（0-59）
- **拖动旋转**：点击并拖动表盘上的任意位置
- **直接点击**：点击表盘上的任意位置快速跳转
- **视觉反馈**：刻度线、数字标签、彩色指针

### 使用方法

```vue
<template>
  <RotaryTimePicker
    :hour="selectedHour"
    :minute="selectedMinute"
    @update:hour="handleHourChange"
    @update:minute="handleMinuteChange"
  />
</template>

<script setup>
import { ref } from 'vue';
import RotaryTimePicker from '@/components/shared/RotaryTimePicker.vue';

const selectedHour = ref(10);
const selectedMinute = ref(30);

const handleHourChange = (hour) => {
  selectedHour.value = hour;
};

const handleMinuteChange = (minute) => {
  selectedMinute.value = minute;
};
</script>
```

### 实现原理

#### 角度计算

```typescript
// 计算鼠标/触摸点相对于圆心的角度
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
```

#### 角度转换为时间

```typescript
// 小时：24 小时制
const hour = Math.round((angle * 12) / (2 * Math.PI)) % 24;

// 分钟：60 分钟
const minute = Math.round((angle * 30) / Math.PI) % 60;
```

### 适用场景

- ✅ 设置每日开始时间
- ✅ 设置闹钟时间
- ✅ 设置倒计时时间
- ✅ 任何需要直观设置时间的场景

---

## 2. 无限滚动选择器

### 功能说明

iOS 风格的滚动选择器，支持无限滚动，用户可以无限向上或向下滚动。

### 特性

- **无限滚动**：可以一直向上或向下滚动，没有边界
- **自动对齐**：滚动停止时自动对齐到最近的项
- **三重复制**：通过重复列表内容实现无限滚动
- **无缝体验**：边界跳转时用户感觉不到

### 使用方法

```vue
<template>
  <IOSTimePicker
    :hour="selectedHour"
    :minute="selectedMinute"
    @update:hour="handleHourChange"
    @update:minute="handleMinuteChange"
  />
</template>

<script setup>
import { ref } from 'vue';
import IOSTimePicker from '@/components/shared/IOSTimePicker.vue';

const selectedHour = ref(10);
const selectedMinute = ref(30);

const handleHourChange = (hour) => {
  selectedHour.value = hour;
};

const handleMinuteChange = (minute) => {
  selectedMinute.value = minute;
};
</script>
```

### 实现原理

#### 三重复制技巧

将列表内容重复 3 次：

```vue
<template v-for="repeat in 3" :key="`hour-repeat-${repeat}`">
  <div v-for="h in hours" :key="`hour-${repeat}-${h}`">
    {{ h }}
  </div>
</template>
```

**结构示例：**
```
[第1组] 0, 1, 2, ..., 23
[第2组] 0, 1, 2, ..., 23  ← 初始显示这组
[第3组] 0, 1, 2, ..., 23
```

#### 边界检测与跳转

```typescript
const handleScroll = () => {
  const scrollTop = scrollRef.value.scrollTop;
  const singleGroupHeight = ITEM_COUNT * ITEM_HEIGHT;
  
  // 接近顶部，跳转到中间组
  if (scrollTop < singleGroupHeight * 0.5) {
    scrollRef.value.scrollTop = scrollTop + singleGroupHeight;
  } 
  // 接近底部，跳转到中间组
  else if (scrollTop > singleGroupHeight * 2.5) {
    scrollRef.value.scrollTop = scrollTop - singleGroupHeight;
  }
};
```

#### 模运算计算实际值

```typescript
// 无论在哪一组，都能正确计算出实际值
const index = Math.round(scrollTop / ITEM_HEIGHT) % ITEM_COUNT;
const value = Math.max(0, Math.min(maxValue, index));
```

### 适用场景

- ✅ 设置时间
- ✅ 设置日期（年、月、日）
- ✅ 设置其他数值（年龄、数量等）
- ✅ 需要节省空间的场景

---

## 选择建议

### 使用旋转选择器，如果：
- 需要直观的时钟表盘界面
- 用户习惯传统时钟
- 有足够的显示空间
- 需要快速精确点击

### 使用无限滚动选择器，如果：
- 需要节省显示空间
- 用户习惯 iOS 风格
- 需要选择多种类型的数值（不仅是时间）
- 需要更紧凑的界面

## Props 对比

### 共同 Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| hour | number | 是 | 当前小时（0-23） |
| minute | number | 是 | 当前分钟（0-59） |

### 共同 Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:hour | (hour: number) | 小时改变时触发 |
| update:minute | (minute: number) | 分钟改变时触发 |

## 性能对比

| 指标 | 旋转选择器 | 无限滚动选择器 |
|------|-----------|---------------|
| DOM 元素数量 | ~100 | ~250 |
| 内存占用 | 低 | 低 |
| 渲染性能 | 优秀 | 优秀 |
| 滚动性能 | N/A | 优秀 |

## 相关文件

- `src/components/shared/RotaryTimePicker.vue` - 旋转时间选择器
- `src/components/shared/IOSTimePicker.vue` - 无限滚动选择器
- `src/components/settings/SettingsDrawer.vue` - 使用示例

## 更多信息

- 详细的旋转选择器文档：[ROTARY_TIME_PICKER.md](./ROTARY_TIME_PICKER.md)
- 详细的无限滚动选择器文档：[INFINITE_SCROLL_PICKER.md](./INFINITE_SCROLL_PICKER.md)
