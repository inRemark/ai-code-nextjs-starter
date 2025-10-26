import LoginForm from '@features/auth/components/login-form';
import { AuthLayout } from '@shared/layout/auth-layout';

export default function LoginPage() {
  return (
    <AuthLayout 
      title="欢迎回来" 
      subtitle="登录您的 AICoder 账户"
    >
      <LoginForm />
    </AuthLayout>
  );
}
