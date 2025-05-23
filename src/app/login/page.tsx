
import { LoginForm } from '@/components/auth/LoginForm';
import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Login | ${APP_NAME}`,
  description: 'Login to your Content Canvas account.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-12">
      <LoginForm />
    </div>
  );
}
