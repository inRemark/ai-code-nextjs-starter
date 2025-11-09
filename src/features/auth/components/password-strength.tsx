"use client";

import React from "react";
import { Check, X, AlertCircle } from "lucide-react";
import { validationHelpers } from "@/lib/validators/base";

interface PasswordStrengthProps {
  readonly password: string;
  readonly className?: string;
}

interface PasswordRule {
  readonly id: string;
  readonly label: string;
  readonly test: (password: string) => boolean;
}

/**
 * 密码验证规则配置
 * 使用 base.ts 中的统一正则表达式，确保前后端验证规则一致
 */
const passwordRules: readonly PasswordRule[] = [
  {
    id: 'length',
    label: '至少8个字符',
    test: (pwd) => pwd.length >= 8,
  },
  {
    id: 'lowercase',
    label: '包含小写字母',
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    id: 'uppercase',
    label: '包含大写字母',
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    id: 'number',
    label: '包含数字',
    test: (pwd) => /\d/.test(pwd),
  },
  {
    id: 'special',
    label: '包含特殊字符',
    test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
  },
];

type PasswordStrengthLevel = 'weak' | 'medium' | 'strong';

interface PasswordStrengthResult {
  readonly score: number;
  readonly level: PasswordStrengthLevel;
  readonly color: string;
  readonly label: string;
}

/**
 * 密码强度阈值配置
 */
const STRENGTH_THRESHOLDS = {
  WEAK: 3,    // 小于3条规则 = 弱
  MEDIUM: 5,  // 小于5条规则 = 中等
} as const;

/**
 * 计算密码强度
 * 
 * 使用 base.ts 中的 validatePasswordStrength 辅助函数，
 * 确保与后端验证逻辑完全一致
 * 
 * @param password - 待验证的密码
 * @returns 密码强度结果
 */
const getPasswordStrength = (password: string): PasswordStrengthResult => {
  // 使用统一的验证辅助函数
  const { score } = validationHelpers.validatePasswordStrength(password);
  const scorePercentage = (score / passwordRules.length) * 100;
  
  if (score < STRENGTH_THRESHOLDS.WEAK) {
    return {
      score: scorePercentage,
      level: 'weak',
      color: 'bg-chart-3',
      label: '弱',
    };
  }
  
  if (score < STRENGTH_THRESHOLDS.MEDIUM) {
    return {
      score: scorePercentage,
      level: 'medium',
      color: 'bg-chart-2',
      label: '中等',
    };
  }
  
  return {
    score: 100,
    level: 'strong',
    color: 'bg-chart-1',
    label: '强',
  };
};

/**
 * 获取强度等级对应的文字颜色
 */
const getLevelTextColor = (level: PasswordStrengthLevel): string => {
  const colorMap: Record<PasswordStrengthLevel, string> = {
    weak: 'text-chart-3',
    medium: 'text-chart-2',
    strong: 'text-chart-1',
  };
  return colorMap[level];
};

/**
 * 密码强度指示器组件
 * 
 * 实时显示密码强度，包括：
 * - 强度评级（弱/中等/强）
 * - 进度条可视化
 * - 各项规则检查结果
 * - 安全提示
 * 
 * @example
 * ```tsx
 * <PasswordStrength password={formData.password} />
 * ```
 */
export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
  className = "",
}) => {
  if (!password) {
    return null;
  }

  const strength = getPasswordStrength(password);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 强度指示器 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">密码强度</span>
          <span className={`font-medium ${getLevelTextColor(strength.level)}`}>
            {strength.label}
          </span>
        </div>
        
        <div className="relative">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
              style={{ width: `${strength.score}%` }}
            />
          </div>
        </div>
      </div>

      {/* 规则检查列表 */}
      <div className="space-y-1">
        {passwordRules.map((rule) => {
          const passed = rule.test(password);
          const iconColor = passed ? 'text-chart-1' : 'text-muted-foreground';
          
          return (
            <div
              key={rule.id}
              className="flex items-center gap-2 text-sm"
            >
              {passed ? (
                <Check className="w-4 h-4 text-chart-1 flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
              <span className={iconColor}>
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* 安全提示 */}
      {strength.level === 'strong' && (
        <div className="flex items-center gap-2 p-2 bg-chart-1/5 rounded-md border border-chart-1/20">
          <Check className="w-4 h-4 text-chart-1 flex-shrink-0" />
          <span className="text-sm text-chart-1">密码强度很好！</span>
        </div>
      )}

      {strength.level === 'weak' && password.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-chart-2/5 rounded-md border border-chart-2/20">
          <AlertCircle className="w-4 h-4 text-chart-2 flex-shrink-0" />
          <span className="text-sm text-chart-2">建议使用更强的密码以保护账户安全</span>
        </div>
      )}
    </div>
  );
};