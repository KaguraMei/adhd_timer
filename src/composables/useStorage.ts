/**
 * useStorage - localStorage 封装 composable
 * 提供类型安全的本地存储操作
 */

interface StorageComposable {
  get: <T>(key: string, defaultValue?: T) => T | null;
  set: <T>(key: string, value: T) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export function useStorage(): StorageComposable {
  /**
   * 从 localStorage 获取数据
   * @param key 存储键
   * @param defaultValue 默认值（可选）
   * @returns 存储的值或默认值
   */
  const get = <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      return defaultValue ?? null;
    }
  };

  /**
   * 保存数据到 localStorage
   * @param key 存储键
   * @param value 要保存的值
   */
  const set = <T>(key: string, value: T): void => {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error writing to localStorage (key: ${key}):`, error);
      // 可能是配额超限或序列化失败
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Consider clearing old data.');
      }
    }
  };

  /**
   * 从 localStorage 删除指定键
   * @param key 存储键
   */
  const remove = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
    }
  };

  /**
   * 清空所有 localStorage 数据
   */
  const clear = (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  return {
    get,
    set,
    remove,
    clear
  };
}
