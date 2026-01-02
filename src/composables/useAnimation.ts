/**
 * useAnimation - Anime.js 封装 composable
 * 提供常用动画效果的统一接口
 */

import { animate } from 'animejs';
import { stagger } from 'animejs/utils';

type AnimeInstance = ReturnType<typeof animate>;

interface AnimationComposable {
  fadeIn: (target: HTMLElement | string, duration?: number) => AnimeInstance;
  fadeOut: (target: HTMLElement | string, duration?: number) => AnimeInstance;
  scaleIn: (target: HTMLElement | string, duration?: number) => AnimeInstance;
  slideWidth: (target: HTMLElement | string, width: number, duration?: number) => AnimeInstance;
  moveIndicator: (target: HTMLElement | string, position: number, duration?: number) => AnimeInstance;
  staggerGrid: (targets: HTMLElement[] | string, duration?: number) => AnimeInstance;
}

export function useAnimation(): AnimationComposable {
  /**
   * 检查动画目标是否存在
   * @param target 动画目标
   * @returns 是否存在
   */
  const checkTarget = (target: HTMLElement | string): boolean => {
    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (!element) {
        console.warn(`Animation target not found: ${target}`);
        return false;
      }
    }
    return true;
  };

  /**
   * 淡入动画
   * @param target 动画目标
   * @param duration 持续时间（毫秒）
   * @returns Anime 实例
   */
  const fadeIn = (target: HTMLElement | string, duration: number = 300): AnimeInstance => {
    if (!checkTarget(target)) {
      return animate([], {});
    }

    return animate(target, {
      opacity: { to: 1 },
      duration,
      ease: 'inQuad'
    });
  };

  /**
   * 淡出动画
   * @param target 动画目标
   * @param duration 持续时间（毫秒）
   * @returns Anime 实例
   */
  const fadeOut = (target: HTMLElement | string, duration: number = 300): AnimeInstance => {
    if (!checkTarget(target)) {
      return animate([], {});
    }

    return animate(target, {
      opacity: { to: 0 },
      duration,
      ease: 'outQuad'
    });
  };

  /**
   * 缩放进入动画
   * @param target 动画目标
   * @param duration 持续时间（毫秒）
   * @returns Anime 实例
   */
  const scaleIn = (target: HTMLElement | string, duration: number = 500): AnimeInstance => {
    if (!checkTarget(target)) {
      return animate([], {});
    }

    return animate(target, {
      scale: { to: 1 },
      opacity: { to: 1 },
      duration,
      ease: 'outElastic(1, .5)'
    });
  };

  /**
   * 进度条宽度变化动画
   * @param target 动画目标
   * @param width 目标宽度（百分比，0-100）
   * @param duration 持续时间（毫秒）
   * @returns Anime 实例
   */
  const slideWidth = (target: HTMLElement | string, width: number, duration: number = 800): AnimeInstance => {
    if (!checkTarget(target)) {
      return animate([], {});
    }

    return animate(target, {
      width: { to: `${width}%` },
      duration,
      ease: 'inOutQuad'
    });
  };

  /**
   * 时间指示器移动动画
   * @param target 动画目标
   * @param position 目标位置（百分比，0-100）
   * @param duration 持续时间（毫秒）
   * @returns Anime 实例
   */
  const moveIndicator = (target: HTMLElement | string, position: number, duration: number = 1000): AnimeInstance => {
    if (!checkTarget(target)) {
      return animate([], {});
    }

    return animate(target, {
      left: { to: `${position}%` },
      duration,
      ease: 'linear'
    });
  };

  /**
   * 网格交错动画
   * @param targets 动画目标数组或选择器
   * @param duration 持续时间（毫秒）
   * @returns Anime 实例
   */
  const staggerGrid = (targets: HTMLElement[] | string, duration: number = 500): AnimeInstance => {
    if (typeof targets === 'string' && !checkTarget(targets)) {
      return animate([], {});
    }

    return animate(targets, {
      scale: { to: 1 },
      opacity: { to: 1 },
      duration,
      delay: stagger(20, { start: 0 }),
      ease: 'outElastic(1, .5)'
    });
  };

  return {
    fadeIn,
    fadeOut,
    scaleIn,
    slideWidth,
    moveIndicator,
    staggerGrid
  };
}
