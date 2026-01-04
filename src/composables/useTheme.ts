/**
 * useTheme - 主题管理 composable
 * 现在使用 Pinia store 进行状态管理
 */

import { computed, type ComputedRef } from 'vue';
import { useSettingsStore } from '../stores/settings';
import { LIGHT_THEME, DARK_THEME } from '../types/theme';
import type { ColorConfig, ThemeMode, StyleConfig } from '../types/theme';

interface ThemeComposable {
  mode: ComputedRef<ThemeMode>;
  colors: ComputedRef<ColorConfig>;
  styles: ComputedRef<StyleConfig>;
  applyTheme: () => void;
  updateColor: (key: keyof ColorConfig, value: string) => void;
  updateStyle: (key: keyof StyleConfig, value: number) => void;
  setThemeMode: (newMode: ThemeMode) => void;
  saveTheme: () => void;
  resetTheme: () => void;
  loadTheme: () => void;
}

export function useTheme(): ThemeComposable {
  const settingsStore = useSettingsStore();
  
  // 使用 computed 从 store 获取响应式数据
  const mode = computed(() => settingsStore.themeMode);
  const colors = computed(() => settingsStore.colors);
  const styles = computed(() => settingsStore.styles);

  /**
   * 应用主题到 CSS 变量
   */
  const applyTheme = (): void => {
    const root = document.documentElement;

    // 应用颜色
    root.style.setProperty('--color-background', colors.value.backgroundColor);
    root.style.setProperty('--color-container-bg', colors.value.containerBackground);
    root.style.setProperty('--color-text', colors.value.textColor);
    root.style.setProperty('--color-primary', colors.value.primaryColor);
    root.style.setProperty('--color-secondary', colors.value.secondaryColor);

    // 应用样式
    root.style.setProperty('--grid-size', `${styles.value.gridSize}px`);
    root.style.setProperty('--border-radius-sm', `${styles.value.borderRadius}px`);

    // 计算 inactive 颜色（基于背景色的亮度）
    const bgColor = colors.value.backgroundColor;
    const isLight = isLightColor(bgColor);
    const inactiveColor = isLight ? '#cccccc' : '#333333';
    const mutedColor = isLight ? '#666666' : '#888888';
    root.style.setProperty('--color-inactive', inactiveColor);
    root.style.setProperty('--color-muted', mutedColor);
  };

  /**
   * 判断颜色是否为浅色
   */
  const isLightColor = (color: string): boolean => {
    if (!color || typeof color !== 'string') {
      return true;
    }
    
    const hex = color.replace('#', '');
    if (hex.length < 6) return true;

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  /**
   * 更新单个颜色配置
   */
  const updateColor = (key: keyof ColorConfig, value: string): void => {
    settingsStore.updateColor(key, value);
    applyTheme();
  };

  /**
   * 更新样式配置
   */
  const updateStyle = (key: keyof StyleConfig, value: number): void => {
    settingsStore.updateStyle(key, value);
    applyTheme();
  };

  /**
   * 设置主题模式
   */
  const setThemeMode = (newMode: ThemeMode): void => {
    settingsStore.setThemeMode(newMode);
    
    // 根据模式更新颜色（不触发自动切换到 custom）
    if (newMode === 'light') {
      Object.keys(LIGHT_THEME).forEach(key => {
        settingsStore.updateColorOnly(key as keyof ColorConfig, LIGHT_THEME[key as keyof ColorConfig]);
      });
    } else if (newMode === 'dark') {
      Object.keys(DARK_THEME).forEach(key => {
        settingsStore.updateColorOnly(key as keyof ColorConfig, DARK_THEME[key as keyof ColorConfig]);
      });
    }
    // custom 模式下保持当前颜色
    
    applyTheme();
  };

  /**
   * 保存主题配置
   */
  const saveTheme = (): void => {
    settingsStore.saveSettings();
  };

  /**
   * 从 localStorage 加载主题配置
   */
  const loadTheme = (): void => {
    settingsStore.loadSettings();
    
    // 根据加载的模式应用对应的主题
    const currentMode = settingsStore.themeMode;
    if (currentMode === 'light') {
      Object.keys(LIGHT_THEME).forEach(key => {
        settingsStore.updateColorOnly(key as keyof ColorConfig, LIGHT_THEME[key as keyof ColorConfig]);
      });
    } else if (currentMode === 'dark') {
      Object.keys(DARK_THEME).forEach(key => {
        settingsStore.updateColorOnly(key as keyof ColorConfig, DARK_THEME[key as keyof ColorConfig]);
      });
    }
    // custom 模式下，colors 已经在 loadSettings 中加载
    
    applyTheme();
  };

  /**
   * 重置为默认主题
   */
  const resetTheme = (): void => {
    settingsStore.resetSettings();
    applyTheme();
  };

  return {
    mode,
    colors,
    styles,
    applyTheme,
    updateColor,
    updateStyle,
    setThemeMode,
    saveTheme,
    resetTheme,
    loadTheme
  };
}
