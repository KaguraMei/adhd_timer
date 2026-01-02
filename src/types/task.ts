/**
 * 任务优先级
 */
export type TaskPriority = 'low' | 'medium' | 'high';

/**
 * 任务状态
 */
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

/**
 * 任务接口
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: number;
  completedAt?: number;
  dueDate?: string;
}

/**
 * 任务统计
 */
export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  completionRate: number;
}
