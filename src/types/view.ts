/**
 * 视图模式类型定义
 */
export type ViewMode = 'today' | 'week' | 'month' | 'year' | 'life' | 'task' | 'countdown';

/**
 * 视图模式枚举
 */
export enum ViewModeEnum {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  LIFE = 'life',
  TASK = 'task',
  COUNTDOWN = 'countdown'
}

/**
 * 视图标签配置
 */
export interface ViewTab {
  mode: ViewMode;
  label: string;
}

/**
 * 默认视图标签列表
 */
export const VIEW_TABS: ViewTab[] = [
  { mode: 'today', label: '今日' },
  { mode: 'week', label: '本周' },
  { mode: 'month', label: '本月' },
  { mode: 'year', label: '本年' },
  { mode: 'life', label: '人生' },
  { mode: 'task', label: '任务' },
  { mode: 'countdown', label: '倒计时' }
];
