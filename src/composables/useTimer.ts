/**
 * useTimer - 倒计时管理 composable
 * 管理倒计时状态和逻辑
 * 使用单例模式确保状态在组件间共享
 * 依赖全局时间 Store，避免创建独立定时器
 */

import { ref, computed, watch, type Ref, type ComputedRef } from 'vue';
import { useTimeStore } from '@/stores/time';

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

// 单例状态 - 在模块级别定义，确保状态持久化
const totalSeconds = ref<number>(0);
const remainingSeconds = ref<number>(0);
const isRunning = ref<boolean>(false);
const endTime = ref<number>(0); // 结束时间戳

export function useTimer(): TimerComposable {
  const timeStore = useTimeStore();

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
   * 根据全局时间更新剩余秒数
   */
  watch(() => timeStore.timestamp, (currentTimestamp) => {
    if (!isRunning.value || endTime.value === 0) return;

    const remaining = Math.ceil((endTime.value - currentTimestamp) / 1000);
    
    if (remaining <= 0) {
      // 倒计时结束
      remainingSeconds.value = 0;
      pause();
    } else {
      remainingSeconds.value = remaining;
    }
  });

  /**
   * 开始倒计时
   */
  const start = (): void => {
    if (remainingSeconds.value <= 0) {
      return;
    }

    isRunning.value = true;
    // 计算结束时间戳
    endTime.value = Date.now() + remainingSeconds.value * 1000;
  };

  /**
   * 暂停倒计时
   */
  const pause = (): void => {
    isRunning.value = false;
    endTime.value = 0;
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
