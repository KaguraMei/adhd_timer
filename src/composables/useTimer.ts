/**
 * useTimer - 倒计时管理 composable
 * 管理倒计时状态和逻辑
 */

import { ref, computed, type Ref, type ComputedRef } from 'vue';

interface TimerComposable {
  totalSeconds: Ref<number>;
  remainingSeconds: Ref<number>;
  isRunning: Ref<boolean>;
  displayTime: ComputedRef<string>;
  progress: ComputedRef<number>;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setDuration: (minutes: number) => void;
}

export function useTimer(): TimerComposable {
  const totalSeconds = ref<number>(0);
  const remainingSeconds = ref<number>(0);
  const isRunning = ref<boolean>(false);
  let intervalId: number | null = null;

  /**
   * 格式化显示时间 (MM:SS)
   */
  const displayTime = computed<string>(() => {
    const minutes = Math.floor(remainingSeconds.value / 60);
    const seconds = remainingSeconds.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  /**
   * 计算进度百分比 (0-100)
   */
  const progress = computed<number>(() => {
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
      } else {
        // 倒计时结束
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
  };

  /**
   * 重置倒计时
   */
  const reset = (): void => {
    pause();
    remainingSeconds.value = totalSeconds.value;
  };

  /**
   * 设置倒计时时长
   * @param minutes 分钟数
   */
  const setDuration = (minutes: number): void => {
    // 确保不在运行时设置时长
    if (isRunning.value) {
      return;
    }

    const seconds = minutes * 60;
    totalSeconds.value = seconds;
    remainingSeconds.value = seconds;
  };

  return {
    totalSeconds,
    remainingSeconds,
    isRunning,
    displayTime,
    progress,
    start,
    pause,
    reset,
    setDuration
  };
}
