<template>
  <div class="stats-display">
    <p class="stats-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text: string;
}

defineProps<Props>();
</script>

<style scoped>
.stats-display {
  text-align: center;
  padding: var(--spacing-sm, 10px) 0;
}

.stats-text {
  font-size: 16px;
  color: var(--color-muted, #888);
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.5px;
}

@media (max-width: 480px) {
  .stats-text {
    font-size: 14px;
  }
}
</style>
