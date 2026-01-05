import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ThemeMode, ColorConfig, StyleConfig } from '@/types/theme';

const STORAGE_KEY = 'adhd-timer-settings';

interface Settings {
  theme: {
    mode: ThemeMode;
    colors?: ColorConfig; // 只在 custom 模式下存储
    styles: StyleConfig;
  };
  animations: {
    enabled: boolean;
  };
  dayStartTime: {
    hour: number;
    minute: number;
    countAsPreviousDay: boolean; // 早于开始时间是否算作前一天
  };
}

const defaultSettings = {
  theme: {
    mode: 'light' as ThemeMode,
    colors: {
      backgroundColor: '#ffffff',
      containerBackground: '#f5f5f5',
      textColor: '#000000',
      primaryColor: '#FF9500',
      secondaryColor: '#333333'
    } as ColorConfig,
    styles: {
      gridSize: 20,
      borderRadius: 2
    } as StyleConfig
  },
  animations: {
    enabled: true
  },
  dayStartTime: {
    hour: 0,
    minute: 0,
    countAsPreviousDay: true // 默认：早于开始时间算作前一天
  }
};

export const useSettingsStore = defineStore('settings', () => {
  // 主题设置
  const themeMode = ref<ThemeMode>(defaultSettings.theme.mode);
  const colors = ref<ColorConfig>({ ...defaultSettings.theme.colors });
  const styles = ref<StyleConfig>({ ...defaultSettings.theme.styles });
  
  // 动画设置
  const animationsEnabled = ref(defaultSettings.animations.enabled);
  
  // 每日开始时间设置
  const dayStartTime = ref({ ...defaultSettings.dayStartTime });

  /**
   * 从 localStorage 加载设置
   */
  const loadSettings = (): void => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const settings: Settings = JSON.parse(saved);
        
        // 加载主题设置
        if (settings.theme) {
          themeMode.value = settings.theme.mode || defaultSettings.theme.mode;
          
          // 只在自定义模式下加载保存的颜色，否则使用默认主题颜色
          if (themeMode.value === 'custom' && settings.theme.colors) {
            colors.value = { ...defaultSettings.theme.colors, ...settings.theme.colors };
          } else {
            // 对于 light 和 dark 模式，使用默认颜色（会在 useTheme 中应用）
            colors.value = { ...defaultSettings.theme.colors };
          }
          
          styles.value = { ...defaultSettings.theme.styles, ...settings.theme.styles };
        }
        
        // 加载动画设置
        if (settings.animations !== undefined) {
          animationsEnabled.value = settings.animations.enabled;
        }
        
        // 加载每日开始时间设置
        if (settings.dayStartTime) {
          dayStartTime.value = { ...defaultSettings.dayStartTime, ...settings.dayStartTime };
        }
        
        console.log('Settings loaded from localStorage', { 
          mode: themeMode.value, 
          hasCustomColors: themeMode.value === 'custom' && !!settings.theme.colors 
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  /**
   * 保存设置到 localStorage
   */
  const saveSettings = (): void => {
    try {
      const themeData: { mode: ThemeMode; colors?: ColorConfig; styles: StyleConfig } = {
        mode: themeMode.value,
        styles: { ...styles.value }
      };
      
      // 只在自定义模式下保存颜色配置
      if (themeMode.value === 'custom') {
        themeData.colors = { ...colors.value };
      }
      
      const settings: Settings = {
        theme: themeData,
        animations: {
          enabled: animationsEnabled.value
        },
        dayStartTime: { ...dayStartTime.value }
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      console.log('Settings saved to localStorage', { mode: themeMode.value, hasCustomColors: themeMode.value === 'custom' });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  /**
   * 更新主题模式
   */
  const setThemeMode = (mode: ThemeMode): void => {
    themeMode.value = mode;
    saveSettings();
  };

  /**
   * 更新颜色配置（不改变模式）
   */
  const updateColorOnly = (key: keyof ColorConfig, value: string): void => {
    colors.value[key] = value;
  };

  /**
   * 更新颜色配置（会自动切换到自定义模式）
   */
  const updateColor = (key: keyof ColorConfig, value: string): void => {
    colors.value[key] = value;
    // 自动切换到自定义模式
    if (themeMode.value !== 'custom') {
      themeMode.value = 'custom';
    }
    saveSettings();
  };

  /**
   * 更新样式配置
   */
  const updateStyle = (key: keyof StyleConfig, value: number): void => {
    styles.value[key] = value;
    saveSettings();
  };

  /**
   * 切换动画开关
   */
  const toggleAnimations = (): void => {
    animationsEnabled.value = !animationsEnabled.value;
    saveSettings();
  };

  /**
   * 设置动画开关
   */
  const setAnimationsEnabled = (enabled: boolean): void => {
    animationsEnabled.value = enabled;
    saveSettings();
  };

  /**
   * 设置每日开始时间
   */
  const setDayStartTime = (hour: number, minute: number, countAsPreviousDay?: boolean): void => {
    dayStartTime.value = { 
      hour, 
      minute,
      countAsPreviousDay: countAsPreviousDay ?? dayStartTime.value.countAsPreviousDay
    };
    saveSettings();
  };

  /**
   * 重置所有设置
   */
  const resetSettings = (): void => {
    themeMode.value = defaultSettings.theme.mode;
    colors.value = { ...defaultSettings.theme.colors };
    styles.value = { ...defaultSettings.theme.styles };
    animationsEnabled.value = defaultSettings.animations.enabled;
    dayStartTime.value = { ...defaultSettings.dayStartTime };
    saveSettings();
  };

  return {
    // State
    themeMode,
    colors,
    styles,
    animationsEnabled,
    dayStartTime,
    
    // Actions
    loadSettings,
    saveSettings,
    setThemeMode,
    updateColor,
    updateColorOnly,
    updateStyle,
    toggleAnimations,
    setAnimationsEnabled,
    setDayStartTime,
    resetSettings
  };
});
