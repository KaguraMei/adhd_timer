/**
 * 日期工具函数
 * 支持自定义每日开始时间
 */

export interface DayStartTime {
  hour: number;
  minute: number;
}

/**
 * 根据自定义的每日开始时间调整日期
 * @param date 原始日期
 * @param dayStartTime 每日开始时间配置
 * @returns 调整后的日期
 */
export function getAdjustedDate(date: Date, dayStartTime: DayStartTime): Date {
  const adjusted = new Date(date);
  
  // 如果当前时间早于每日开始时间，则认为是前一天
  const currentHour = date.getHours();
  const currentMinute = date.getMinutes();
  const startHour = dayStartTime.hour;
  const startMinute = dayStartTime.minute;
  
  const currentMinutes = currentHour * 60 + currentMinute;
  const startMinutes = startHour * 60 + startMinute;
  
  if (currentMinutes < startMinutes) {
    adjusted.setDate(adjusted.getDate() - 1);
  }
  
  return adjusted;
}

/**
 * 判断两个日期是否为同一天（考虑自定义每日开始时间）
 * @param date1 日期1
 * @param date2 日期2
 * @param dayStartTime 每日开始时间配置
 * @returns 是否为同一天
 */
export function isSameDay(date1: Date, date2: Date, dayStartTime: DayStartTime): boolean {
  const adjusted1 = getAdjustedDate(date1, dayStartTime);
  const adjusted2 = getAdjustedDate(date2, dayStartTime);
  
  return (
    adjusted1.getFullYear() === adjusted2.getFullYear() &&
    adjusted1.getMonth() === adjusted2.getMonth() &&
    adjusted1.getDate() === adjusted2.getDate()
  );
}

/**
 * 判断两个日期是否为同一周（考虑自定义每日开始时间）
 * @param date1 日期1
 * @param date2 日期2
 * @param dayStartTime 每日开始时间配置
 * @returns 是否为同一周
 */
export function isSameWeek(date1: Date, date2: Date, dayStartTime: DayStartTime): boolean {
  const adjusted1 = getAdjustedDate(date1, dayStartTime);
  const adjusted2 = getAdjustedDate(date2, dayStartTime);
  
  // 获取周一作为一周的开始
  const getMonday = (d: Date): Date => {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };
  
  const monday1 = getMonday(adjusted1);
  const monday2 = getMonday(adjusted2);
  
  return monday1.getTime() === monday2.getTime();
}

/**
 * 判断两个日期是否为同一月（考虑自定义每日开始时间）
 * @param date1 日期1
 * @param date2 日期2
 * @param dayStartTime 每日开始时间配置
 * @returns 是否为同一月
 */
export function isSameMonth(date1: Date, date2: Date, dayStartTime: DayStartTime): boolean {
  const adjusted1 = getAdjustedDate(date1, dayStartTime);
  const adjusted2 = getAdjustedDate(date2, dayStartTime);
  
  return (
    adjusted1.getFullYear() === adjusted2.getFullYear() &&
    adjusted1.getMonth() === adjusted2.getMonth()
  );
}

/**
 * 判断两个日期是否为同一年（考虑自定义每日开始时间）
 * @param date1 日期1
 * @param date2 日期2
 * @param dayStartTime 每日开始时间配置
 * @returns 是否为同一年
 */
export function isSameYear(date1: Date, date2: Date, dayStartTime: DayStartTime): boolean {
  const adjusted1 = getAdjustedDate(date1, dayStartTime);
  const adjusted2 = getAdjustedDate(date2, dayStartTime);
  
  return adjusted1.getFullYear() === adjusted2.getFullYear();
}

/**
 * 格式化时间为 HH:MM
 * @param hour 小时
 * @param minute 分钟
 * @returns 格式化的时间字符串
 */
export function formatTime(hour: number, minute: number): string {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}
