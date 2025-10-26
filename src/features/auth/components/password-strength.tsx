"use client";

import React from "react";
import { Progress } from "@shared/ui/progress";
import { Check, X, AlertCircle } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const passwordRules: PasswordRule[] = [
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
    test: (pwd) => /[!@#$%^&*(),.?\":{}|<>]/.test(pwd),
  },
];

const getPasswordStrength = (password: string): {
  score: number;
  level: 'weak' | 'medium' | 'strong';
  color: string;
  label: string;
} => {
  const passedRules = passwordRules.filter(rule => rule.test(password));
  const score = passedRules.length;
  
  if (score < 3) {
    return {
      score: (score / 5) * 100,
      level: 'weak',
      color: 'bg-chart-3',
      label: '弱',
    };
  } else if (score < 5) {
    return {
      score: (score / 5) * 100,
      level: 'medium',
      color: 'bg-chart-2',
      label: '中等',
    };
  } else {
    return {
      score: 100,
      level: 'strong',
      color: 'bg-chart-1',
      label: '强',
    };
  }
};

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
  className = "",
}) => {
  if (!password) {
    return null;
  }

  const strength = getPasswordStrength(password);
  const passedRules = passwordRules.filter(rule => rule.test(password));
  const failedRules = passwordRules.filter(rule => !rule.test(password));

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 强度指示器 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">密码强度</span>
          <span className={`font-medium ${
            strength.level === 'weak' ? 'text-chart-3' :
            strength.level === 'medium' ? 'text-chart-2' :
            'text-chart-1'
          }`}>
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
              <span className={`${
                passed ? 'text-chart-1' : 'text-muted-foreground'
              }`}>
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