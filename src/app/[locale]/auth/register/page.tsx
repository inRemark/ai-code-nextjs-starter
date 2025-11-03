import { Suspense } from 'react';
import RegisterForm from '@features/auth/components/register-form';
import { AuthLayout } from '@shared/layout/auth-layout';

function RegisterFormWrapper() {
  return (
    <AuthLayout 
      title="创建账户" 
      subtitle="加入 AICoder，开始智能决策之旅"
    >
      <RegisterForm />
    </AuthLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterFormWrapper />
    </Suspense>
  );
}
