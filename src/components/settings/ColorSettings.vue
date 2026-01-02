<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>颜色设置</h2>
        <button class="close-button" @click="handleClose" aria-label="关闭">×</button>
      </div>

      <div class="modal-body">
        <div class="color-input-group">
          <label for="backgroundColor">背景色</label>
          <div class="color-input-wrapper">
            <input
              id="backgroundColor"
              type="color"
              :value="colors.backgroundColor"
              @input="handleColorChange('backgroundColor', $event)"
            />
            <input
              type="text"
              :value="colors.backgroundColor"
              @input="handleColorChange('backgroundColor', $event)"
              class="color-text-input"
            />
          </div>
        </div>

        <div class="color-input-group">
          <label for="containerBackground">容器背景色</label>
          <div class="color-input-wrapper">
            <input
              id="containerBackground"
              type="color"
              :value="colors.containerBackground"
              @input="handleColorChange('containerBackground', $event)"
            />
            <input
              type="text"
              :value="colors.containerBackground"
              @input="handleColorChange('containerBackground', $event)"
              class="color-text-input"
            />
          </div>
        </div>

        <div class="color-input-group">
          <label for="textColor">文本颜色</label>
          <div class="color-input-wrapper">
            <input
              id="textColor"
              type="color"
              :value="colors.textColor"
              @input="handleColorChange('textColor', $event)"
            />
            <input
              type="text"
              :value="colors.textColor"
              @input="handleColorChange('textColor', $event)"
              class="color-text-input"
            />
          </div>
        </div>

        <div class="color-input-group">
          <label for="primaryColor">主题色</label>
          <div class="color-input-wrapper">
            <input
              id="primaryColor"
              type="color"
              :value="colors.primaryColor"
              @input="handleColorChange('primaryColor', $event)"
            />
            <input
              type="text"
              :value="colors.primaryColor"
              @input="handleColorChange('primaryColor', $event)"
              class="color-text-input"
            />
          </div>
        </div>

        <div class="color-input-group">
          <label for="secondaryColor">次主题色</label>
          <div class="color-input-wrapper">
            <input
              id="secondaryColor"
              type="color"
              :value="colors.secondaryColor"
              @input="handleColorChange('secondaryColor', $event)"
            />
            <input
              type="text"
              :value="colors.secondaryColor"
              @input="handleColorChange('secondaryColor', $event)"
              class="color-text-input"
            />
          </div>
        </div>

        <div class="preview-section">
          <h3>预览</h3>
          <div class="preview-box">
            <div class="preview-text">示例文本</div>
            <div class="preview-grid">
              <div class="preview-grid-item inactive"></div>
              <div class="preview-grid-item active"></div>
              <div class="preview-grid-item highlight"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="button button-secondary" @click="handleReset">
          恢复默认
        </button>
        <button class="button button-primary" @click="handleSave">
          保存
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useTheme } from '../../composables/useTheme';
import { useAnimation } from '../../composables/useAnimation';
import type { ColorConfig } from '../../types/theme';

interface Props {
  visible: boolean;
}

interface Emits {
  (e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { colors, updateColor, saveTheme, resetTheme } = useTheme();
const { fadeIn, fadeOut, scaleIn } = useAnimation();

const isVisible = ref(props.visible);

/**
 * 处理颜色变化
 */
const handleColorChange = (key: keyof ColorConfig, event: Event): void => {
  const target = event.target as HTMLInputElement;
  updateColor(key, target.value);
};

/**
 * 处理保存按钮点击
 */
const handleSave = (): void => {
  saveTheme();
  handleClose();
};

/**
 * 处理恢复默认按钮点击
 */
const handleReset = (): void => {
  resetTheme();
};

/**
 * 处理关闭按钮点击
 */
const handleClose = (): void => {
  emit('close');
};

/**
 * 处理遮罩层点击
 */
const handleOverlayClick = (): void => {
  handleClose();
};

/**
 * 监听 visible prop 变化
 */
watch(() => props.visible, (newValue) => {
  if (newValue) {
    isVisible.value = true;
    // 延迟执行动画，确保 DOM 已渲染
    setTimeout(() => {
      fadeIn('.modal-overlay', 300);
      scaleIn('.modal-content', 400);
    }, 10);
  } else {
    fadeOut('.modal-overlay', 300).then(() => {
      isVisible.value = false;
    });
  }
});

/**
 * 处理 ESC 键关闭
 */
const handleKeyDown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && props.visible) {
    handleClose();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
  if (props.visible) {
    setTimeout(() => {
      fadeIn('.modal-overlay', 300);
      scaleIn('.modal-content', 400);
    }, 10);
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
}

.modal-content {
  background-color: var(--color-container-bg);
  border-radius: var(--border-radius-md);
  width: 90vw;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  transform: scale(0.8);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-inactive);
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  color: var(--color-text);
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
}

.close-button:hover {
  color: var(--color-primary);
}

.modal-body {
  padding: var(--spacing-md);
}

.color-input-group {
  margin-bottom: var(--spacing-md);
}

.color-input-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text);
  font-size: 14px;
}

.color-input-wrapper {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.color-input-wrapper input[type="color"] {
  width: 60px;
  height: 40px;
  border: 2px solid var(--color-inactive);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  background: none;
}

.color-text-input {
  flex: 1;
  padding: var(--spacing-sm);
  background-color: var(--color-background);
  border: 2px solid var(--color-inactive);
  border-radius: var(--border-radius-sm);
  color: var(--color-text);
  font-size: 14px;
  font-family: monospace;
}

.color-text-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.preview-section {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-inactive);
}

.preview-section h3 {
  margin: 0 0 var(--spacing-md) 0;
  font-size: 18px;
  color: var(--color-text);
}

.preview-box {
  background-color: var(--color-background);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
}

.preview-text {
  color: var(--color-text);
  font-size: 18px;
  margin-bottom: var(--spacing-md);
}

.preview-grid {
  display: flex;
  gap: var(--spacing-sm);
}

.preview-grid-item {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-sm);
}

.preview-grid-item.inactive {
  background-color: var(--color-inactive);
}

.preview-grid-item.active {
  background-color: var(--color-secondary);
}

.preview-grid-item.highlight {
  background-color: var(--color-primary);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-inactive);
}

.button {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-lg);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.button-primary {
  background-color: var(--color-primary);
  color: #000;
}

.button-primary:hover {
  opacity: 0.8;
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
  .modal-content {
    width: 95vw;
  }

  .modal-header h2 {
    font-size: 20px;
  }

  .color-input-wrapper input[type="color"] {
    width: 50px;
    height: 35px;
  }

  .color-text-input {
    font-size: 12px;
  }
}
</style>
