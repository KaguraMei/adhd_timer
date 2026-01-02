<template>
  <div class="life-view">
    <div class="view-header">
      <div class="current-info">{{ ageDisplay }}</div>
      <h2 class="life-title">人生进度</h2>
    </div>
    <div class="life-content">
      <!-- 配置表单 -->
      <div v-if="showConfig" class="config-form">
        <div class="form-group">
          <label for="birthdate">出生日期</label>
          <input
            id="birthdate"
            type="date"
            v-model="formData.birthdate"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="lifeExpectancy">预期寿命（岁）</label>
          <input
            id="lifeExpectancy"
            type="number"
            min="1"
            max="120"
            v-model.number="formData.lifeExpectancy"
            class="form-input"
          />
        </div>
        <button @click="saveConfig" class="save-button">
          保存
        </button>
      </div>

      <!-- 人生进度显示 -->
      <div v-else class="progress-content">
        <GridDisplay 
          :total="config!.lifeExpectancy" 
          :current="Math.floor(yearsLived)" 
        />
        <ProgressBar :percentage="progressPercentage" />
        <StatsDisplay :text="statsText" />
        <button @click="showConfig = true" class="edit-button">
          编辑配置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStorage } from '@/composables/useStorage';
import { useTimeCalc } from '@/composables/useTimeCalc';
import GridDisplay from '@/components/shared/GridDisplay.vue';
import ProgressBar from '@/components/shared/ProgressBar.vue';
import StatsDisplay from '@/components/shared/StatsDisplay.vue';

interface LifeConfig {
  birthdate: string;
  lifeExpectancy: number;
}

const STORAGE_KEY = 'adhd-timer-life-config';

const { get, set } = useStorage();
const { calculateYearsLived } = useTimeCalc();

// 状态
const config = ref<LifeConfig | null>(null);
const showConfig = ref<boolean>(true);
const formData = ref<LifeConfig>({
  birthdate: '',
  lifeExpectancy: 80
});

// 计算已度过的年数
const yearsLived = computed(() => {
  if (!config.value?.birthdate) return 0;
  return calculateYearsLived(config.value.birthdate);
});

// 年龄显示（左上角）
const ageDisplay = computed(() => {
  if (!config.value?.birthdate) return '未配置';
  return `${Math.floor(yearsLived.value)}岁`;
});

// 计算进度百分比
const progressPercentage = computed(() => {
  if (!config.value) return 0;
  return Math.round((yearsLived.value / config.value.lifeExpectancy) * 100);
});

// 统计信息文本
const statsText = computed(() => {
  return `已度过 ${yearsLived.value.toFixed(1)} 年`;
});

// 保存配置
const saveConfig = () => {
  // 验证输入
  if (!formData.value.birthdate) {
    alert('请输入出生日期');
    return;
  }
  
  if (formData.value.lifeExpectancy < 1 || formData.value.lifeExpectancy > 120) {
    alert('预期寿命必须在 1-120 岁之间');
    return;
  }

  // 验证日期不能是未来
  const birthDate = new Date(formData.value.birthdate);
  if (birthDate > new Date()) {
    alert('出生日期不能是未来日期');
    return;
  }

  // 保存配置
  config.value = { ...formData.value };
  set(STORAGE_KEY, config.value);
  showConfig.value = false;
};

// 加载配置
const loadConfig = () => {
  const savedConfig = get<LifeConfig>(STORAGE_KEY);
  if (savedConfig && savedConfig.birthdate && savedConfig.lifeExpectancy) {
    config.value = savedConfig;
    formData.value = { ...savedConfig };
    showConfig.value = false;
  } else {
    showConfig.value = true;
  }
};

// 初始化
onMounted(() => {
  loadConfig();
});
</script>

<style scoped>
.life-view {
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

.life-title {
  font-size: 48px;
  font-weight: 300;
  text-align: center;
  margin: 0;
  color: var(--color-text, #ffffff);
}

.life-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 20px);
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 20px);
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs, 5px);
}

.form-group label {
  font-size: 14px;
  color: var(--color-muted, #888);
  font-weight: 500;
}

.form-input {
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid var(--color-inactive, #333);
  border-radius: 8px;
  background-color: var(--color-container-bg, #111);
  color: var(--color-text, #ffffff);
  outline: none;
  transition: border-color var(--transition-fast, 0.3s) ease;
}

.form-input:focus {
  border-color: var(--color-primary, #FF9500);
}

.form-input[type="number"] {
  -moz-appearance: textfield;
}

.form-input[type="number"]::-webkit-inner-spin-button,
.form-input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.save-button,
.edit-button {
  padding: 12px 30px;
  font-size: 16px;
  border: none;
  border-radius: var(--border-radius-lg, 30px);
  cursor: pointer;
  transition: all var(--transition-fast, 0.3s) ease;
  font-weight: 500;
  background-color: var(--color-primary, #FF9500);
  color: var(--color-background, #000);
  align-self: center;
}

.save-button:hover,
.edit-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 149, 0, 0.3);
}

.save-button:active,
.edit-button:active {
  transform: scale(0.95);
}

.progress-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 20px);
}

.edit-button {
  margin-top: var(--spacing-sm, 10px);
}

@media (max-width: 480px) {
  .current-info {
    font-size: 24px;
  }
  
  .life-title {
    font-size: 40px;
  }
  
  .life-view {
    padding: var(--spacing-sm, 10px);
  }
  
  .form-input {
    padding: 10px 14px;
    font-size: 14px;
  }
  
  .save-button,
  .edit-button {
    padding: 10px 24px;
    font-size: 14px;
  }
}
</style>
