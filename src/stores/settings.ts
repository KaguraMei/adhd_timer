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
  sound: {
    enabled: boolean;
    timerEndSound: boolean;
    soundType: 'bell' | 'chime' | 'beep' | 'ding' | 'gentle';
    repeatCount: number;
  };
  dayStartTime: {
    hour: number;
    minute: number;
    countAsPreviousDay: boolean; // 早于开始时间是否算作前一天
  };
  powerSaving: {
    enabled: boolean;
    refreshInterval: 1 | 30 | 60; // 刷新间隔（秒）：1=正常, 30=半分钟, 60=一分钟
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
  sound: {
    enabled: true,
    timerEndSound: true,
    soundType: 'bell' as 'bell' | 'chime' | 'beep' | 'ding' | 'gentle',
    repeatCount: 1
  },
  dayStartTime: {
    hour: 0,
    minute: 0,
    countAsPreviousDay: true // 默认：早于开始时间算作前一天
  },
  powerSaving: {
    enabled: false,
    refreshInterval: 1 as 1 | 30 | 60 // 默认每秒刷新
  }
};

export const useSettingsStore = defineStore('settings', () => {
  // 主题设置
  const themeMode = ref<ThemeMode>(defaultSettings.theme.mode);
  const colors = ref<ColorConfig>({ ...defaultSettings.theme.colors });
  const styles = ref<StyleConfig>({ ...defaultSettings.theme.styles });
  
  // 动画设置
  const animationsEnabled = ref(defaultSettings.animations.enabled);
  
  // 音效设置
  const soundEnabled = ref(defaultSettings.sound.enabled);
  const timerEndSoundEnabled = ref(defaultSettings.sound.timerEndSound);
  const soundType = ref(defaultSettings.sound.soundType);
  const soundRepeatCount = ref(defaultSettings.sound.repeatCount);
  
  // 每日开始时间设置
  const dayStartTime = ref({ ...defaultSettings.dayStartTime });
  
  // 省电模式设置
  const powerSavingEnabled = ref(defaultSettings.powerSaving.enabled);
  const refreshInterval = ref(defaultSettings.powerSaving.refreshInterval);

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
        
        // 加载音效设置
        if (settings.sound !== undefined) {
          soundEnabled.value = settings.sound.enabled ?? defaultSettings.sound.enabled;
          timerEndSoundEnabled.value = settings.sound.timerEndSound ?? defaultSettings.sound.timerEndSound;
          soundType.value = settings.sound.soundType ?? defaultSettings.sound.soundType;
          soundRepeatCount.value = settings.sound.repeatCount ?? defaultSettings.sound.repeatCount;
        }
        
        // 加载每日开始时间设置
        if (settings.dayStartTime) {
          dayStartTime.value = { ...defaultSettings.dayStartTime, ...settings.dayStartTime };
        }
        
        // 加载省电模式设置
        if (settings.powerSaving !== undefined) {
          powerSavingEnabled.value = settings.powerSaving.enabled ?? defaultSettings.powerSaving.enabled;
          refreshInterval.value = settings.powerSaving.refreshInterval ?? defaultSettings.powerSaving.refreshInterval;
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
        sound: {
          enabled: soundEnabled.value,
          timerEndSound: timerEndSoundEnabled.value,
          soundType: soundType.value,
          repeatCount: soundRepeatCount.value
        },
        dayStartTime: { ...dayStartTime.value },
        powerSaving: {
          enabled: powerSavingEnabled.value,
          refreshInterval: refreshInterval.value
        }
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
   * 设置音效开关
   */
  const setSoundEnabled = (enabled: boolean): void => {
    soundEnabled.value = enabled;
    saveSettings();
  };

  /**
   * 设置倒计时结束音效
   */
  const setTimerEndSoundEnabled = (enabled: boolean): void => {
    timerEndSoundEnabled.value = enabled;
    saveSettings();
  };

  /**
   * 设置音效类型
   */
  const setSoundType = (type: 'bell' | 'chime' | 'beep' | 'ding' | 'gentle'): void => {
    soundType.value = type;
    saveSettings();
  };

  /**
   * 设置音效重复次数
   */
  const setSoundRepeatCount = (count: number): void => {
    soundRepeatCount.value = Math.max(1, Math.min(count, 5)); // 限制在1-5次
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
   * 设置省电模式
   */
  const setPowerSavingEnabled = (enabled: boolean): void => {
    powerSavingEnabled.value = enabled;
    saveSettings();
  };

  /**
   * 设置刷新间隔
   */
  const setRefreshInterval = (interval: 1 | 30 | 60): void => {
    refreshInterval.value = interval;
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
    soundEnabled.value = defaultSettings.sound.enabled;
    timerEndSoundEnabled.value = defaultSettings.sound.timerEndSound;
    soundType.value = defaultSettings.sound.soundType;
    soundRepeatCount.value = defaultSettings.sound.repeatCount;
    dayStartTime.value = { ...defaultSettings.dayStartTime };
    powerSavingEnabled.value = defaultSettings.powerSaving.enabled;
    refreshInterval.value = defaultSettings.powerSaving.refreshInterval;
    saveSettings();
  };

  return {
    // State
    themeMode,
    colors,
    styles,
    animationsEnabled,
    soundEnabled,
    timerEndSoundEnabled,
    soundType,
    soundRepeatCount,
    dayStartTime,
    powerSavingEnabled,
    refreshInterval,
    
    // Actions
    loadSettings,
    saveSettings,
    setThemeMode,
    updateColor,
    updateColorOnly,
    updateStyle,
    toggleAnimations,
    setAnimationsEnabled,
    setSoundEnabled,
    setTimerEndSoundEnabled,
    setSoundType,
    setSoundRepeatCount,
    setDayStartTime,
    setPowerSavingEnabled,
    setRefreshInterval,
    resetSettings
  };
});
