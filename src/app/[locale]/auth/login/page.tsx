import { useTranslations } from 'next-intl';
import LoginForm from '@features/auth/components/login-form';
import { AuthLayout } from '@shared/layout/auth-layout';

export default function LoginPage() {
  const t = useTranslations('auth');
  
  return (
    <AuthLayout 
      title={t('welcomeBack')} 
      subtitle={t('welcomeSubtitle')}
    >
      <LoginForm />
    </AuthLayout>
  );
}
