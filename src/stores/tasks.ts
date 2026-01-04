import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Task, TaskPriority, TaskStatus } from '@/types/task';

const STORAGE_KEY = 'adhd-timer-tasks';

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);

  /**
   * 从 localStorage 加载任务
   */
  const loadTasks = (): void => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        tasks.value = JSON.parse(saved);
        console.log('Tasks loaded from localStorage:', tasks.value.length);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  /**
   * 保存任务到 localStorage
   */
  const saveTasks = (): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.value));
      console.log('Tasks saved to localStorage:', tasks.value.length);
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  };

  /**
   * 添加任务
   */
  const addTask = (title: string, priority: TaskPriority = 'medium'): void => {
    const task: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      priority,
      status: 'todo',
      createdAt: Date.now()
    };
    
    tasks.value.unshift(task);
    saveTasks();
  };

  /**
   * 更新任务状态
   */
  const updateTaskStatus = (taskId: string, status: TaskStatus): void => {
    const task = tasks.value.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      if (status === 'completed') {
        task.completedAt = Date.now();
      } else {
        delete task.completedAt;
      }
      saveTasks();
    }
  };

  /**
   * 切换任务状态（循环：todo -> in-progress -> completed -> todo）
   */
  const toggleTaskStatus = (taskId: string): void => {
    const task = tasks.value.find(t => t.id === taskId);
    if (task) {
      if (task.status === 'todo') {
        task.status = 'in-progress';
      } else if (task.status === 'in-progress') {
        task.status = 'completed';
        task.completedAt = Date.now();
      } else {
        task.status = 'todo';
        delete task.completedAt;
      }
      saveTasks();
    }
  };

  /**
   * 删除任务
   */
  const deleteTask = (taskId: string): void => {
    const index = tasks.value.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks.value.splice(index, 1);
      saveTasks();
    }
  };

  /**
   * 更新任务
   */
  const updateTask = (taskId: string, updates: Partial<Task>): void => {
    const task = tasks.value.find(t => t.id === taskId);
    if (task) {
      Object.assign(task, updates);
      saveTasks();
    }
  };

  /**
   * 清除所有已完成的任务
   */
  const clearCompletedTasks = (): void => {
    tasks.value = tasks.value.filter(t => t.status !== 'completed');
    saveTasks();
  };

  // 计算属性
  const todoTasks = computed(() => tasks.value.filter(t => t.status === 'todo'));
  const inProgressTasks = computed(() => tasks.value.filter(t => t.status === 'in-progress'));
  const completedTasks = computed(() => tasks.value.filter(t => t.status === 'completed'));
  
  const stats = computed(() => ({
    total: tasks.value.length,
    todo: todoTasks.value.length,
    inProgress: inProgressTasks.value.length,
    completed: completedTasks.value.length,
    completionRate: tasks.value.length > 0 
      ? Math.round((completedTasks.value.length / tasks.value.length) * 100) 
      : 0
  }));

  return {
    // State
    tasks,
    todoTasks,
    inProgressTasks,
    completedTasks,
    stats,
    
    // Actions
    loadTasks,
    saveTasks,
    addTask,
    updateTaskStatus,
    toggleTaskStatus,
    deleteTask,
    updateTask,
    clearCompletedTasks
  };
});
