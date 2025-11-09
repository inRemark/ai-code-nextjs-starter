'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api-client';
import { FormField } from './form-field';
import { SocialLogin } from './social-login';
import { Divider } from '@shared/ui/divider';
import { PasswordStrength } from './password-strength';
import { Button } from '@shared/ui/button';
import { Alert, AlertDescription } from '@shared/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { logger } from '@logger';
import { useTranslations } from 'next-intl';

interface RegisterFormProps {
  onSuccess?: () => void;
}

// 验证器放入组件内部以便使用翻译

export default function RegisterForm({ onSuccess }: RegisterFormProps = {}) {
  const t = useTranslations('auth.register');

  const validateEmail = (email: string): string | undefined => {
    if (!email) return t('emailRequired');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return t('emailInvalid');
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return t('passwordRequired');
    if (password.length < 8) return t('passwordTooShort');
    if (!/[a-zA-Z]/.test(password)) return t('passwordRequireLetters');
    if (!/\d/.test(password)) return t('passwordRequireNumbers');
    return undefined;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) return t('confirmPasswordRequired');
    if (password !== confirmPassword) return t('confirmPasswordMismatch');
    return undefined;
  };
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 实时验证
    if (errors[field]) {
      let error: string | undefined;
      
      switch (field) {
        case 'email':
          error = validateEmail(value);
          break;
        case 'password':
          error = validatePassword(value);
          // 如果密码改变，也要重新验证确认密码
          if (formData.confirmPassword) {
            const confirmError = validateConfirmPassword(value, formData.confirmPassword);
            setErrors(prev => ({ ...prev, confirmPassword: confirmError || '' }));
          }
          break;
        case 'confirmPassword':
          error = validateConfirmPassword(formData.password, value);
          break;
      }
      
      setErrors(prev => ({ ...prev, [field]: error || '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
    
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const signInAfterRegister = async (email: string, password: string) => {
    const { signIn } = await import('next-auth/react');
    return await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // 调用注册API
      const response = await authAPI.register(formData.email, formData.password, '');

      if (!response.success) {
        setServerError(response.error || '注册失败，请稍后再试');
        return;
      }

      const signInResult = await signInAfterRegister(formData.email, formData.password);

      if (!signInResult?.ok) {
        setServerError(signInResult?.error || '注册后登录失败');
        return;
      }

      // 调用成功回调或重定向
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/profile');
        router.refresh();
      }
    } catch (err) {
      setServerError('网络错误，请稍后再试');
      logger.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSuccess = (provider: string, userData: unknown) => {
    logger.debug(`${provider} 注册成功`, userData);
    if (onSuccess) {
      onSuccess();
    } else {
      router.push('/profile');
      router.refresh();
    }
  };

  const handleSocialError = (provider: string, error: string) => {
    setServerError(`${provider} 注册失败: ${error}`);
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

        {/* 密码强度指示器 */}
        {formData.password && (
          <PasswordStrength password={formData.password} />
        )}

        {/* 确认密码字段 */}
        <FormField
          name="confirmPassword"
          label="确认密码"
          type="password"
          value={formData.confirmPassword}
          onChange={(value) => handleFieldChange('confirmPassword', value)}
          error={errors.confirmPassword}
          placeholder="请再次输入密码"
          showPasswordToggle
          required
        />

        {/* 注册按钮 */}
        <Button
          type="submit"
          className="w-full h-12 text-base font-medium"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              注册中...
            </>
          ) : (
            '创建账户'
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

      {/* 登录链接 */}
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          已经有账户了？{' '}
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            立即登录
          </Link>
        </p>
      </div>
    </>
  );
}