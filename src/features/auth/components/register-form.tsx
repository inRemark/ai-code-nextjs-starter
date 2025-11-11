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

// Validators are placed inside the component to use translations
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
    
    // check field error on change
    if (errors[field]) {
      let error: string | undefined;
      
      switch (field) {
        case 'email':
          error = validateEmail(value);
          break;
        case 'password':
          error = validatePassword(value);
          // If password changes, re-validate confirm password
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
      // Call registration API
      const response = await authAPI.register(formData.email, formData.password, '');

      if (!response.success) {
        setServerError(response.error || 'Registration failed');
        return;
      }

      const signInResult = await signInAfterRegister(formData.email, formData.password);

      if (!signInResult?.ok) {
        setServerError(signInResult?.error || 'Login after registration failed');
        return;
      }

      // Call success callback or redirect
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setServerError('Network error, please try again later');
      logger.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSuccess = (provider: string, userData: unknown) => {
    logger.debug(`${provider} registration successful`, userData);
    if (onSuccess) {
      onSuccess();
    } else {
      router.push('/');
      router.refresh();
    }
  };

  const handleSocialError = (provider: string, error: string) => {
    setServerError(`${provider} Registration failed: ${error}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Server error message */}
        {serverError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        {/* Email field */}
        <FormField
          name="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(value) => handleFieldChange('email', value)}
          error={errors.email}
          placeholder="Enter your email address"
          required
        />

        {/* Password field */}
        <FormField
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={(value) => handleFieldChange('password', value)}
          error={errors.password}
          placeholder="Enter your password"
          showPasswordToggle
          required
        />

        {/* Password strength indicator */}
        {formData.password && (
          <PasswordStrength password={formData.password} />
        )}

        {/* Confirm Password field */}
        <FormField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(value) => handleFieldChange('confirmPassword', value)}
          error={errors.confirmPassword}
          placeholder="Please re-enter your password"
          showPasswordToggle
          required
        />

        {/* Register button */}
        <Button
          type="submit"
          className="w-full h-12 text-base font-medium"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Registering...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      {/* Divider */}
      <Divider text="OR" />

      {/* Social login */}
      <SocialLogin
        providers={['google', 'github']}
        onSuccess={handleSocialSuccess}
        onError={handleSocialError}
        disabled={loading}
      />

      {/* Login link */}
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </>
  );
}