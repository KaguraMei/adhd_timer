# iOS 风格无限滚动选择器

## 功能说明

IOSTimePicker 现在实现了 iOS 原生选择器的无限滚动效果，用户可以无限向上或向下滚动，不会遇到边界。

## 实现原理

### 1. 三重复制技巧

将列表内容重复 3 次：

```vue
<template v-for="repeat in 3" :key="`hour-repeat-${repeat}`">
  <div v-for="h in hours" :key="`hour-${repeat}-${h}`">
    {{ h }}
  </div>
</template>
```

**结构示例（小时）：**
```
[第1组] 0, 1, 2, ..., 23
[第2组] 0, 1, 2, ..., 23  ← 初始显示这组
[第3组] 0, 1, 2, ..., 23
```

### 2. 初始位置

初始化时滚动到中间组（第2组）：

```typescript
const scrollToHour = (hour: number) => {
  // 滚动到中间组：24 + hour
  const scrollTop = (HOUR_COUNT + hour) * ITEM_HEIGHT;
  hourScrollRef.value.scrollTo({ top: scrollTop });
};
```

### 3. 边界检测与跳转

当用户滚动接近边界时，无缝跳转到对应位置：

```typescript
const handleHourScroll = () => {
  const scrollTop = hourScrollRef.value.scrollTop;
  const singleGroupHeight = HOUR_COUNT * ITEM_HEIGHT;
  
  // 接近顶部（第1组的一半）
  if (scrollTop < singleGroupHeight * 0.5) {
    // 跳转到第2组的相同位置
    hourScrollRef.value.scrollTop = scrollTop + singleGroupHeight;
  } 
  // 接近底部（第3组的一半）
  else if (scrollTop > singleGroupHeight * 2.5) {
    // 跳转到第2组的相同位置
    hourScrollRef.value.scrollTop = scrollTop - singleGroupHeight;
  }
};
```

### 4. 视觉示意图

```
用户视角：
┌─────────┐
│   ...   │
│   22    │
│   23    │  ← 向上滚动
│ ▶ 00 ◀  │  ← 当前选中
│   01    │  ← 向下滚动
│   02    │
│   ...   │
└─────────┘

实际结构：
┌─────────────┐
│ [第1组]     │
│  0-23       │ ← 接近这里时跳转到第2组
├─────────────┤
│ [第2组]     │
│  0-23       │ ← 主要显示区域
├─────────────┤
│ [第3组]     │
│  0-23       │ ← 接近这里时跳转到第2组
└─────────────┘
```

## 关键技术点

### 1. 防止跳转时的闪烁

使用 `isAdjusting` 标志防止在跳转时触发滚动事件：

```typescript
let isAdjusting = false;

const handleHourScroll = () => {
  if (isAdjusting) return; // 跳转时不处理
  
  // 检测边界
  if (needsJump) {
    isAdjusting = true;
    // 执行跳转
    hourScrollRef.value.scrollTop = newPosition;
    nextTick(() => {
      isAdjusting = false; // 下一帧恢复
    });
  }
};
```

### 2. 模运算计算实际值

无论在哪一组，都能正确计算出实际值：

```typescript
// 小时：0-23
const index = Math.round(scrollTop / ITEM_HEIGHT) % HOUR_COUNT;
const hour = Math.max(0, Math.min(23, index));

// 分钟：0-59
const index = Math.round(scrollTop / ITEM_HEIGHT) % MINUTE_COUNT;
const minute = Math.max(0, Math.min(59, index));
```

### 3. 边界阈值

使用 0.5 倍组高度作为阈值：

```typescript
const singleGroupHeight = HOUR_COUNT * ITEM_HEIGHT;

// 顶部阈值：第1组的一半
if (scrollTop < singleGroupHeight * 0.5) {
  // 跳转
}

// 底部阈值：第2.5组的位置
if (scrollTop > singleGroupHeight * 2.5) {
  // 跳转
}
```

## 用户体验

### 优势

1. **无限滚动**：可以一直向上或向下滚动，没有边界感
2. **无缝体验**：跳转时用户感觉不到，因为内容是连续的
3. **符合直觉**：类似 iOS 原生选择器的行为
4. **性能优化**：只渲染 3 组数据，不会无限增长

### 对比

| 特性 | 无限滚动 | 有限滚动 |
|------|----------|----------|
| 滚动范围 | 无限 | 有边界 |
| 用户体验 | 更自然 | 可能遇到边界 |
| 实现复杂度 | 中等 | 简单 |
| 性能 | 良好（固定3组） | 良好 |
| 内存占用 | 3倍数据 | 1倍数据 |

## 测试验证

### 测试 1：向上无限滚动
1. 打开设置面板，找到时间选择器
2. 选择小时为 0
3. 继续向上滚动
4. **预期**：可以看到 23, 22, 21...，无限循环

### 测试 2：向下无限滚动
1. 选择小时为 23
2. 继续向下滚动
3. **预期**：可以看到 0, 1, 2...，无限循环

### 测试 3：快速滚动
1. 快速向上或向下滚动
2. **预期**：
   - 滚动流畅，无卡顿
   - 跳转时无闪烁
   - 数值正确更新

### 测试 4：边界跳转
1. 慢慢向上滚动到接近第1组
2. **预期**：自动跳转到第2组，用户感觉不到
3. 慢慢向下滚动到接近第3组
4. **预期**：自动跳转到第2组，用户感觉不到

### 测试 5：点击选择
1. 点击列表中的任意数字
2. **预期**：
   - 平滑滚动到该位置
   - 数值正确更新
   - 仍然可以无限滚动

## 性能考虑

### 内存占用
- 小时：24 × 3 = 72 个元素
- 分钟：60 × 3 = 180 个元素
- 总计：252 个 DOM 元素

这个数量对现代浏览器来说非常小，不会造成性能问题。

### 优化建议

如果需要支持更大的数据集（如年份选择），可以考虑：

1. **虚拟滚动**：只渲染可见区域的元素
2. **动态加载**：根据滚动位置动态添加/移除元素
3. **减少重复次数**：从 3 次减少到 2 次（但体验会略差）

## 相关文件

- `src/components/shared/IOSTimePicker.vue` - iOS 风格无限滚动选择器
- `src/components/shared/RotaryTimePicker.vue` - 旋转时间选择器（备选）
- `src/components/settings/SettingsDrawer.vue` - 使用选择器的设置面板

## 参考

这个实现参考了 iOS 原生选择器的行为，是一个经典的无限滚动实现方案，也被广泛应用于：

- 日期选择器
- 时间选择器
- 地区选择器
- 任何需要循环选择的场景
