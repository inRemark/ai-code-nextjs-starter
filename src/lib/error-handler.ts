// 错误类型定义
export enum ErrorCode {
  // 通用错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  
  // 认证和授权错误
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // 数据库错误
  DATABASE_ERROR = 'DATABASE_ERROR',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  DUPLICATE_RECORD = 'DUPLICATE_RECORD',
  
  // 业务逻辑错误
  INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  TEMPLATE_NOT_FOUND = 'TEMPLATE_NOT_FOUND',
  CUSTOMER_NOT_FOUND = 'CUSTOMER_NOT_FOUND',
  
  // 邮件服务错误
  SMTP_CONNECTION_ERROR = 'SMTP_CONNECTION_ERROR',
  EMAIL_SEND_FAILED = 'EMAIL_SEND_FAILED',
  QUEUE_ERROR = 'QUEUE_ERROR',
  
  // 文件处理错误
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_FORMAT = 'INVALID_FILE_FORMAT',
  CSV_PARSE_ERROR = 'CSV_PARSE_ERROR',
}

// 应用错误基类
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 验证错误
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, true, details);
  }
}

// 认证错误
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, ErrorCode.UNAUTHORIZED, 401);
  }
}

// 授权错误
export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, ErrorCode.FORBIDDEN, 403);
  }
}

// 资源未找到错误
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, ErrorCode.RECORD_NOT_FOUND, 404);
  }
}

// 重复记录错误
export class DuplicateError extends AppError {
  constructor(message: string = 'Record already exists') {
    super(message, ErrorCode.DUPLICATE_RECORD, 409);
  }
}

// 数据库错误
export class DatabaseError extends AppError {
  constructor(message: string, details?: any) {
    super(message, ErrorCode.DATABASE_ERROR, 500, true, details);
  }
}

// 邮件服务错误
export class EmailServiceError extends AppError {
  constructor(message: string, code: ErrorCode = ErrorCode.EMAIL_SEND_FAILED, details?: any) {
    super(message, code, 500, true, details);
  }
}

// 文件处理错误
export class FileProcessingError extends AppError {
  constructor(message: string, code: ErrorCode = ErrorCode.INVALID_FILE_FORMAT, details?: any) {
    super(message, code, 400, true, details);
  }
}

// 错误处理工具函数
export class ErrorHandler {
  /**
   * 处理Prisma错误
   */
  static handlePrismaError(error: any): AppError {
    if (error.code === 'P2002') {
      // 唯一约束违反
      const target = error.meta?.target || 'field';
      return new DuplicateError(`Duplicate ${target} value`);
    }
    
    if (error.code === 'P2025') {
      // 记录未找到
      return new NotFoundError('Record not found');
    }
    
    if (error.code === 'P2003') {
      // 外键约束违反
      return new ValidationError('Invalid reference to related record');
    }
    
    return new DatabaseError(error.message, { code: error.code });
  }

  /**
   * 处理验证错误
   */
  static handleValidationError(errors: Record<string, string[]>): ValidationError {
    const messages = Object.entries(errors)
      .map(([field, fieldErrors]) => `${field}: ${fieldErrors.join(', ')}`)
      .join('; ');
    
    return new ValidationError(`Validation failed: ${messages}`, errors);
  }

  /**
   * 处理邮件发送错误
   */
  static handleEmailError(error: any): EmailServiceError {
    if (error.code === 'ECONNECTION' || error.code === 'ENOTFOUND') {
      return new EmailServiceError(
        'Failed to connect to email server',
        ErrorCode.SMTP_CONNECTION_ERROR,
        error
      );
    }
    
    if (error.responseCode >= 500) {
      return new EmailServiceError(
        'Email server error',
        ErrorCode.EMAIL_SEND_FAILED,
        error
      );
    }
    
    return new EmailServiceError(error.message, ErrorCode.EMAIL_SEND_FAILED, error);
  }

  /**
   * 处理文件错误
   */
  static handleFileError(error: any, maxSize?: number): FileProcessingError {
    if (error.code === 'LIMIT_FILE_SIZE' || (maxSize && error.size > maxSize)) {
      return new FileProcessingError(
        `File too large. Maximum size is ${maxSize ? Math.round(maxSize / 1024 / 1024) : 100}MB`,
        ErrorCode.FILE_TOO_LARGE
      );
    }
    
    if (error.code === 'INVALID_FILE_TYPE') {
      return new FileProcessingError(
        'Invalid file format',
        ErrorCode.INVALID_FILE_FORMAT
      );
    }
    
    return new FileProcessingError(error.message);
  }

  /**
   * 格式化错误响应
   */
  static formatErrorResponse(error: AppError | Error) {
    if (error instanceof AppError) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
        },
      };
    }
    
    // 对于非应用错误，不暴露详细信息
    return {
      success: false,
      error: {
        message: 'An unexpected error occurred',
        code: ErrorCode.UNKNOWN_ERROR,
      },
    };
  }

  /**
   * 记录错误
   */
  static logError(error: Error, context?: Record<string, any>) {
    const errorInfo = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
    };

    if (error instanceof AppError) {
      errorInfo['code'] = error.code;
      errorInfo['statusCode'] = error.statusCode;
      errorInfo['isOperational'] = error.isOperational;
      errorInfo['details'] = error.details;
    }

    console.error('Application Error:', errorInfo);
    
    // 在生产环境中，这里应该发送到日志服务
    if (process.env.NODE_ENV === 'production') {
      // 发送到监控服务，如 Sentry、DataDog 等
      // sendToMonitoringService(errorInfo);
    }
  }
}

// 异步错误处理装饰器
export function handleAsync<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      ErrorHandler.logError(error as Error, { args });
      throw error;
    }
  };
}

// 重试机制
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      // 指数退避延迟
      const backoffDelay = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
  
  throw lastError!;
}

// 超时处理
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage?: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(timeoutMessage || `Operation timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    }),
  ]);
}