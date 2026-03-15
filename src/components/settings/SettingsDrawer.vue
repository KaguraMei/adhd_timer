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
            <button :class="['theme-button', { active: mode === 'light' }]" @click="handleThemeModeChange('light')">
              ☀️ 明亮
            </button>
            <button :class="['theme-button', { active: mode === 'dark' }]" @click="handleThemeModeChange('dark')">
              🌙 暗黑
            </button>
            <button :class="['theme-button', { active: mode === 'custom' }]" @click="handleThemeModeChange('custom')">
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
              <input id="backgroundColor" type="color" :value="colors.backgroundColor"
                @input="handleColorChange('backgroundColor', $event)" />
              <input type="text" :value="colors.backgroundColor" @input="handleColorChange('backgroundColor', $event)"
                class="color-text-input" />
            </div>
          </div>

          <div class="color-input-group">
            <label for="containerBackground">容器背景色</label>
            <div class="color-input-wrapper">
              <input id="containerBackground" type="color" :value="colors.containerBackground"
                @input="handleColorChange('containerBackground', $event)" />
              <input type="text" :value="colors.containerBackground"
                @input="handleColorChange('containerBackground', $event)" class="color-text-input" />
            </div>
          </div>

          <div class="color-input-group">
            <label for="textColor">文本颜色</label>
            <div class="color-input-wrapper">
              <input id="textColor" type="color" :value="colors.textColor"
                @input="handleColorChange('textColor', $event)" />
              <input type="text" :value="colors.textColor" @input="handleColorChange('textColor', $event)"
                class="color-text-input" />
            </div>
          </div>

          <div class="color-input-group">
            <label for="primaryColor">主题色</label>
            <div class="color-input-wrapper">
              <input id="primaryColor" type="color" :value="colors.primaryColor"
                @input="handleColorChange('primaryColor', $event)" />
              <input type="text" :value="colors.primaryColor" @input="handleColorChange('primaryColor', $event)"
                class="color-text-input" />
            </div>
          </div>

          <div class="color-input-group">
            <label for="secondaryColor">次主题色</label>
            <div class="color-input-wrapper">
              <input id="secondaryColor" type="color" :value="colors.secondaryColor"
                @input="handleColorChange('secondaryColor', $event)" />
              <input type="text" :value="colors.secondaryColor" @input="handleColorChange('secondaryColor', $event)"
                class="color-text-input" />
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
            <input id="gridSize" type="range" min="10" max="50" :value="styles.gridSize"
              @input="handleStyleChange('gridSize', $event)" class="slider" />
          </div>

          <div class="slider-group">
            <label for="borderRadius">
              圆角大小: <span class="value">{{ styles.borderRadius }}px</span>
            </label>
            <input id="borderRadius" type="range" min="0" max="20" :value="styles.borderRadius"
              @input="handleStyleChange('borderRadius', $event)" class="slider" />
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
              <input id="animationsEnabled" type="checkbox" :checked="animationsEnabled"
                @change="handleAnimationToggle" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </section>

        <!-- 音效设置 -->
        <section class="settings-section">
          <h3>音效设置</h3>

          <div class="toggle-group">
            <label for="soundEnabled">
              <span>启用音效</span>
              <span class="toggle-description">控制所有音效的总开关</span>
            </label>
            <label class="toggle-switch">
              <input id="soundEnabled" type="checkbox" :checked="soundEnabled" @change="handleSoundToggle" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="toggle-group" style="margin-top: var(--spacing-md);">
            <label for="timerEndSoundEnabled">
              <span>倒计时结束提示音</span>
              <span class="toggle-description">倒计时结束时播放提示音</span>
            </label>
            <label class="toggle-switch">
              <input id="timerEndSoundEnabled" type="checkbox" :checked="timerEndSoundEnabled" :disabled="!soundEnabled"
                @change="handleTimerEndSoundToggle" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <!-- 音效类型选择 -->
          <div class="sound-type-selector" style="margin-top: var(--spacing-md);">
            <label for="soundType" class="sound-type-label">
              音效类型
            </label>
            <select id="soundType" :value="soundType" @change="handleSoundTypeChange"
              :disabled="!soundEnabled || !timerEndSoundEnabled" class="sound-type-select">
              <option v-for="type in soundTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
            <p class="sound-type-description">
              {{soundTypes.find(t => t.value === soundType)?.description}}
            </p>
          </div>

          <!-- 重复次数 -->
          <div class="slider-group" style="margin-top: var(--spacing-md);">
            <label for="soundRepeatCount">
              重复次数: <span class="value">{{ soundRepeatCount }} 次</span>
            </label>
            <input id="soundRepeatCount" type="range" min="1" max="5" :value="soundRepeatCount"
              @input="handleSoundRepeatCountChange" :disabled="!soundEnabled || !timerEndSoundEnabled" class="slider" />
            <p class="sound-type-description" style="margin-top: var(--spacing-xs);">
              音效将重复播放 {{ soundRepeatCount }} 次，每次间隔 1.5 秒
            </p>
          </div>

          <button class="button button-secondary" @click="handleTestSound"
            :disabled="!soundEnabled || !timerEndSoundEnabled" style="margin-top: var(--spacing-md); width: 100%;">
            🔊 测试音效
          </button>
        </section>

        <!-- 省电模式设置 -->
        <section class="settings-section">
          <h3>省电模式</h3>
          <p class="section-description">
            适用于墨水屏等低刷新率设备，降低页面刷新频率以节省电量
          </p>

          <div class="toggle-group">
            <label for="powerSavingEnabled">
              <span>启用省电模式</span>
              <span class="toggle-description">降低刷新频率，适合墨水屏设备</span>
            </label>
            <label class="toggle-switch">
              <input id="powerSavingEnabled" type="checkbox" :checked="powerSavingEnabled"
                @change="handlePowerSavingToggle" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div v-if="powerSavingEnabled" class="refresh-interval-selector" style="margin-top: var(--spacing-md);">
            <label for="refreshInterval" class="sound-type-label">
              刷新间隔
            </label>
            <select id="refreshInterval" :value="refreshInterval" @change="handleRefreshIntervalChange"
              class="sound-type-select">
              <option :value="1">正常 (1秒)</option>
              <option :value="30">省电 (30秒)</option>
              <option :value="60">超级省电 (60秒)</option>
            </select>
            <p class="sound-type-description">
              {{ refreshIntervalDescription }}
            </p>
          </div>
        </section>

        <!-- 每日开始时间设置 -->
        <section class="settings-section">
          <h3>每日开始时间</h3>
          <p class="section-description">
            设置每日开始的时间点，会影响"今日"、"本周"、"本月"等时间范围的判断
          </p>

          <IOSTimePicker :hour="dayStartHour" :minute="dayStartMinute" @update:hour="handleDayStartHourChange"
            @update:minute="handleDayStartMinuteChange" />

          <div class="time-preview-large">
            {{ formatDayStartTime }}
          </div>

          <!-- 日期计算模式选择 -->
          <div class="toggle-group" style="margin-top: var(--spacing-md);">
            <label for="countAsPreviousDay">
              <span>早于开始时间算作前一天</span>
              <span class="toggle-description">
                {{ dayStartCountAsPreviousDay ?
                  `例如：${formatDayStartTime} 开始，之前的时间算作前一天` :
                  `例如：${formatDayStartTime} 开始，之后的时间算作新一天`
                }}
              </span>
            </label>
            <label class="toggle-switch">
              <input id="countAsPreviousDay" type="checkbox" :checked="dayStartCountAsPreviousDay"
                @change="handleCountAsPreviousDayToggle" />
              <span class="toggle-slider"></span>
            </label>
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
import { onMounted, onUnmounted, computed } from 'vue';
import { useTheme } from '../../composables/useTheme';
import { useAnimation } from '../../composables/useAnimation';
import { useSettingsStore } from '../../stores/settings';
import { playSound, getSoundTypes, type SoundType } from '../../utils/soundUtils';
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

// 音效设置
const soundEnabled = computed(() => settingsStore.soundEnabled);
const timerEndSoundEnabled = computed(() => settingsStore.timerEndSoundEnabled);
const soundType = computed(() => settingsStore.soundType);
const soundRepeatCount = computed(() => settingsStore.soundRepeatCount);
const soundTypes = getSoundTypes();

// 省电模式设置
const powerSavingEnabled = computed(() => settingsStore.powerSavingEnabled);
const refreshInterval = computed(() => settingsStore.refreshInterval);

const refreshIntervalDescription = computed(() => {
  switch (refreshInterval.value) {
    case 1:
      return '正常模式，每秒刷新一次，适合普通屏幕';
    case 30:
      return '省电模式，每30秒刷新一次，适合墨水屏设备';
    case 60:
      return '超级省电模式，每60秒刷新一次，最大化节省电量';
    default:
      return '';
  }
});

// 每日开始时间 - 使用 computed 确保响应式
const dayStartHour = computed({
  get: () => settingsStore.dayStartTime.hour,
  set: (value: number) => {
    settingsStore.setDayStartTime(value, settingsStore.dayStartTime.minute);
  }
});

const dayStartMinute = computed({
  get: () => settingsStore.dayStartTime.minute,
  set: (value: number) => {
    settingsStore.setDayStartTime(settingsStore.dayStartTime.hour, value);
  }
});

const dayStartCountAsPreviousDay = computed({
  get: () => settingsStore.dayStartTime.countAsPreviousDay ?? true,
  set: (value: boolean) => {
    settingsStore.setDayStartTime(
      settingsStore.dayStartTime.hour,
      settingsStore.dayStartTime.minute,
      value
    );
    // 立即保存
    settingsStore.saveSettings();
  }
});

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
};

/**
 * 处理每日开始分钟变化
 */
const handleDayStartMinuteChange = (value: number): void => {
  dayStartMinute.value = value;
};

/**
 * 处理音效开关切换
 */
const handleSoundToggle = (): void => {
  settingsStore.setSoundEnabled(!soundEnabled.value);
};

/**
 * 处理倒计时结束音效切换
 */
const handleTimerEndSoundToggle = (): void => {
  settingsStore.setTimerEndSoundEnabled(!timerEndSoundEnabled.value);
};

/**
 * 处理音效类型变化
 */
const handleSoundTypeChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement;
  settingsStore.setSoundType(target.value as SoundType);
};

/**
 * 处理音效重复次数变化
 */
const handleSoundRepeatCountChange = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  settingsStore.setSoundRepeatCount(Number(target.value));
};

/**
 * 测试音效
 */
const handleTestSound = (): void => {
  playSound(soundType.value, soundRepeatCount.value);
};


/**
 * 处理省电模式切换
 */
const handlePowerSavingToggle = (): void => {
  settingsStore.setPowerSavingEnabled(!powerSavingEnabled.value);
};

/**
 * 处理刷新间隔变化
 */
const handleRefreshIntervalChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement;
  settingsStore.setRefreshInterval(Number(target.value) as 1 | 30 | 60);
};

/**
 * 处理日期计算模式切换
 */
const handleCountAsPreviousDayToggle = (): void => {
  dayStartCountAsPreviousDay.value = !dayStartCountAsPreviousDay.value;
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
  settingsStore.setDayStartTime(0, 0, true);
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
  padding-top: max(var(--safe-area-inset-top), var(--spacing-md));
  padding-bottom: var(--spacing-md);
  padding-left: var(--spacing-md);
  padding-right: var(--spacing-md);
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
  color: #ffffff;
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

.toggle-group>label:first-child {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toggle-group>label:first-child>span:first-child {
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

.toggle-switch input:checked+.toggle-slider {
  background-color: var(--color-primary);
}

.toggle-switch input:checked+.toggle-slider:before {
  transform: translateX(24px);
}

/* 音效类型选择器 */
.sound-type-selector {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.sound-type-label {
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
}

.sound-type-select {
  padding: var(--spacing-sm);
  background-color: var(--color-background);
  border: 2px solid var(--color-inactive);
  border-radius: var(--border-radius-sm);
  color: var(--color-text);
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.sound-type-select:hover:not(:disabled) {
  border-color: var(--color-primary);
}

.sound-type-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.sound-type-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sound-type-description {
  color: var(--color-inactive);
  font-size: 12px;
  margin: 0;
  line-height: 1.5;
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
  position: relative;
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

/* 彩蛋按钮 */
.easter-egg-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.3;
  transition: all 0.3s ease;
  border-radius: 50%;
}

.easter-egg-button:hover {
  opacity: 1;
  transform: scale(1.2) rotate(10deg);
  background: var(--color-primary);
}

.easter-egg-button:active {
  transform: scale(0.9);
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
  color: #ffffff;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.button-primary:hover {
  opacity: 0.9;
  transform: none;
  box-shadow: 0 2px 8px rgba(255, 149, 0, 0.3);
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
