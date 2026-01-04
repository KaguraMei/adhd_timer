<template>
  <div class="app-footer">
    <div class="footer-content">
      <div class="day-start-time">
        每日开始于: {{ dayStartTimeText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSettingsStore } from '../../stores/settings';
import { formatTime } from '../../utils/dateUtils';

const settingsStore = useSettingsStore();

const dayStartTimeText = computed(() => {
  return formatTime(settingsStore.dayStartTime.hour, settingsStore.dayStartTime.minute);
});
</script>

<style scoped>
.app-footer {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-container-bg);
  border-top: 1px solid var(--color-inactive);
  flex-shrink: 0;
}

.footer-content {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.day-start-time {
  font-size: 14px;
  color: var(--color-text);
  opacity: 0.7;
  font-weight: 500;
  padding: 4px 12px;
  background-color: var(--color-background);
  border-radius: 12px;
  transition: opacity 0.3s ease;
}

.day-start-time:hover {
  opacity: 1;
}

@media (max-width: 480px) {
  .app-footer {
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .day-start-time {
    font-size: 12px;
    padding: 3px 10px;
  }
}
</style>
