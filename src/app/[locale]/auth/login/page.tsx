import { getTranslations } from 'next-intl/server';
import LoginForm from '@features/auth/components/login-form';
import { AuthLayout } from '@shared/layout/auth-layout';

export default async function LoginPage() {
  const t = await getTranslations('auth.login');
  
  return (
    <AuthLayout 
      title={t('title')} 
      subtitle={t('subtitle')}
    >
      <LoginForm />
    </AuthLayout>
  );
}
