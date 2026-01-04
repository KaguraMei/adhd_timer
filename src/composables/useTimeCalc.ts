/**
 * useTimeCalc - 时间计算工具 composable
 * 提供各种时间和日期计算函数
 */

import { useSettingsStore } from '../stores/settings';
import { getAdjustedDate } from '../utils/dateUtils';

interface TimeCalcComposable {
  getCurrentDayOfMonth: () => number;
  getDaysInMonth: (date?: Date) => number;
  getCurrentDayOfWeek: () => number;
  getCurrentDayOfYear: () => number;
  getDaysInYear: (year: number) => number;
  isLeapYear: (year: number) => boolean;
  calculateYearsLived: (birthdate: string) => number;
  formatTime: (seconds: number) => string;
}

export function useTimeCalc(): TimeCalcComposable {
  const settingsStore = useSettingsStore();
  
  /**
   * 获取调整后的当前日期（考虑每日开始时间）
   */
  const getAdjustedNow = (): Date => {
    return getAdjustedDate(new Date(), settingsStore.dayStartTime);
  };
  /**
   * 获取当前是本月第几天（考虑每日开始时间）
   * @returns 当前日期（1-31）
   */
  const getCurrentDayOfMonth = (): number => {
    return getAdjustedNow().getDate();
  };

  /**
   * 获取指定月份的天数
   * @param date 日期对象（默认为当前日期）
   * @returns 该月的天数
   */
  const getDaysInMonth = (date: Date = new Date()): number => {
    const adjustedDate = getAdjustedDate(date, settingsStore.dayStartTime);
    const year = adjustedDate.getFullYear();
    const month = adjustedDate.getMonth();
    // 下个月的第0天就是本月的最后一天
    return new Date(year, month + 1, 0).getDate();
  };

  /**
   * 获取当前是本周第几天（考虑每日开始时间）
   * @returns 1-7（周一到周日）
   */
  const getCurrentDayOfWeek = (): number => {
    const day = getAdjustedNow().getDay();
    // 将周日(0)映射为7，其他保持不变
    return day === 0 ? 7 : day;
  };

  /**
   * 获取当前是今年第几天（考虑每日开始时间）
   * @returns 1-366
   */
  const getCurrentDayOfYear = (): number => {
    const now = getAdjustedNow();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  /**
   * 获取指定年份的天数
   * @param year 年份
   * @returns 365 或 366
   */
  const getDaysInYear = (year: number): number => {
    return isLeapYear(year) ? 366 : 365;
  };

  /**
   * 判断是否为闰年
   * @param year 年份
   * @returns 是否为闰年
   */
  const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };

  /**
   * 计算已度过的年数（精确到小数点后一位）
   * @param birthdate 出生日期字符串 (YYYY-MM-DD)
   * @returns 已度过的年数
   */
  const calculateYearsLived = (birthdate: string): number => {
    try {
      const birth = new Date(birthdate);
      const now = new Date();
      
      // 验证日期有效性
      if (isNaN(birth.getTime())) {
        console.error('Invalid birthdate:', birthdate);
        return 0;
      }

      // 计算年份差
      let years = now.getFullYear() - birth.getFullYear();
      
      // 计算精确的月份和日期差异
      const monthDiff = now.getMonth() - birth.getMonth();
      const dayDiff = now.getDate() - birth.getDate();
      
      // 如果还没到生日，年份减1
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        years--;
      }
      
      // 计算小数部分（基于天数）
      const lastBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
      if (lastBirthday > now) {
        lastBirthday.setFullYear(now.getFullYear() - 1);
      }
      
      const nextBirthday = new Date(lastBirthday);
      nextBirthday.setFullYear(lastBirthday.getFullYear() + 1);
      
      const totalDays = (nextBirthday.getTime() - lastBirthday.getTime()) / (1000 * 60 * 60 * 24);
      const daysPassed = (now.getTime() - lastBirthday.getTime()) / (1000 * 60 * 60 * 24);
      const fraction = daysPassed / totalDays;
      
      // 返回精确到小数点后一位
      return Math.round((years + fraction) * 10) / 10;
    } catch (error) {
      console.error('Error calculating years lived:', error);
      return 0;
    }
  };

  /**
   * 格式化时间为 MM:SS 格式
   * @param seconds 总秒数
   * @returns 格式化的时间字符串
   */
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    getCurrentDayOfMonth,
    getDaysInMonth,
    getCurrentDayOfWeek,
    getCurrentDayOfYear,
    getDaysInYear,
    isLeapYear,
    calculateYearsLived,
    formatTime
  };
}
