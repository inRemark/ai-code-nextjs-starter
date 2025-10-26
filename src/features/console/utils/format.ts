/**
 * Console Feature - Utility Functions
 * 
 * 格式化和辅助函数
 */

/**
 * 格式化日期为相对时间
 */
export function formatRelativeDate(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInHours = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return '刚刚';
  } else if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  } else if (diffInHours < 48) {
    return '昨天';
  } else {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(targetDate);
  }
}

/**
 * 格式化完整日期
 */
export function formatFullDate(date: string | Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * 格式化短日期（不含年份）
 */
export function formatShortDate(date: string | Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * 检查日期是否是今天
 */
export function isToday(date: string | Date): boolean {
  const targetDate = new Date(date);
  const today = new Date();
  return targetDate.toDateString() === today.toDateString();
}

/**
 * 检查日期是否在本周内
 */
export function isThisWeek(date: string | Date): boolean {
  const targetDate = new Date(date);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return targetDate > weekAgo;
}

/**
 * 格式化数字（添加千分位）
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN');
}
