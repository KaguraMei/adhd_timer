/**
 * useTask - 任务管理 composable（单例模式）
 */

import { ref, computed, type Ref } from 'vue';
import type { Task, TaskPriority, TaskStats } from '../types/task';
import { useStorage } from './useStorage';

const TASKS_STORAGE_KEY = 'adhd-timer-tasks';

interface TaskComposable {
  tasks: Ref<Task[]>;
  stats: Ref<TaskStats>;
  addTask: (title: string, priority?: TaskPriority, dueDate?: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  saveTasks: () => void;
  loadTasks: () => void;
}

// 单例状态
const storage = useStorage();
const tasks = ref<Task[]>([]);
let isInitialized = false;

export function useTask(): TaskComposable {
  /**
   * 计算任务统计
   */
  const stats = computed<TaskStats>(() => {
    const total = tasks.value.length;
    const completed = tasks.value.filter(t => t.status === 'completed').length;
    const inProgress = tasks.value.filter(t => t.status === 'in-progress').length;
    const todo = tasks.value.filter(t => t.status === 'todo').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      todo,
      completionRate
    };
  });

  /**
   * 生成唯一ID
   */
  const generateId = (): string => {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * 添加任务
   */
  const addTask = (title: string, priority: TaskPriority = 'medium', dueDate?: string): void => {
    if (!title.trim()) {
      console.warn('Task title cannot be empty');
      return;
    }

    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      priority,
      status: 'todo',
      createdAt: Date.now(),
      dueDate
    };

    tasks.value.unshift(newTask);
    saveTasks();
    console.log('Task added:', newTask);
  };

  /**
   * 更新任务
   */
  const updateTask = (id: string, updates: Partial<Task>): void => {
    const index = tasks.value.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updates } as Task;
      saveTasks();
    }
  };

  /**
   * 删除任务
   */
  const deleteTask = (id: string): void => {
    const beforeLength = tasks.value.length;
    tasks.value = tasks.value.filter(t => t.id !== id);
    if (tasks.value.length < beforeLength) {
      saveTasks();
      console.log('Task deleted:', id);
    }
  };

  /**
   * 切换任务状态
   */
  const toggleTaskStatus = (id: string): void => {
    const task = tasks.value.find(t => t.id === id);
    if (!task) return;

    if (task.status === 'todo') {
      task.status = 'in-progress';
    } else if (task.status === 'in-progress') {
      task.status = 'completed';
      task.completedAt = Date.now();
    } else {
      task.status = 'todo';
      task.completedAt = undefined;
    }

    saveTasks();
    console.log('Task status toggled:', task);
  };

  /**
   * 保存任务到 localStorage
   */
  const saveTasks = (): void => {
    storage.set(TASKS_STORAGE_KEY, tasks.value);
    console.log('Tasks saved:', tasks.value.length);
  };

  /**
   * 从 localStorage 加载任务
   */
  const loadTasks = (): void => {
    if (isInitialized) {
      console.log('Tasks already loaded');
      return;
    }

    const savedTasks = storage.get<Task[]>(TASKS_STORAGE_KEY);
    if (savedTasks && Array.isArray(savedTasks)) {
      tasks.value = savedTasks;
      console.log('Tasks loaded:', savedTasks.length);
    } else {
      console.log('No saved tasks found');
    }
    isInitialized = true;
  };

  return {
    tasks,
    stats,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    saveTasks,
    loadTasks
  };
}
