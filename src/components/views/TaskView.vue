<template>
  <div class="task-view">
    <div class="view-header">
      <div class="current-info">{{ stats.total }} 任务</div>
      <h2 class="task-title">任务</h2>
    </div>
    
    <div class="task-content">
      <!-- 任务统计 -->
      <div class="task-stats">
        <div class="stat-item">
          <span class="stat-label">待办</span>
          <span class="stat-value">{{ stats.todo }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">进行中</span>
          <span class="stat-value">{{ stats.inProgress }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">已完成</span>
          <span class="stat-value">{{ stats.completed }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">完成率</span>
          <span class="stat-value">{{ stats.completionRate }}%</span>
        </div>
      </div>

      <!-- 添加任务按钮 -->
      <button @click="showAddModal = true" class="add-task-button">
        ➕ 添加新任务
      </button>

      <!-- 任务列表 -->
      <div class="task-list">
        <div
          v-for="task in tasks"
          :key="task.id"
          :class="['task-item', `priority-${task.priority}`, `status-${task.status}`]"
        >
          <div class="task-checkbox" @click="toggleTaskStatus(task.id)">
            <span v-if="task.status === 'completed'" class="check-icon">✓</span>
            <span v-else-if="task.status === 'in-progress'" class="progress-icon">⏳</span>
          </div>
          
          <div class="task-info">
            <div class="task-title-row">
              <span :class="['task-text', { completed: task.status === 'completed' }]">
                {{ task.title }}
              </span>
              <span :class="['priority-badge', `priority-${task.priority}`]">
                {{ priorityLabel(task.priority) }}
              </span>
            </div>
            <div v-if="task.description" class="task-description">
              {{ task.description }}
            </div>
            <div v-if="task.dueDate" class="task-meta">
              📅 {{ formatDate(task.dueDate) }}
            </div>
          </div>

          <button @click="handleDeleteTask(task.id)" class="delete-button" title="删除任务">
            🗑️
          </button>
        </div>

        <div v-if="tasks.length === 0" class="empty-state">
          <p class="empty-icon">📝</p>
          <p class="empty-text">还没有任务</p>
          <p class="empty-hint">点击上方按钮添加第一个任务！</p>
        </div>
      </div>
    </div>

    <!-- 添加任务弹窗 -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>添加新任务</h3>
          <button class="close-button" @click="closeAddModal">×</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label for="taskTitle">任务标题 *</label>
            <input
              id="taskTitle"
              v-model="newTask.title"
              type="text"
              placeholder="输入任务标题..."
              class="form-input"
              maxlength="100"
              @keyup.enter="handleAddTask"
              ref="titleInput"
            />
          </div>

          <div class="form-group">
            <label for="taskDescription">任务描述（可选）</label>
            <textarea
              id="taskDescription"
              v-model="newTask.description"
              placeholder="输入任务描述..."
              class="form-textarea"
              maxlength="500"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="taskPriority">优先级</label>
            <select id="taskPriority" v-model="newTask.priority" class="form-select">
              <option value="low">🟦 低优先级</option>
              <option value="medium">🟧 中优先级</option>
              <option value="high">🟥 高优先级</option>
            </select>
          </div>

          <div class="form-group">
            <label for="taskDueDate">截止日期（可选）</label>
            <input
              id="taskDueDate"
              v-model="newTask.dueDate"
              type="date"
              class="form-input"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeAddModal" class="button button-secondary">
            取消
          </button>
          <button @click="handleAddTask" class="button button-primary" :disabled="!newTask.title.trim()">
            添加任务
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { useTask } from '../../composables/useTask';
import type { TaskPriority } from '../../types/task';

const { tasks, stats, addTask, deleteTask, toggleTaskStatus, loadTasks } = useTask();

const showAddModal = ref(false);
const titleInput = ref<HTMLInputElement | null>(null);

const newTask = ref({
  title: '',
  description: '',
  priority: 'medium' as TaskPriority,
  dueDate: ''
});

const handleAddTask = () => {
  const title = newTask.value.title.trim();
  
  if (!title) {
    alert('请输入任务标题');
    return;
  }

  console.log('Adding task:', newTask.value);
  
  addTask(
    title,
    newTask.value.priority,
    newTask.value.dueDate || undefined
  );
  
  // 如果有描述，更新任务
  if (newTask.value.description.trim() && tasks.value.length > 0) {
    const lastTask = tasks.value[0];
    if(!lastTask) return;
    lastTask.description = newTask.value.description.trim();
  }
  
  closeAddModal();
  console.log('Task added successfully, total tasks:', tasks.value.length);
};

const closeAddModal = () => {
  showAddModal.value = false;
  newTask.value = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  };
};

const handleDeleteTask = (id: string) => {
  if (confirm('确定要删除这个任务吗？')) {
    deleteTask(id);
  }
};

const priorityLabel = (priority: TaskPriority): string => {
  const labels = {
    low: '低',
    medium: '中',
    high: '高'
  };
  return labels[priority];
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

// 监听弹窗打开，自动聚焦输入框
watch(showAddModal, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    titleInput.value?.focus();
  }
});

// 监听任务变化
watch(tasks, (newTasks) => {
  console.log('Tasks updated:', newTasks.length);
}, { deep: true });

onMounted(() => {
  console.log('TaskView mounted, loading tasks...');
  loadTasks();
});
</script>

<style scoped>
.task-view {
  width: 100%;
  padding: var(--spacing-md, 20px);
}

.view-header {
  position: relative;
  margin-bottom: var(--spacing-lg, 30px);
}

.current-info {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text, #ffffff);
  line-height: 1;
}

.task-title {
  font-size: 48px;
  font-weight: 300;
  text-align: center;
  margin: 0;
  color: var(--color-text, #ffffff);
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 20px);
}

/* 任务统计 */
.task-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.stat-item {
  background-color: var(--color-container-bg);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  text-align: center;
  transition: transform 0.3s;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-label {
  display: block;
  font-size: 12px;
  color: var(--color-muted);
  margin-bottom: var(--spacing-xs);
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
}

/* 添加任务按钮 */
.add-task-button {
  width: 100%;
  padding: 16px;
  font-size: 18px;
  font-weight: 600;
  background-color: var(--color-primary);
  color: #000;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: var(--spacing-md);
}

.add-task-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 149, 0, 0.3);
}

.add-task-button:active {
  transform: translateY(0);
}

/* 任务列表 */
.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.task-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--color-container-bg);
  border-radius: var(--border-radius-sm);
  border-left: 4px solid var(--color-inactive);
  transition: all 0.3s;
}

.task-item:hover {
  transform: translateX(4px);
}

.task-item.priority-high {
  border-left-color: #ff4444;
}

.task-item.priority-medium {
  border-left-color: var(--color-primary);
}

.task-item.priority-low {
  border-left-color: #4444ff;
}

.task-item.status-completed {
  opacity: 0.6;
}

.task-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-inactive);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
  margin-top: 2px;
}

.task-checkbox:hover {
  border-color: var(--color-primary);
  transform: scale(1.1);
}

.check-icon {
  color: var(--color-primary);
  font-size: 18px;
  font-weight: 700;
}

.progress-icon {
  font-size: 14px;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-title-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
  flex-wrap: wrap;
}

.task-text {
  font-size: 16px;
  color: var(--color-text);
  font-weight: 500;
}

.task-text.completed {
  text-decoration: line-through;
  opacity: 0.6;
}

.task-description {
  font-size: 14px;
  color: var(--color-muted);
  margin-bottom: var(--spacing-xs);
  line-height: 1.4;
}

.priority-badge {
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.priority-badge.priority-high {
  background-color: rgba(255, 68, 68, 0.2);
  color: #ff4444;
}

.priority-badge.priority-medium {
  background-color: rgba(255, 149, 0, 0.2);
  color: var(--color-primary);
}

.priority-badge.priority-low {
  background-color: rgba(68, 68, 255, 0.2);
  color: #4444ff;
}

.task-meta {
  font-size: 12px;
  color: var(--color-muted);
}

.delete-button {
  padding: 8px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.3s;
  flex-shrink: 0;
}

.delete-button:hover {
  opacity: 1;
  transform: scale(1.2);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: var(--spacing-lg) 0;
  opacity: 0.6;
}

.empty-icon {
  font-size: 80px;
  margin: 0 0 var(--spacing-md) 0;
}

.empty-text {
  font-size: 24px;
  font-weight: 500;
  color: var(--color-text);
  margin: 0 0 var(--spacing-sm) 0;
}

.empty-hint {
  font-size: 16px;
  color: var(--color-muted);
  margin: 0;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background-color: var(--color-container-bg);
  border-radius: var(--border-radius-md);
  width: 90vw;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-inactive);
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: var(--color-text);
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 32px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s;
  line-height: 1;
}

.close-button:hover {
  color: var(--color-primary);
}

.modal-body {
  padding: var(--spacing-md);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid var(--color-inactive);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-background);
  color: var(--color-text);
  outline: none;
  transition: border-color 0.3s;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  border-color: var(--color-primary);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-inactive);
}

.button {
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius-lg);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.button-primary {
  background-color: var(--color-primary);
  color: #000;
}

.button-primary:hover:not(:disabled) {
  opacity: 0.8;
}

.button-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-secondary {
  background-color: transparent;
  color: var(--color-text);
  border: 2px solid var(--color-inactive);
}

.button-secondary:hover {
  border-color: var(--color-text);
}

@media (max-width: 480px) {
  .current-info {
    font-size: 24px;
  }
  
  .task-title {
    font-size: 40px;
  }
  
  .task-view {
    padding: var(--spacing-sm, 10px);
  }

  .task-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .add-task-button {
    font-size: 16px;
    padding: 14px;
  }

  .task-item {
    padding: var(--spacing-sm);
  }

  .empty-icon {
    font-size: 60px;
  }

  .empty-text {
    font-size: 20px;
  }

  .empty-hint {
    font-size: 14px;
  }

  .modal-content {
    width: 95vw;
  }
}
</style>
