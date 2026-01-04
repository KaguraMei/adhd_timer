<template>
  <div v-if="visible" class="drawer-overlay" @click="handleClose">
    <div class="drawer-content" @click.stop>
        <div class="drawer-header">
          <h2>设置</h2>
          <button class="close-button" @click="handleClose" aria-label="关闭">×</button>
        </div>

        <div class="drawer-body">
          <!-- 主题模式选择 -->
          <section class="settings-section">
            <h3>主题模式</h3>
            <div class="theme-mode-buttons">
              <button
                :class="['theme-button', { active: mode === 'light' }]"
                @click="handleThemeModeChange('light')"
              >
                ☀️ 明亮
              </button>
              <button
                :class="['theme-button', { active: mode === 'dark' }]"
                @click="handleThemeModeChange('dark')"
              >
                🌙 暗黑
              </button>
              <button
                :class="['theme-button', { active: mode === 'custom' }]"
                @click="handleThemeModeChange('custom')"
              >
                🎨 自定义
              </button>
            </div>
          </section>

          <!-- 颜色配置 -->
          <section v-if="mode === 'custom'" class="settings-section">
            <h3>颜色配置</h3>
            
            <div class="color-input-group">
              <label for="backgroundColor">背景色</label>
              <div class="color-input-wrapper">
                <input
                  id="backgroundColor"
                  type="color"
                  :value="colors.backgroundColor"
                  @input="handleColorChange('backgroundColor', $event)"
                />
                <input
                  type="text"
                  :value="colors.backgroundColor"
                  @input="handleColorChange('backgroundColor', $event)"
                  class="color-text-input"
                />
              </div>
            </div>

            <div class="color-input-group">
              <label for="containerBackground">容器背景色</label>
              <div class="color-input-wrapper">
                <input
                  id="containerBackground"
                  type="color"
                  :value="colors.containerBackground"
                  @input="handleColorChange('containerBackground', $event)"
                />
                <input
                  type="text"
                  :value="colors.containerBackground"
                  @input="handleColorChange('containerBackground', $event)"
                  class="color-text-input"
                />
              </div>
            </div>

            <div class="color-input-group">
              <label for="textColor">文本颜色</label>
              <div class="color-input-wrapper">
                <input
                  id="textColor"
                  type="color"
                  :value="colors.textColor"
                  @input="handleColorChange('textColor', $event)"
                />
                <input
                  type="text"
                  :value="colors.textColor"
                  @input="handleColorChange('textColor', $event)"
                  class="color-text-input"
                />
              </div>
            </div>

            <div class="color-input-group">
              <label for="primaryColor">主题色</label>
              <div class="color-input-wrapper">
                <input
                  id="primaryColor"
                  type="color"
                  :value="colors.primaryColor"
                  @input="handleColorChange('primaryColor', $event)"
                />
                <input
                  type="text"
                  :value="colors.primaryColor"
                  @input="handleColorChange('primaryColor', $event)"
                  class="color-text-input"
                />
              </div>
            </div>

            <div class="color-input-group">
              <label for="secondaryColor">次主题色</label>
              <div class="color-input-wrapper">
                <input
                  id="secondaryColor"
                  type="color"
                  :value="colors.secondaryColor"
                  @input="handleColorChange('secondaryColor', $event)"
                />
                <input
                  type="text"
                  :value="colors.secondaryColor"
                  @input="handleColorChange('secondaryColor', $event)"
                  class="color-text-input"
                />
              </div>
            </div>
          </section>

          <!-- 样式配置 -->
          <section class="settings-section">
            <h3>样式配置</h3>
            
            <div class="slider-group">
              <label for="gridSize">
                方块大小: <span class="value">{{ styles.gridSize }}px</span>
              </label>
              <input
                id="gridSize"
                type="range"
                min="10"
                max="50"
                :value="styles.gridSize"
                @input="handleStyleChange('gridSize', $event)"
                class="slider"
              />
            </div>

            <div class="slider-group">
              <label for="borderRadius">
                圆角大小: <span class="value">{{ styles.borderRadius }}px</span>
              </label>
              <input
                id="borderRadius"
                type="range"
                min="0"
                max="20"
                :value="styles.borderRadius"
                @input="handleStyleChange('borderRadius', $event)"
                class="slider"
              />
            </div>
          </section>

          <!-- 动画设置 -->
          <section class="settings-section">
            <h3>动画设置</h3>
            
            <div class="toggle-group">
              <label for="animationsEnabled">
                <span>启用动画效果</span>
                <span class="toggle-description">关闭后将使用简化版本，提升性能</span>
              </label>
              <label class="toggle-switch">
                <input
                  id="animationsEnabled"
                  type="checkbox"
                  :checked="animationsEnabled"
                  @change="handleAnimationToggle"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </section>

          <!-- 每日开始时间设置 -->
          <section class="settings-section">
            <h3>每日开始时间</h3>
             <p class="section-description">
              设置每日开始的时间点，会影响"今日"、"本周"、"本月"等时间范围的判断
            </p>
            
            <IOSTimePicker
              :hour="dayStartHour"
              :minute="dayStartMinute"
              @update:hour="handleDayStartHourChange"
              @update:minute="handleDayStartMinuteChange"
            />
            
            <div class="time-preview-large">
              {{ formatDayStartTime }}
            </div>
          </section>

          <!-- 预览 -->
          <section class="settings-section">
            <h3>预览</h3>
            <div class="preview-box">
              <div class="preview-text">示例文本</div>
              <div class="preview-grid">
                <div class="preview-grid-item inactive"></div>
                <div class="preview-grid-item active"></div>
                <div class="preview-grid-item highlight"></div>
              </div>
            </div>
          </section>
        </div>

        <div class="drawer-footer">
          <button class="button button-secondary" @click="handleReset">
            恢复默认
          </button>
          <button class="button button-primary" @click="handleSave">
            保存
          </button>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useTheme } from '../../composables/useTheme';
import { useAnimation } from '../../composables/useAnimation';
import { useSettingsStore } from '../../stores/settings';
import IOSTimePicker from '../shared/IOSTimePicker.vue';
import type { ColorConfig, StyleConfig } from '../../types/theme';

interface Props {
  visible: boolean;
}

interface Emits {
  (e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { mode, colors, styles, updateColor, updateStyle, setThemeMode, saveTheme, resetTheme } = useTheme();
const { animationsEnabled, toggleAnimations } = useAnimation();
const settingsStore = useSettingsStore();

// 每日开始时间
const dayStartHour = ref(settingsStore.dayStartTime.hour);
const dayStartMinute = ref(settingsStore.dayStartTime.minute);

// 格式化显示
const formatDayStartTime = computed(() => {
  const h = dayStartHour.value.toString().padStart(2, '0');
  const m = dayStartMinute.value.toString().padStart(2, '0');
  return `${h}:${m}`;
});

/**
 * 处理主题模式变化
 */
const handleThemeModeChange = (newMode: 'light' | 'dark' | 'custom'): void => {
  setThemeMode(newMode);
};

/**
 * 处理颜色变化
 */
const handleColorChange = (key: keyof ColorConfig, event: Event): void => {
  const target = event.target as HTMLInputElement;
  updateColor(key, target.value);
};

/**
 * 处理样式变化
 */
const handleStyleChange = (key: keyof StyleConfig, event: Event): void => {
  const target = event.target as HTMLInputElement;
  updateStyle(key, Number(target.value));
};

/**
 * 处理动画开关切换
 */
const handleAnimationToggle = (): void => {
  toggleAnimations();
};

/**
 * 处理每日开始小时变化
 */
const handleDayStartHourChange = (value: number): void => {
  dayStartHour.value = value;
  settingsStore.setDayStartTime(dayStartHour.value, dayStartMinute.value);
};

/**
 * 处理每日开始分钟变化
 */
const handleDayStartMinuteChange = (value: number): void => {
  dayStartMinute.value = value;
  settingsStore.setDayStartTime(dayStartHour.value, dayStartMinute.value);
};

/**
 * 处理保存按钮点击
 */
const handleSave = (): void => {
  saveTheme();
  handleClose();
};

/**
 * 处理恢复默认按钮点击
 */
const handleReset = (): void => {
  resetTheme();
  dayStartHour.value = 0;
  dayStartMinute.value = 0;
  settingsStore.setDayStartTime(0, 0);
};

/**
 * 处理关闭按钮点击
 */
const handleClose = (): void => {
  emit('close');
};

/**
 * 处理 ESC 键关闭
 */
const handleKeyDown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && props.visible) {
    handleClose();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.drawer-content {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  max-width: 90vw;
  background-color: var(--color-container-bg);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-inactive);
  flex-shrink: 0;
}

.drawer-header h2 {
  margin: 0;
  font-size: 24px;
  color: var(--color-text);
}

.close-button {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 32px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s;
}

.close-button:hover {
  color: var(--color-primary);
  transform: none;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
}

.settings-section {
  margin-bottom: var(--spacing-lg);
}

.settings-section h3 {
  margin: 0 0 var(--spacing-md) 0;
  font-size: 18px;
  color: var(--color-text);
  font-weight: 600;
}

.section-description {
  color: var(--color-inactive);
  font-size: 13px;
  margin: 0 0 var(--spacing-md) 0;
  line-height: 1.5;
}

/* 主题模式按钮 */
.theme-mode-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.theme-button {
  flex: 1;
  padding: var(--spacing-sm);
  background-color: var(--color-background);
  border: 2px solid var(--color-inactive);
  border-radius: var(--border-radius-sm);
  color: var(--color-text);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.theme-button:hover {
  border-color: var(--color-primary);
  transform: none;
}

.theme-button.active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: #000;
  font-weight: 600;
}

/* 颜色输入 */
.color-input-group {
  margin-bottom: var(--spacing-md);
}

.color-input-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
}

.color-input-wrapper {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.color-input-wrapper input[type="color"] {
  width: 60px;
  height: 40px;
  border: 2px solid var(--color-inactive);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  background: none;
}

.color-text-input {
  flex: 1;
  padding: var(--spacing-sm);
  background-color: var(--color-background);
  border: 2px solid var(--color-inactive);
  border-radius: var(--border-radius-sm);
  color: var(--color-text);
  font-size: 14px;
  font-family: monospace;
}

.color-text-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* 滑条输入 */
.slider-group {
  margin-bottom: var(--spacing-md);
}

.slider-group label {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
}

.slider-group .value {
  color: var(--color-primary);
  font-weight: 700;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--color-inactive);
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
}

/* 开关切换 */
.toggle-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
}

.toggle-group > label:first-child {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toggle-group > label:first-child > span:first-child {
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
}

.toggle-description {
  color: var(--color-inactive);
  font-size: 12px;
  font-weight: 400;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  flex-shrink: 0;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-inactive);
  transition: 0.3s;
  border-radius: 26px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle-switch input:checked + .toggle-slider {
  background-color: var(--color-primary);
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

/* 时间预览（大号） */
.time-preview-large {
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-primary);
  padding: var(--spacing-md);
  background-color: var(--color-background);
  border-radius: var(--border-radius-sm);
  margin-top: var(--spacing-md);
  letter-spacing: 2px;
}

/* 预览 */
.preview-box {
  background-color: var(--color-background);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
}

.preview-text {
  color: var(--color-text);
  font-size: 18px;
  margin-bottom: var(--spacing-md);
  font-weight: 600;
}

.preview-grid {
  display: flex;
  gap: var(--spacing-sm);
}

.preview-grid-item {
  width: var(--grid-size, 20px);
  height: var(--grid-size, 20px);
  border-radius: var(--border-radius-sm);
}

.preview-grid-item.inactive {
  background-color: var(--color-inactive);
}

.preview-grid-item.active {
  background-color: var(--color-secondary);
}

.preview-grid-item.highlight {
  background-color: var(--color-primary);
}

/* 底部按钮 */
.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-inactive);
  flex-shrink: 0;
}

.button {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-lg);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.button-primary {
  background-color: var(--color-primary);
  color: #000;
  font-weight: 600;
}

.button-primary:hover {
  opacity: 0.8;
  transform: none;
}

.button-secondary {
  background-color: transparent;
  color: var(--color-text);
  border: 2px solid var(--color-inactive);
}

.button-secondary:hover {
  border-color: var(--color-text);
  transform: none;
}

/* 抽屉动画 */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-active .drawer-content,
.drawer-leave-active .drawer-content {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .drawer-content {
  transform: translateX(100%);
}

.drawer-leave-to .drawer-content {
  transform: translateX(100%);
}

@media (max-width: 480px) {
  .drawer-content {
    width: 100vw;
  }

  .drawer-header h2 {
    font-size: 20px;
  }

  .theme-button {
    font-size: 12px;
    padding: 8px;
  }

  .color-input-wrapper input[type="color"] {
    width: 50px;
    height: 35px;
  }

  .color-text-input {
    font-size: 12px;
  }
}
</style>
