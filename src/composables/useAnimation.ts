import { ref, watch } from 'vue';
import { animate } from 'animejs';
import { stagger } from 'animejs/utils';

const STORAGE_KEY = 'adhd-timer-animations-enabled';

// 全局动画开关状态
const animationsEnabled = ref(true);

/**
 * 动画控制 composable
 */
export function useAnimation() {
  /**
   * 加载动画设置
   */
  const loadAnimationSettings = (): void => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        animationsEnabled.value = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load animation settings:', error);
    }
    
    // 应用到 document
    updateDocumentClass();
  };

  /**
   * 保存动画设置
   */
  const saveAnimationSettings = (): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(animationsEnabled.value));
    } catch (error) {
      console.error('Failed to save animation settings:', error);
    }
  };

  /**
   * 更新 document class
   */
  const updateDocumentClass = (): void => {
    if (animationsEnabled.value) {
      document.documentElement.classList.remove('no-animations');
    } else {
      document.documentElement.classList.add('no-animations');
    }
  };

  /**
   * 切换动画开关
   */
  const toggleAnimations = (): void => {
    animationsEnabled.value = !animationsEnabled.value;
    saveAnimationSettings();
    updateDocumentClass();
  };

  /**
   * 设置动画开关
   */
  const setAnimationsEnabled = (enabled: boolean): void => {
    animationsEnabled.value = enabled;
    saveAnimationSettings();
    updateDocumentClass();
  };

  /**
   * 网格交错动画
   */
  const staggerGrid = (elements: HTMLElement[], duration: number = 500): Promise<void> => {
    if (!animationsEnabled.value || !elements || elements.length === 0) {
      return Promise.resolve();
    }

    return animate(elements, {
      scale: { to: [0.95, 1] },
      opacity: { to: [0.8, 1] },
      duration: duration,
      delay: stagger(30),
      ease: 'outQuad'
    }).then(() => {});
  };

  /**
   * 淡入动画
   */
  const fadeIn = (element: HTMLElement, duration: number = 300): Promise<void> => {
    if (!animationsEnabled.value) {
      element.style.opacity = '1';
      return Promise.resolve();
    }

    return animate(element, {
      opacity: { to: 1 },
      translateY: { to: [20, 0] },
      duration: duration,
      ease: 'outQuad'
    }).then(() => {});
  };

  /**
   * 淡出动画
   */
  const fadeOut = (element: HTMLElement, duration: number = 300): Promise<void> => {
    if (!animationsEnabled.value) {
      element.style.opacity = '0';
      return Promise.resolve();
    }

    return animate(element, {
      opacity: { to: 0 },
      translateY: { to: -20 },
      duration: duration,
      ease: 'inQuad'
    }).then(() => {});
  };

  /**
   * 缩放进入动画
   */
  const scaleIn = (element: HTMLElement, duration: number = 400): Promise<void> => {
    if (!animationsEnabled.value) {
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
      return Promise.resolve();
    }

    return animate(element, {
      scale: { to: 1 },
      opacity: { to: 1 },
      duration: duration,
      ease: 'outBack'
    }).then(() => {});
  };

  /**
   * 移动指示器动画
   */
  const moveIndicator = (element: HTMLElement, position: number, duration: number = 1000): Promise<void> => {
    if (!animationsEnabled.value) {
      element.style.left = `${position}%`;
      return Promise.resolve();
    }

    return animate(element, {
      left: { to: `${position}%` },
      duration: duration,
      ease: 'outQuad'
    }).then(() => {});
  };

  /**
   * 宽度滑动动画
   */
  const slideWidth = (element: HTMLElement, percentage: number, duration: number = 800): Promise<void> => {
    if (!animationsEnabled.value) {
      element.style.width = `${percentage}%`;
      return Promise.resolve();
    }

    return animate(element, {
      width: { to: `${percentage}%` },
      duration: duration,
      ease: 'outQuad'
    }).then(() => {});
  };

  /**
   * 监听动画状态变化
   */
  watch(animationsEnabled, () => {
    updateDocumentClass();
  });

  return {
    animationsEnabled,
    toggleAnimations,
    setAnimationsEnabled,
    loadAnimationSettings,
    staggerGrid,
    fadeIn,
    fadeOut,
    scaleIn,
    moveIndicator,
    slideWidth
  };
}
