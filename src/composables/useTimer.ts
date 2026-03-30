/**
 * useTimer - 倒计时管理 composable
 * 使用 Tauri 后端定时器，避免前端挂起时计时不准确
 * 使用单例模式确保状态在组件间共享
 */

import { ref, computed, onMounted, onUnmounted, type Ref, type ComputedRef } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';
import { useSettingsStore } from '@/stores/settings';
import { playSound } from '@/utils/soundUtils';

interface TimerState {
  total_seconds: number;
  remaining_seconds: number;
  is_running: boolean;
  end_time: number | null;
}

interface TimerComposable {
  totalSeconds: Ref<number>;
  remainingSeconds: Ref<number>;
  isRunning: Ref<boolean>;
  displayTime: ComputedRef<string>;
  progress: ComputedRef<number>;
  start: () => Promise<void>;
  pause: () => Promise<void>;
  reset: () => Promise<void>;
  setDuration: (minutes: number) => Promise<void>;
  syncState: () => Promise<void>;
}

// 单例状态 - 在模块级别定义，确保状态持久化
const totalSeconds = ref<number>(0);
const remainingSeconds = ref<number>(0);
const isRunning = ref<boolean>(false);

// 事件监听器
let unlistenTick: UnlistenFn | null = null;
let unlistenFinished: UnlistenFn | null = null;
let isListenerSetup = false;

export function useTimer(): TimerComposable {
  const settingsStore = useSettingsStore();

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
   * 从 Tauri 后端同步状态
   */
  const syncState = async (): Promise<void> => {
    try {
      const state = await invoke<TimerState>('timer_get_state');
      totalSeconds.value = state.total_seconds;
      remainingSeconds.value = state.remaining_seconds;
      isRunning.value = state.is_running;
    } catch (error) {
      console.error('Failed to sync timer state:', error);
    }
  };

  /**
   * 设置事件监听器
   */
  const setupListeners = async (): Promise<void> => {
    if (isListenerSetup) return;

    try {
      // 监听定时器更新事件
      unlistenTick = await listen<TimerState>('timer-tick', (event) => {
        const state = event.payload;
        totalSeconds.value = state.total_seconds;
        remainingSeconds.value = state.remaining_seconds;
        isRunning.value = state.is_running;
      });

      // 监听定时器结束事件
      unlistenFinished = await listen('timer-finished', () => {
        remainingSeconds.value = 0;
        isRunning.value = false;
        
        // 播放提示音
        if (settingsStore.soundEnabled && settingsStore.timerEndSoundEnabled) {
          playSound(settingsStore.soundType, settingsStore.soundRepeatCount);
        }
      });

      isListenerSetup = true;
      console.log('Timer event listeners setup');
    } catch (error) {
      console.error('Failed to setup timer listeners:', error);
    }
  };

  /**
   * 清理事件监听器
   */
  const cleanupListeners = (): void => {
    if (unlistenTick) {
      unlistenTick();
      unlistenTick = null;
    }
    if (unlistenFinished) {
      unlistenFinished();
      unlistenFinished = null;
    }
    isListenerSetup = false;
  };

  /**
   * 开始倒计时
   */
  const start = async (): Promise<void> => {
    try {
      const state = await invoke<TimerState>('timer_start');
      totalSeconds.value = state.total_seconds;
      remainingSeconds.value = state.remaining_seconds;
      isRunning.value = state.is_running;
    } catch (error) {
      console.error('Failed to start timer:', error);
    }
  };

  /**
   * 暂停倒计时
   */
  const pause = async (): Promise<void> => {
    try {
      const state = await invoke<TimerState>('timer_pause');
      totalSeconds.value = state.total_seconds;
      remainingSeconds.value = state.remaining_seconds;
      isRunning.value = state.is_running;
    } catch (error) {
      console.error('Failed to pause timer:', error);
    }
  };

  /**
   * 重置倒计时
   */
  const reset = async (): Promise<void> => {
    try {
      const state = await invoke<TimerState>('timer_reset');
      totalSeconds.value = state.total_seconds;
      remainingSeconds.value = state.remaining_seconds;
      isRunning.value = state.is_running;
    } catch (error) {
      console.error('Failed to reset timer:', error);
    }
  };

  /**
   * 设置倒计时时长
   * @param minutes 分钟数
   */
  const setDuration = async (minutes: number): Promise<void> => {
    try {
      const state = await invoke<TimerState>('timer_set_duration', { minutes });
      totalSeconds.value = state.total_seconds;
      remainingSeconds.value = state.remaining_seconds;
      isRunning.value = state.is_running;
    } catch (error) {
      console.error('Failed to set timer duration:', error);
    }
  };

  // 初始化时设置监听器和同步状态
  onMounted(async () => {
    await setupListeners();
    await syncState();
  });

  // 清理监听器
  onUnmounted(() => {
    cleanupListeners();
  });

  return {
    totalSeconds,
    remainingSeconds,
    isRunning,
    displayTime,
    progress,
    start,
    pause,
    reset,
    setDuration,
    syncState
  };
}
