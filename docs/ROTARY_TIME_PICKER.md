# 旋转时间选择器

## 功能说明

旋转时间选择器（RotaryTimePicker）是一个可以通过拖动旋转来设置时间的组件，类似传统时钟表盘的交互方式。

## 特性

### 1. 双表盘设计
- **小时表盘**：0-23 小时，24 小时制
- **分钟表盘**：0-59 分钟

### 2. 交互方式
- **拖动旋转**：点击并拖动表盘上的任意位置，指针会跟随旋转
- **直接点击**：点击表盘上的任意位置，指针会立即跳转到该位置
- **触摸支持**：完全支持触摸屏设备

### 3. 视觉反馈
- **刻度线**：
  - 小时表盘：每小时一个刻度，每 6 小时一个粗刻度
  - 分钟表盘：每 5 分钟一个刻度，每 15 分钟一个粗刻度
- **数字标签**：
  - 小时表盘：0, 3, 6, 9, 12, 15, 18, 21
  - 分钟表盘：0, 15, 30, 45
- **指针**：
  - 小时指针：较粗（4px）
  - 分钟指针：较细（3px）
  - 颜色：主题色（--color-primary）
- **中心值显示**：表盘中心显示当前选中的数值

## 使用方法

### 基本用法

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
  console.log('Hour changed to:', hour);
};

const handleMinuteChange = (minute) => {
  selectedMinute.value = minute;
  console.log('Minute changed to:', minute);
};
</script>
```

## Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| hour | number | 是 | - | 当前小时（0-23） |
| minute | number | 是 | - | 当前分钟（0-59） |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:hour | (hour: number) | 小时改变时触发 |
| update:minute | (minute: number) | 分钟改变时触发 |

## 实现原理

### 1. 角度计算

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

### 2. 角度转换为时间

```typescript
// 小时：24 小时制，360° / 24 = 15° 每小时
const hour = Math.round((angle * 12) / (2 * Math.PI)) % 24;

// 分钟：60 分钟，360° / 60 = 6° 每分钟
const minute = Math.round((angle * 30) / Math.PI) % 60;
```

### 3. 时间转换为角度

```typescript
// 小时角度
const hourAngle = (selectedHour.value * Math.PI) / 12;

// 分钟角度
const minuteAngle = (selectedMinute.value * Math.PI) / 30;
```

### 4. 拖动处理

```typescript
// 开始拖动
const startDrag = (e: MouseEvent | TouchEvent) => {
  e.preventDefault();
  isDragging.value = true;
  updateFromEvent(e);
};

// 拖动中
const handleDrag = (e: MouseEvent | TouchEvent) => {
  if (isDragging.value) {
    updateFromEvent(e);
  }
};

// 停止拖动
const stopDrag = () => {
  isDragging.value = false;
};
```

## 样式特点

### 1. 响应式设计
- 桌面端：200x200px 表盘
- 移动端：160x160px 表盘，垂直排列

### 2. 主题适配
- 使用 CSS 变量，自动适配明亮/暗黑主题
- 背景色：`--color-background`
- 文本色：`--color-text`
- 主题色：`--color-primary`
- 非活动色：`--color-inactive`

### 3. 交互反馈
- 鼠标悬停：光标变为 `grab`
- 拖动中：光标变为 `grabbing`
- 指针平滑过渡：`transition: all 0.1s ease-out`

## 优势

### 相比 IOSTimePicker（滚动选择器）

| 特性 | RotaryTimePicker | IOSTimePicker |
|------|------------------|---------------|
| 交互方式 | 拖动旋转 | 滚动列表 |
| 视觉效果 | 时钟表盘，直观 | 列表，简洁 |
| 空间占用 | 较大（双表盘） | 较小（单列表） |
| 精确度 | 高（可精确点击） | 中（需要滚动对齐） |
| 学习成本 | 低（类似时钟） | 低（类似 iOS） |
| 触摸友好度 | 高 | 高 |
| 适用场景 | 时间设置 | 任意数值选择 |

## 使用场景

### 适合使用 RotaryTimePicker 的场景
- ✅ 设置每日开始时间
- ✅ 设置闹钟时间
- ✅ 设置倒计时时间
- ✅ 任何需要设置时间的场景

### 适合使用 IOSTimePicker 的场景
- ✅ 设置日期（年、月、日）
- ✅ 设置其他数值（年龄、数量等）
- ✅ 需要节省空间的场景

## 测试验证

### 测试 1：拖动旋转
1. 打开设置面板
2. 找到"每日开始时间"设置
3. 点击小时表盘并拖动
4. **预期**：指针跟随鼠标旋转，中心数值实时更新

### 测试 2：直接点击
1. 点击表盘上的任意位置
2. **预期**：指针立即跳转到该位置

### 测试 3：精确设置
1. 尝试设置小时为 22
2. 尝试设置分钟为 30
3. **预期**：可以精确设置到目标值

### 测试 4：触摸支持
1. 在触摸屏设备上测试
2. 使用手指拖动表盘
3. **预期**：交互流畅，无延迟

### 测试 5：响应式
1. 在不同屏幕尺寸下测试
2. **预期**：
   - 桌面端：双表盘水平排列
   - 移动端：双表盘垂直排列，尺寸适配

## 相关文件

- `src/components/shared/RotaryTimePicker.vue` - 旋转时间选择器组件
- `src/components/shared/IOSTimePicker.vue` - iOS 风格滚动选择器（备选）
- `src/components/settings/SettingsDrawer.vue` - 使用旋转选择器的设置面板
