'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@features/auth/components/unified-auth-provider';
import { FormField } from './form-field';
import { SocialLogin } from './social-login';
import { Divider } from './divider';
import { Button } from '@shared/ui/button';
import { Alert, AlertDescription } from '@shared/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { logger } from '@logger';
interface LoginFormProps {
  onSuccess?: () => void;
}

const validateEmail = (email: string): string | undefined => {
  if (!email) return '请输入邮箱地址';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return '请输入有效的邮箱地址';
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return '请输入密码';
  if (password.length < 6) return '密码至少需要6位字符';
  return undefined;
};

export default function LoginForm({ onSuccess }: LoginFormProps = {}) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 实时验证
    if (errors[field]) {
      const validator = field === 'email' ? validateEmail : validatePassword;
      const error = validator(value);
      setErrors(prev => ({ ...prev, [field]: error || '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // 使用认证提供者的登录方法，确保状态同步
      await authLogin(formData.email, formData.password);
      
      // 登录成功处理
      if (onSuccess) {
        onSuccess();
      } else {
        // 按照文档架构，登录成功后跳转到dashboard
        // 注意：不要在这里直接跳转，而是让useEffect在UnifiedAuthProvider中处理
        // 等待session更新完成后再跳转
      }
    } catch (err: unknown) {
      // 处理来自认证提供者的错误
      const errorMessage = err instanceof Error ? err.message : '登录失败，请检查邮箱和密码';
      setServerError(errorMessage);
      logger.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSocialSuccess = (_provider: string, _userData: unknown) => {
    if (onSuccess) {
      onSuccess();
    } else {
      // 添加延迟确保状态更新完成
      setTimeout(() => {
        router.push('/console');
      }, 100);
    }
  };

  const handleSocialError = (provider: string, error: string) => {
    setServerError(`${provider} 登录失败: ${error}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 服务器错误提示 */}
        {serverError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        {/* 邮箱字段 */}
        <FormField
          name="email"
          label="邮箱地址"
          type="email"
          value={formData.email}
          onChange={(value) => handleFieldChange('email', value)}
          error={errors.email}
          placeholder="请输入邮箱地址"
          required
        />

        {/* 密码字段 */}
        <FormField
          name="password"
          label="密码"
          type="password"
          value={formData.password}
          onChange={(value) => handleFieldChange('password', value)}
          error={errors.password}
          placeholder="请输入密码"
          showPasswordToggle
          required
        />

        {/* 登录按钮 */}
        <Button
          type="submit"
          className="w-full h-12 text-base font-medium"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              登录中...
            </>
          ) : (
            '登录'
          )}
        </Button>
      </form>

      {/* 分割线 */}
      <Divider text="或" />

      {/* 第三方登录 */}
      <SocialLogin
        providers={['google', 'github']}
        onSuccess={handleSocialSuccess}
        onError={handleSocialError}
        disabled={loading}
      />

      {/* 注册链接 */}
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          还没有账户？{' '}
          <Link
            href="/auth/register"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            立即注册
          </Link>
        </p>
      </div>
    </>
  );
}