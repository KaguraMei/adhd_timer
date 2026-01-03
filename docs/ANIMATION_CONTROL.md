# 动画控制系统

## 功能概述

ADHD Timer 提供了全局动画开关功能，允许用户完全禁用所有动画效果，以提升性能或满足无障碍需求。

## 功能特性

### 1. 全局动画开关
- 在设置抽屉中提供开关按钮
- 设置自动保存到 localStorage
- 页面刷新后保持设置

### 2. 组件降级策略
当动画被禁用时，系统会自动使用简化版本的组件：

| 动画组件 | 简化组件 | 说明 |
|---------|---------|------|
| AnimatedTime | SimpleTime | 移除冒号闪烁动画 |
| AnimatedCountdown | SimpleCountdown | 移除数字脉冲动画 |
| AnimatedNumber | SimpleNumber | 移除数字平滑过渡动画 |

### 3. CSS 动画禁用
通过 `.no-animations` 类禁用所有 CSS 动画和过渡效果：
- 按钮悬停效果
- 网格项过渡
- 进度条动画
- 淡入淡出效果

## 技术实现

### 1. useAnimation Composable

```typescript
// src/composables/useAnimation.ts
export function useAnimation() {
  const animationsEnabled = ref(true);
  
  const toggleAnimations = () => {
    animationsEnabled.value = !animationsEnabled.value;
    updateDocumentClass();
  };
  
  // 动画辅助函数
  const staggerGrid = (elements, duration) => { /* 网格交错动画 */ };
  const fadeIn = (element, duration) => { /* 淡入动画 */ };
  const fadeOut = (element, duration) => { /* 淡出动画 */ };
  const scaleIn = (element, duration) => { /* 缩放进入动画 */ };
  const moveIndicator = (element, position, duration) => { /* 移动指示器 */ };
  const slideWidth = (element, percentage, duration) => { /* 宽度滑动 */ };
  
  return {
    animationsEnabled,
    toggleAnimations,
    loadAnimationSettings,
    staggerGrid,
    fadeIn,
    fadeOut,
    scaleIn,
    moveIndicator,
    slideWidth
  };
}
```

### 动画辅助函数说明

| 函数 | 参数 | 说明 | 使用场景 |
|------|------|------|----------|
| `staggerGrid` | elements, duration | 网格项交错动画 | GridDisplay 组件 |
| `fadeIn` | element, duration | 淡入 + 向上移动 | 视图切换、模态框 |
| `fadeOut` | element, duration | 淡出 + 向下移动 | 视图切换、模态框 |
| `scaleIn` | element, duration | 缩放进入动画 | 模态框内容 |
| `moveIndicator` | element, position, duration | 移动到指定位置 | TimeBar 指示器 |
| `slideWidth` | element, percentage, duration | 宽度动画 | ProgressBar |

所有动画函数在禁用动画时会自动降级为直接设置样式，无动画效果。

### 2. 包装组件

创建了三个包装组件，根据动画开关自动选择使用哪个版本：

```vue
<!-- TimeDisplay.vue -->
<template>
  <component :is="timeComponent" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAnimation } from '../../composables/useAnimation';
import AnimatedTime from './AnimatedTime.vue';
import SimpleTime from './SimpleTime.vue';

const { animationsEnabled } = useAnimation();

const timeComponent = computed(() => {
  return animationsEnabled.value ? AnimatedTime : SimpleTime;
});
</script>
```

### 3. CSS 全局禁用

```css
/* src/style.css */
.no-animations,
.no-animations * {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}
```

## 使用方法

### 用户操作

1. 点击右上角设置按钮（⚙️）
2. 滚动到"动画设置"部分
3. 切换"启用动画效果"开关
4. 设置自动保存，立即生效

### 开发者使用

在任何组件中使用包装组件：

```vue
<template>
  <!-- 使用包装组件，自动根据设置选择版本 -->
  <TimeDisplay />
  <CountdownDisplay :seconds="60" />
  <NumberDisplay :value="42" />
</template>

<script setup lang="ts">
import TimeDisplay from '@/components/shared/TimeDisplay.vue';
import CountdownDisplay from '@/components/shared/CountdownDisplay.vue';
import NumberDisplay from '@/components/shared/NumberDisplay.vue';
</script>
```

## 组件对比

### AnimatedTime vs SimpleTime

**AnimatedTime**:
- 冒号每秒闪烁（透明度 1 ↔ 0.3）
- CSS 动画

**SimpleTime**:
- 冒号固定透明度 0.8
- 无动画

### AnimatedCountdown vs SimpleCountdown

**AnimatedCountdown**:
- 数字变化时脉冲效果（scale 1 → 1.05 → 1）
- CSS 动画

**SimpleCountdown**:
- 数字直接更新
- 无动画

### AnimatedNumber vs SimpleNumber

**AnimatedNumber**:
- 使用 Anime.js 平滑过渡
- 数字从旧值动画到新值
- 可配置动画时长和缓动函数

**SimpleNumber**:
- 数字直接更新
- 无动画

## 性能优势

禁用动画后的性能提升：

1. **减少 CPU 使用**
   - 无需计算动画帧
   - 无需运行 Anime.js 引擎

2. **减少重绘**
   - 无 CSS 动画触发的重绘
   - 无过渡效果的中间状态

3. **降低内存占用**
   - 不加载 Anime.js 动画组件
   - 减少定时器和事件监听器

4. **提升响应速度**
   - UI 更新立即生效
   - 无动画延迟

## 无障碍支持

动画禁用功能符合 WCAG 2.1 无障碍标准：

- **减少动作** (Success Criterion 2.3.3)
  - 允许用户禁用非必要动画
  
- **用户偏好** (Success Criterion 1.4.12)
  - 尊重用户对动画的偏好设置

## 浏览器兼容性

- ✅ Chrome/Edge 89+
- ✅ Firefox 108+
- ✅ Safari 16.4+
- ✅ 所有现代浏览器

## 未来改进

1. **自动检测系统偏好**
   - 检测 `prefers-reduced-motion` 媒体查询
   - 自动应用用户系统设置

2. **细粒度控制**
   - 分别控制不同类型的动画
   - UI 动画 vs 数据动画

3. **性能监控**
   - 显示动画对性能的影响
   - 提供性能建议

## 相关文件

- `src/composables/useAnimation.ts` - 动画控制逻辑
- `src/components/shared/TimeDisplay.vue` - 时间显示包装组件
- `src/components/shared/CountdownDisplay.vue` - 倒计时包装组件
- `src/components/shared/NumberDisplay.vue` - 数字显示包装组件
- `src/components/shared/SimpleTime.vue` - 简化时间组件
- `src/components/shared/SimpleCountdown.vue` - 简化倒计时组件
- `src/components/shared/SimpleNumber.vue` - 简化数字组件
- `src/style.css` - 全局动画禁用样式
