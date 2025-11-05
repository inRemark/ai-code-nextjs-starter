import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import RegisterForm from '@features/auth/components/register-form';
import { AuthLayout } from '@shared/layout/auth-layout';

function RegisterFormWrapper() {
  const t = useTranslations('auth.register');
  
  return (
    <AuthLayout 
      title={t('title')} 
      subtitle={t('subtitle')}
    >
      <RegisterForm />
    </AuthLayout>
  );
}

export default function RegisterPage() {
  const tCommon = useTranslations('common');
  
  return (
    <Suspense fallback={<div>{tCommon('loading')}</div>}>
      <RegisterFormWrapper />
    </Suspense>
  );
}
