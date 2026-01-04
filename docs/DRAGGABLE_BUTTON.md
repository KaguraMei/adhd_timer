# 可拖动按钮组件

## 功能说明

DraggableButton 是一个支持长按拖动的浮动按钮组件，用户可以自定义按钮的位置，位置会自动保存到 localStorage。

## 特性

### 1. 长按拖动
- **长按触发**：按住按钮 500ms 后进入拖动模式
- **拖动移动**：拖动按钮到任意位置
- **自动保存**：松开后自动保存位置
- **边界限制**：按钮不会超出视口范围

### 2. 点击与拖动区分
- **短按**：触发点击事件（打开设置）
- **长按拖动**：移动按钮位置，不触发点击
- **移动阈值**：移动超过 5px 才算拖动

### 3. 触摸支持
- ✅ 鼠标拖动
- ✅ 触摸拖动
- ✅ 防止页面滚动（拖动时）

### 4. 位置记忆
- 自动保存到 localStorage
- 刷新页面后恢复位置
- 可自定义存储键名

## 使用方法

### 基本用法

```vue
<template>
  <DraggableButton
    aria-label="打开设置"
    storage-key="settings-button-position"
    @click="handleClick"
  >
    ⚙️
  </DraggableButton>
</template>

<script setup>
import DraggableButton from '@/components/shared/DraggableButton.vue';

const handleClick = () => {
  console.log('Button clicked!');
};
</script>
```

### 自定义内容

```vue
<DraggableButton @click="handleClick">
  <span>🎨</span>
</DraggableButton>
```

## Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| ariaLabel | string | 否 | '按钮' | 无障碍标签 |
| storageKey | string | 否 | 'draggable-button-position' | localStorage 存储键名 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | - | 短按时触发（不拖动） |

## Slots

| 插槽名 | 说明 |
|--------|------|
| default | 按钮内容 |

## 实现原理

### 1. 长按检测

```typescript
const LONG_PRESS_DURATION = 500; // 长按时间（毫秒）

const startLongPress = (clientX: number, clientY: number) => {
  startX = clientX;
  startY = clientY;
  
  longPressTimer = setTimeout(() => {
    isDragging.value = true; // 进入拖动模式
  }, LONG_PRESS_DURATION);
};
```

### 2. 移动阈值

```typescript
const MOVE_THRESHOLD = 5; // 移动阈值（像素）

const handleMove = (clientX: number, clientY: number) => {
  const deltaX = clientX - startX;
  const deltaY = clientY - startY;
  
  // 检测是否移动超过阈值
  if (!hasMoved && (Math.abs(deltaX) > MOVE_THRESHOLD || Math.abs(deltaY) > MOVE_THRESHOLD)) {
    hasMoved = true;
  }
};
```

### 3. 边界限制

```typescript
const constrainPosition = (x: number, y: number) => {
  const buttonSize = 50;
  const padding = 10;
  
  const maxX = window.innerWidth - buttonSize - padding;
  const maxY = window.innerHeight - buttonSize - padding;
  
  return {
    x: Math.max(padding, Math.min(maxX, x)),
    y: Math.max(padding, Math.min(maxY, y))
  };
};
```

### 4. 点击与拖动区分

```typescript
const handleClick = (e: MouseEvent) => {
  // 如果移动过或正在拖动，不触发点击事件
  if (hasMoved || isDragging.value) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  
  emit('click');
};
```

### 5. 位置保存

```typescript
const savePosition = () => {
  localStorage.setItem(storageKey, JSON.stringify(position.value));
};

const loadPosition = () => {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    position.value = JSON.parse(saved);
  }
};
```

## 交互流程

### 短按（点击）

```
用户按下 → 等待 < 500ms → 用户松开 → 触发 click 事件
```

### 长按拖动

```
用户按下 → 等待 > 500ms → 进入拖动模式 → 移动鼠标/手指 → 按钮跟随移动 → 松开 → 保存位置
```

### 移动检测

```
用户按下 → 移动 < 5px → 松开 → 触发 click 事件
用户按下 → 移动 > 5px → 松开 → 不触发 click 事件
```

## 视觉反馈

### 正常状态
- 圆形按钮
- 阴影效果
- 悬停时旋转 90°

### 拖动状态
- 放大 1.1 倍
- 增强阴影
- 半透明（opacity: 0.9）
- 边框变为主题色
- 光标变为 `grabbing`

## 使用场景

### 适合使用的场景
- ✅ 设置按钮
- ✅ 帮助按钮
- ✅ 快捷操作按钮
- ✅ 任何需要自定义位置的浮动按钮

### 不适合的场景
- ❌ 固定位置的按钮
- ❌ 需要精确对齐的按钮
- ❌ 表单提交按钮

## 测试验证

### 测试 1：短按点击
1. 快速点击设置按钮
2. **预期**：打开设置面板

### 测试 2：长按拖动
1. 长按设置按钮（超过 500ms）
2. 拖动到新位置
3. 松开
4. **预期**：
   - 按钮移动到新位置
   - 不打开设置面板
   - 位置被保存

### 测试 3：位置记忆
1. 拖动按钮到新位置
2. 刷新页面
3. **预期**：按钮仍在新位置

### 测试 4：边界限制
1. 尝试拖动按钮到屏幕外
2. **预期**：按钮停留在边界内，不会超出视口

### 测试 5：触摸拖动
1. 在触摸屏设备上长按按钮
2. 拖动到新位置
3. **预期**：
   - 拖动流畅
   - 页面不滚动
   - 位置正确更新

### 测试 6：移动阈值
1. 按下按钮
2. 轻微移动（< 5px）
3. 松开
4. **预期**：触发点击事件

### 测试 7：响应式
1. 在不同屏幕尺寸下测试
2. **预期**：
   - 桌面端：50x50px
   - 移动端：45x45px
   - 位置自动适配

## 性能考虑

### 优化点
1. **事件节流**：使用原生事件，无需节流
2. **内存管理**：组件卸载时清理所有事件监听器
3. **存储优化**：只在拖动结束时保存，不频繁写入

### 注意事项
1. **触摸事件**：使用 `{ passive: false }` 防止页面滚动
2. **定时器清理**：确保长按定时器被正确清理
3. **边界计算**：考虑按钮大小和边距

## 可扩展性

### 可配置项（未来）
- 长按时间
- 移动阈值
- 按钮大小
- 边距
- 动画效果

### 可能的改进
- 添加震动反馈（移动端）
- 添加吸附效果（贴边）
- 添加位置预设（四角、中间等）
- 添加重置位置功能

## 相关文件

- `src/components/shared/DraggableButton.vue` - 可拖动按钮组件
- `src/App.vue` - 使用可拖动按钮的主应用

## 技术亮点

1. **长按与点击区分**：通过定时器和移动阈值实现
2. **触摸友好**：完整支持触摸事件，防止页面滚动
3. **位置记忆**：自动保存和恢复位置
4. **边界限制**：确保按钮始终在视口内
5. **视觉反馈**：拖动时的放大和阴影效果
