# 主题存储优化说明

## 优化内容

### 之前的问题
- 无论选择什么主题模式（明亮、暗黑、自定义），都会存储完整的颜色配置
- 导致 localStorage 存储了不必要的数据
- 用户切换回预设主题时，可能会使用之前修改过的颜色

### 现在的逻辑

#### 1. 明亮模式（Light）
**存储内容：**
```json
{
  "theme": {
    "mode": "light",
    "styles": { "gridSize": 20, "borderRadius": 2 }
  },
  "animations": { "enabled": true },
  "dayStartTime": { "hour": 0, "minute": 0 }
}
```

**特点：**
- ✅ 只存储模式名称 `"light"`
- ✅ 不存储颜色配置
- ✅ 加载时使用预设的明亮主题颜色

#### 2. 暗黑模式（Dark）
**存储内容：**
```json
{
  "theme": {
    "mode": "dark",
    "styles": { "gridSize": 20, "borderRadius": 2 }
  },
  "animations": { "enabled": true },
  "dayStartTime": { "hour": 0, "minute": 0 }
}
```

**特点：**
- ✅ 只存储模式名称 `"dark"`
- ✅ 不存储颜色配置
- ✅ 加载时使用预设的暗黑主题颜色

#### 3. 自定义模式（Custom）
**存储内容：**
```json
{
  "theme": {
    "mode": "custom",
    "colors": {
      "backgroundColor": "#123456",
      "containerBackground": "#234567",
      "textColor": "#ffffff",
      "primaryColor": "#ff0000",
      "secondaryColor": "#00ff00"
    },
    "styles": { "gridSize": 20, "borderRadius": 2 }
  },
  "animations": { "enabled": true },
  "dayStartTime": { "hour": 0, "minute": 0 }
}
```

**特点：**
- ✅ 存储模式名称 `"custom"`
- ✅ **只在自定义模式下**存储完整的颜色配置
- ✅ 加载时使用保存的自定义颜色

## 实现细节

### 保存逻辑（saveSettings）

```typescript
const saveSettings = (): void => {
  const themeData = {
    mode: themeMode.value,
    styles: { ...styles.value }
  };
  
  // 只在自定义模式下保存颜色配置
  if (themeMode.value === 'custom') {
    themeData.colors = { ...colors.value };
  }
  
  const settings = {
    theme: themeData,
    animations: { enabled: animationsEnabled.value },
    dayStartTime: { ...dayStartTime.value }
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};
```

### 加载逻辑（loadSettings）

```typescript
const loadSettings = (): void => {
  const settings = JSON.parse(localStorage.getItem(STORAGE_KEY));
  
  themeMode.value = settings.theme.mode;
  
  // 只在自定义模式下加载保存的颜色
  if (themeMode.value === 'custom' && settings.theme.colors) {
    colors.value = { ...settings.theme.colors };
  } else {
    // 对于 light 和 dark 模式，使用默认颜色
    colors.value = { ...defaultSettings.theme.colors };
  }
  
  styles.value = { ...settings.theme.styles };
};
```

### 主题应用逻辑（loadTheme in useTheme）

```typescript
const loadTheme = (): void => {
  settingsStore.loadSettings();
  
  // 根据加载的模式应用对应的主题
  const currentMode = settingsStore.themeMode;
  if (currentMode === 'light') {
    // 应用明亮主题预设颜色
    Object.assign(settingsStore.colors, LIGHT_THEME);
  } else if (currentMode === 'dark') {
    // 应用暗黑主题预设颜色
    Object.assign(settingsStore.colors, DARK_THEME);
  }
  // custom 模式下，colors 已经在 loadSettings 中加载
  
  applyTheme();
};
```

## 用户场景

### 场景 1：使用明亮主题
1. 用户选择"明亮"主题
2. 系统应用预设的明亮主题颜色
3. 保存时只存储 `mode: "light"`
4. 刷新页面后，加载 `mode: "light"`，应用预设颜色

### 场景 2：使用暗黑主题
1. 用户选择"暗黑"主题
2. 系统应用预设的暗黑主题颜色
3. 保存时只存储 `mode: "dark"`
4. 刷新页面后，加载 `mode: "dark"`，应用预设颜色

### 场景 3：自定义主题
1. 用户选择"自定义"主题
2. 用户修改颜色配置
3. 保存时存储 `mode: "custom"` 和完整的颜色配置
4. 刷新页面后，加载自定义的颜色配置

### 场景 4：从自定义切换回预设主题
1. 用户之前使用自定义主题（localStorage 中有自定义颜色）
2. 用户切换到"明亮"或"暗黑"主题
3. 系统应用预设颜色，覆盖之前的自定义颜色
4. 保存时只存储模式名称，删除自定义颜色配置
5. 用户再次切换到"自定义"时，会从当前颜色开始（而不是之前的自定义颜色）

## 优势

1. **减少存储空间**：预设主题不存储颜色配置，节省 localStorage 空间
2. **保持一致性**：预设主题始终使用最新的预设颜色
3. **清晰的数据结构**：存储的数据更简洁，易于理解和维护
4. **更好的用户体验**：用户切换主题时，行为更符合预期

## 测试验证

### 测试 1：明亮主题存储
1. 选择"明亮"主题
2. 打开浏览器开发者工具 → Application → Local Storage
3. 查看 `adhd-timer-settings` 键
4. **预期**：`theme.colors` 字段不存在

### 测试 2：暗黑主题存储
1. 选择"暗黑"主题
2. 查看 localStorage
3. **预期**：`theme.colors` 字段不存在

### 测试 3：自定义主题存储
1. 选择"自定义"主题
2. 修改任意颜色
3. 查看 localStorage
4. **预期**：`theme.colors` 字段存在，包含完整的颜色配置

### 测试 4：主题切换
1. 选择"自定义"主题并修改颜色
2. 切换到"明亮"主题
3. 查看 localStorage
4. **预期**：`theme.colors` 字段消失
5. 刷新页面
6. **预期**：显示明亮主题的预设颜色

## 相关文件

- `src/stores/settings.ts` - 设置存储逻辑
- `src/composables/useTheme.ts` - 主题管理逻辑
- `src/types/theme.ts` - 主题类型定义
