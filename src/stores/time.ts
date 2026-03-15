import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getAdjustedDate } from '@/utils/dateUtils';
import { useSettingsStore } from './settings';

/**
 * 全局时间管理 Store
 * 统一管理所有组件的时间更新，避免多个定时器
 * 考虑自定义每日开始时间
 */
export const useTimeStore = defineStore('time', () => {
  // 当前时间（每秒更新）
  const currentTime = ref(new Date());
  
  // 上次更新的调整后日期（用于检测日期变化）
  const lastAdjustedDate = ref(0);
  const lastAdjustedMonth = ref(0);
  const lastAdjustedYear = ref(0);
  
  // 定时器引用
  let updateInterval: number | null = null;
  
  /**
   * 获取调整后的当前日期（考虑每日开始时间）
   */
  const getAdjustedNow = (): Date => {
    const settingsStore = useSettingsStore();
    return getAdjustedDate(currentTime.value, settingsStore.dayStartTime);
  };
  
  /**
   * 更新当前时间
   */
  const updateTime = () => {
    const now = new Date();
    currentTime.value = now;
    
    // 获取调整后的日期
    const adjusted = getAdjustedNow();
    const adjustedDate = adjusted.getDate();
    const adjustedMonth = adjusted.getMonth();
    const adjustedYear = adjusted.getFullYear();
    
    // 检测调整后日期的变化
    if (adjustedDate !== lastAdjustedDate.value) {
      lastAdjustedDate.value = adjustedDate;
      console.log('Adjusted date changed:', adjusted.toLocaleDateString());
    }
    
    if (adjustedMonth !== lastAdjustedMonth.value) {
      lastAdjustedMonth.value = adjustedMonth;
      console.log('Adjusted month changed:', adjusted.toLocaleDateString());
    }
    
    if (adjustedYear !== lastAdjustedYear.value) {
      lastAdjustedYear.value = adjustedYear;
      console.log('Adjusted year changed:', adjusted.getFullYear());
    }
  };
  
  /**
   * 启动时间更新
   */
  const startTimeUpdates = () => {
    if (updateInterval !== null) return;
    
    // 初始化调整后日期
    const adjusted = getAdjustedNow();
    lastAdjustedDate.value = adjusted.getDate();
    lastAdjustedMonth.value = adjusted.getMonth();
    lastAdjustedYear.value = adjusted.getFullYear();
    
    // 根据设置确定刷新间隔
    const settingsStore = useSettingsStore();
    const interval = settingsStore.powerSavingEnabled 
      ? settingsStore.refreshInterval * 1000 
      : 1000;
    
    // 启动定时更新
    updateInterval = window.setInterval(updateTime, interval);
    console.log(`Time updates started with ${interval}ms interval`);
  };
  
  /**
   * 停止时间更新
   */
  const stopTimeUpdates = () => {
    if (updateInterval !== null) {
      clearInterval(updateInterval);
      updateInterval = null;
      console.log('Time updates stopped');
    }
  };
  
  /**
   * 重启时间更新（用于刷新间隔变化时）
   */
  const restartTimeUpdates = () => {
    stopTimeUpdates();
    startTimeUpdates();
  };
  
  // 计算属性：用于触发依赖更新
  
  /**
   * 当前时间戳（每秒变化）
   */
  const timestamp = computed(() => currentTime.value.getTime());
  
  /**
   * 当前调整后的日期字符串（每天变化，考虑自定义开始时间）
   */
  const dateString = computed(() => {
    const adjusted = getAdjustedNow();
    return `${adjusted.getFullYear()}-${adjusted.getMonth() + 1}-${adjusted.getDate()}`;
  });
  
  /**
   * 当前调整后的月份字符串（每月变化，考虑自定义开始时间）
   */
  const monthString = computed(() => {
    const adjusted = getAdjustedNow();
    return `${adjusted.getFullYear()}-${adjusted.getMonth() + 1}`;
  });
  
  /**
   * 当前调整后的年份（每年变化，考虑自定义开始时间）
   */
  const year = computed(() => {
    const adjusted = getAdjustedNow();
    return adjusted.getFullYear();
  });
  
  /**
   * 当前小时（每小时变化）
   */
  const hour = computed(() => currentTime.value.getHours());
  
  /**
   * 当前分钟（每分钟变化）
   */
  const minute = computed(() => currentTime.value.getMinutes());
  
  /**
   * 当前秒（每秒变化）
   */
  const second = computed(() => currentTime.value.getSeconds());
  
  return {
    // State
    currentTime,
    timestamp,
    dateString,
    monthString,
    year,
    hour,
    minute,
    second,
    
    // Actions
    startTimeUpdates,
    stopTimeUpdates,
    restartTimeUpdates,
    updateTime
  };
});
