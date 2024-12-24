'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { UsersApiV1Service } from '@/lib/generated/services/UsersApiV1Service';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp';
import { OpenAPI } from '@/lib/generated';

// Initialize OpenAPI configuration
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
}

OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL;

// Two-step form schemas
const confirmChangeSchema = z
  .object({
    code: z.string().min(6, { message: 'Please enter the 6-digit code' }),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

type ConfirmChangeValues = z.infer<typeof confirmChangeSchema>;

interface ChangePasswordFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function ChangePasswordForm({
  onCancel,
  onSuccess
}: ChangePasswordFormProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isVerificationStep, setIsVerificationStep] = useState(false);

  const confirmForm = useForm<ConfirmChangeValues>({
    resolver: zodResolver(confirmChangeSchema)
  });

  const initiatePasswordReset = async () => {
    if (!session?.user?.email) {
      toast.error('User email not found');
      return;
    }

    try {
      setLoading(true);
      await UsersApiV1Service.resetPasswordApiV1UsersResetPasswordPost({
        email: session.user.email
      });
      setIsVerificationStep(true);
      toast.success('Verification code sent to your email', {
        duration: 3000
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to send verification code');
      }
    } finally {
      setLoading(false);
    }
  };

  const onConfirmSubmit = async (data: ConfirmChangeValues) => {
    if (!session?.user?.email) {
      toast.error('User email not found');
      return;
    }

    try {
      setLoading(true);
      await UsersApiV1Service.confirmResetPasswordApiV1UsersConfirmResetPasswordPost(
        {
          email: session.user.email,
          new_password: data.newPassword,
          confirmation_code: data.code
        }
      );

      toast.success('Password changed successfully');
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to change password');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isVerificationStep) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Click continue to receive a verification code via email (
          {session?.user?.email})
        </p>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button onClick={initiatePasswordReset} disabled={loading}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...confirmForm}>
      <form
        onSubmit={confirmForm.handleSubmit(onConfirmSubmit)}
        className="space-y-4"
      >
        <FormField
          control={confirmForm.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <InputOTP maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
              <Button
                type="button"
                variant="link"
                className="px-0 text-sm text-muted-foreground"
                disabled={loading}
                onClick={initiatePasswordReset}
              >
                Resend code
              </Button>
            </FormItem>
          )}
        />

        <FormField
          control={confirmForm.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  disabled={loading}
                  placeholder="Enter new password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={confirmForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password2</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  disabled={loading}
                  placeholder="Confirm new password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            Change Password
          </Button>
        </div>
      </form>
    </Form>
  );
}
