'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api-client';
import { FormField } from './form-field';
import { SocialLogin } from './social-login';
import { Divider } from './divider';
import { PasswordStrength } from './password-strength';
import { Button } from '@shared/ui/button';
import { Alert, AlertDescription } from '@shared/ui/alert';
import { Badge } from '@shared/ui/badge';
import { Loader2, AlertCircle, Users, Gift } from 'lucide-react';
import { logger } from '@logger';

interface RegisterFormProps {
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
  if (password.length < 8) return '密码至少需要8位字符';
  if (!/[a-zA-Z]/.test(password)) return '密码需要包含字母';
  if (!/\d/.test(password)) return '密码需要包含数字';
  return undefined;
};

const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
  if (!confirmPassword) return '请确认密码';
  if (password !== confirmPassword) return '两次输入的密码不一致';
  return undefined;
};

export default function RegisterForm({ onSuccess }: RegisterFormProps = {}) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralInfo, setReferralInfo] = useState<{ name?: string; email?: string } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // 从URL获取推荐码
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      validateReferralCode(refCode);
    }
  }, [searchParams]);

  // 验证推荐码
  const validateReferralCode = async (code: string) => {
    try {
      const response = await fetch(`/api/referral/validate?code=${code}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.isValid) {
          setReferralInfo(data.referrerInfo);
        }
      }
    } catch (error) {
      logger.error('Failed to validate referral code:', error);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register(formData.email, formData.password, '');
      
      if (response.success) {
        // 保存令牌到localStorage
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        // 如果有推荐码，记录推荐转化
        if (referralCode) {
          try {
            await fetch('/api/referral/track', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                referralCodeId: referralCode,
                stepType: 'REGISTER',
                userId: response.data.user.id
              })
            });
          } catch (error) {
            logger.error('Failed to track referral conversion:', error);
          }
        }
        
        // 调用成功回调或重定向
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/profile');
          router.refresh();
        }
      } else {
        setServerError(response.error || '注册失败，请稍后再试');
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
        {/* 推荐信息提示 */}
        {referralInfo && (
          <Alert className="border-green-200 bg-green-50">
            <Users className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <strong>{referralInfo.name || '好友'}</strong> 邀请您加入 AICoder
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Gift className="h-3 w-3 mr-1" />
                  +50 积分
                </Badge>
              </div>
              <p className="text-sm mt-1">注册成功后，您和推荐人都将获得积分奖励！</p>
            </AlertDescription>
          </Alert>
        )}

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