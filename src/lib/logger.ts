/**
 * 统一日志工具
 * 根据环境自动选择合适的输出方式
 */

type LogLevel = 'info' | 'success' | 'warn' | 'error' | 'debug';

interface LogOptions {
  emoji?: string;
  timestamp?: boolean;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  
  /**
   * 格式化日志消息
   */
  private formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
    const parts: string[] = [];
    
    if (options?.timestamp) {
      parts.push(`[${new Date().toISOString()}]`);
    }
    
    if (options?.emoji) {
      parts.push(options.emoji);
    }
    
    parts.push(message);
    return parts.join(' ');
  }

  /**
   * 信息日志
   */
  info(message: string, options?: LogOptions) {
    const formatted = this.formatMessage('info', message, {
      emoji: options?.emoji || 'ℹ️',
      ...options,
    });
    
    if (this.isDevelopment) {
      console.warn(formatted); // 使用 warn 以符合 ESLint 规则
    }
  }

  /**
   * 成功日志
   */
  success(message: string, options?: LogOptions) {
    const formatted = this.formatMessage('success', message, {
      emoji: options?.emoji || '✅',
      ...options,
    });
    
    if (this.isDevelopment) {
      console.warn(formatted);
    }
  }

  /**
   * 警告日志
   */
  warn(message: string, options?: LogOptions) {
    const formatted = this.formatMessage('warn', message, {
      emoji: options?.emoji || '⚠️',
      ...options,
    });
    
    console.warn(formatted);
  }

  /**
   * 错误日志
   */
  error(message: string, error?: unknown, options?: LogOptions) {
    const formatted = this.formatMessage('error', message, {
      emoji: options?.emoji || '❌',
      ...options,
    });
    
    console.error(formatted);
    if (error) {
      console.error(error);
    }
  }

  /**
   * 调试日志（仅开发环境）
   */
  debug(message: string, data?: unknown, options?: LogOptions) {
    if (!this.isDevelopment) return;
    
    const formatted = this.formatMessage('debug', message, {
      emoji: options?.emoji || '🐛',
      ...options,
    });
    
    console.warn(formatted);
    if (data) {
      console.warn(data);
    }
  }

  /**
   * 表格输出（仅开发环境）
   */
  table(data: unknown) {
    if (this.isDevelopment && Array.isArray(data)) {
      console.warn('📊 数据表格:');
      console.warn(data);
    }
  }

  /**
   * 分组日志
   */
  group(label: string, callback: () => void) {
    if (this.isDevelopment) {
      console.warn(`📂 ${label}`);
      callback();
    }
  }
}

// 导出单例
export const logger = new Logger();

// 默认导出
export default logger;
