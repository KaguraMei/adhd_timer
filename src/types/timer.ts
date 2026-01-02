/**
 * 倒计时状态类型定义
 */
export interface CountdownState {
  totalSeconds: number;      // 总秒数
  remainingSeconds: number;  // 剩余秒数
  isRunning: boolean;        // 是否运行中
  selectedMinutes: number;   // 选择的分钟数
}

/**
 * 计时器操作接口
 */
export interface TimerOperations {
  start: () => void;
  pause: () => void;
  reset: () => void;
  setDuration: (minutes: number) => void;
}
