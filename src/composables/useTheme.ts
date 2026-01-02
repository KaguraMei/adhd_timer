/**
 * useTheme - 主题管理 composable
 * 管理颜色配置、样式配置、应用主题到 CSS 变量、持久化存储
 */

import { ref, type Ref } from 'vue';
import type { ColorConfig, ThemeMode, StyleConfig, ThemeConfig } from '../types/theme';
// 确保 DEFAULT_STYLES, LIGHT_THEME, DARK_THEME 在 types/theme 中正确导出
import { DEFAULT_STYLES, LIGHT_THEME, DARK_THEME } from '../types/theme';
import { useStorage } from './useStorage';

const THEME_STORAGE_KEY = 'adhd-timer-theme';

interface ThemeComposable {
  mode: Ref<ThemeMode>;
  colors: Ref<ColorConfig>;
  styles: Ref<StyleConfig>;
  applyTheme: () => void;
  updateColor: (key: keyof ColorConfig, value: string) => void;
  updateStyle: (key: keyof StyleConfig, value: number) => void;
  setThemeMode: (newMode: ThemeMode) => void;
  saveTheme: () => void;
  resetTheme: () => void;
  loadTheme: () => void;
}

export function useTheme(): ThemeComposable {
  const storage = useStorage();
  
  // 1. 修改：初始化时直接使用 LIGHT_THEME，确保默认就是明亮模式
  // 这样即使 loadTheme 还没运行，初始状态也是对的
  const mode = ref<ThemeMode>('light');
  const colors = ref<ColorConfig>({ ...LIGHT_THEME });
  const styles = ref<StyleConfig>({ ...DEFAULT_STYLES });

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
    // 防御性判断
    if (!color || typeof color !== 'string') {
      console.warn('isLightColor received invalid color:', color);
      // 默认视作亮色背景（返回true），这样文字变黑，或者根据你的设计取舍
      return true; 
    }
    
    const hex = color.replace('#', '');
    
    // 2. 修改：使用 substring 替代废弃的 substr
    // 同时也加了简单校验防止 hex 长度不够导致 NaN
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
    colors.value[key] = value;
    if (mode.value !== 'custom') {
      mode.value = 'custom';
    }
    applyTheme();
  };

  /**
   * 更新样式配置
   */
  const updateStyle = (key: keyof StyleConfig, value: number): void => {
    styles.value[key] = value;
    applyTheme();
  };

  /**
   * 设置主题模式
   */
  const setThemeMode = (newMode: ThemeMode): void => {
    mode.value = newMode;

    if (newMode === 'light') {
      colors.value = { ...LIGHT_THEME };
    } else if (newMode === 'dark') {
      colors.value = { ...DARK_THEME };
    }
    // custom 模式保持当前颜色

    applyTheme();
    // 建议：切换模式后自动保存，或者由调用者决定
    // saveTheme(); 
  };

  /**
   * 保存主题配置到 localStorage
   */
  const saveTheme = (): void => {
    const config: ThemeConfig = {
      mode: mode.value,
      colors: colors.value,
      styles: styles.value
    };
    storage.set(THEME_STORAGE_KEY, config);
  };

  /**
   * 从 localStorage 加载主题配置
   */
  const loadTheme = (): void => {
    const savedConfig = storage.get<ThemeConfig>(THEME_STORAGE_KEY);
    
    if (savedConfig) {
      mode.value = savedConfig.mode || 'light';
      
      // 3. 修改：对象合并策略
      // 如果 savedConfig.colors 里面缺少某个字段（比如版本迭代新增了颜色），
      // 使用 ...LIGHT_THEME 兜底，防止出现 undefined
      colors.value = { 
        ...LIGHT_THEME, 
        ...(savedConfig.colors || {}) 
      };
      
      styles.value = { 
        ...DEFAULT_STYLES, 
        ...(savedConfig.styles || {}) 
      };
      
      applyTheme();
    } else {
      // 如果没有保存的主题，应用默认主题（明亮）
      resetTheme();
    }
  };

  /**
   * 重置为默认主题
   */
  const resetTheme = (): void => {
    mode.value = 'light';
    colors.value = { ...LIGHT_THEME };
    styles.value = { ...DEFAULT_STYLES };
    applyTheme();
    saveTheme();
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