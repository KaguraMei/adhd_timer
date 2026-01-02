/**
 * 颜色配置类型定义
 */
export interface ColorConfig {
  backgroundColor: string;      // 背景色
  containerBackground: string;  // 容器背景色
  textColor: string;            // 文本颜色
  primaryColor: string;         // 主题色
  secondaryColor: string;       // 次主题色
}

/**
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark' | 'custom';

/**
 * 样式配置
 */
export interface StyleConfig {
  gridSize: number;      // 方块大小 (10-50)
  borderRadius: number;  // 圆角大小 (0-20)
}

/**
 * 完整主题配置
 */
export interface ThemeConfig {
  mode: ThemeMode;
  colors: ColorConfig;
  styles: StyleConfig;
}

/**
 * 明亮主题预设
 */
export const LIGHT_THEME: ColorConfig = {
  backgroundColor: '#ffffff',
  containerBackground: '#f5f5f5',
  textColor: '#000000',
  primaryColor: '#007AFF',
  secondaryColor: '#000000'
};

/**
 * 暗黑主题预设
 */
export const DARK_THEME: ColorConfig = {
  backgroundColor: '#000000',
  containerBackground: '#111111',
  textColor: '#ffffff',
  primaryColor: '#FF9500',
  secondaryColor: '#ffffff'
};

/**
 * 默认颜色配置（明亮主题）
 */
export const DEFAULT_COLORS: ColorConfig = LIGHT_THEME;

/**
 * 默认样式配置
 */
export const DEFAULT_STYLES: StyleConfig = {
  gridSize: 20,
  borderRadius: 2
};
