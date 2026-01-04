import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const STORAGE_KEY = 'adhd-timer-countdown';

export const useTimerStore = defineStore('timer', () => {
  const totalSeconds = ref(0);
  const remainingSeconds = ref(0);
  const isRunning = ref(false);
  let intervalId: number | null = null;

  /**
   * 从 localStorage 加载倒计时设置
   */
  const loadTimer = (): void => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        totalSeconds.value = data.totalSeconds || 0;
        remainingSeconds.value = data.remainingSeconds || 0;
        // 不恢复运行状态，总是从暂停状态开始
        isRunning.value = false;
        console.log('Timer loaded from localStorage');
      }
    } catch (error) {
      console.error('Failed to load timer:', error);
    }
  };

  /**
   * 保存倒计时设置到 localStorage
   */
  const saveTimer = (): void => {
    try {
      const data = {
        totalSeconds: totalSeconds.value,
        remainingSeconds: remainingSeconds.value
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save timer:', error);
    }
  };

  /**
   * 格式化显示时间 (MM:SS)
   */
  const displayTime = computed(() => {
    const minutes = Math.floor(remainingSeconds.value / 60);
    const seconds = remainingSeconds.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  /**
   * 计算进度百分比 (0-100)
   */
  const progress = computed(() => {
    if (totalSeconds.value === 0) return 0;
    const elapsed = totalSeconds.value - remainingSeconds.value;
    return (elapsed / totalSeconds.value) * 100;
  });

  /**
   * 清除定时器
   */
  const clearTimer = (): void => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  /**
   * 开始倒计时
   */
  const start = (): void => {
    if (remainingSeconds.value <= 0) {
      return;
    }

    isRunning.value = true;
    clearTimer();
    
    intervalId = setInterval(() => {
      if (remainingSeconds.value > 0) {
        remainingSeconds.value--;
        saveTimer();
      } else {
        pause();
      }
    }, 1000) as unknown as number;
  };

  /**
   * 暂停倒计时
   */
  const pause = (): void => {
    isRunning.value = false;
    clearTimer();
    saveTimer();
  };

  /**
   * 重置倒计时
   */
  const reset = (): void => {
    pause();
    remainingSeconds.value = totalSeconds.value;
    saveTimer();
  };

  /**
   * 设置倒计时时长
   */
  const setDuration = (minutes: number): void => {
    if (isRunning.value) {
      return;
    }

    const seconds = minutes * 60;
    totalSeconds.value = seconds;
    remainingSeconds.value = seconds;
    saveTimer();
  };

  return {
    // State
    totalSeconds,
    remainingSeconds,
    isRunning,
    displayTime,
    progress,
    
    // Actions
    loadTimer,
    saveTimer,
    start,
    pause,
    reset,
    setDuration
  };
});
