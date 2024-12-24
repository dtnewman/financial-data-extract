import ForgotPasswordForm from '../_components/forgot-password-form';
import Logo from '@/components/logo/logo';

export default function ForgotPasswordPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mb-4 flex items-center justify-center">
            <Logo isDarkMode={false} height={40} width={40} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset your password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we&apos;ll send you a code to reset
            your password
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
