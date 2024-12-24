'use client';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useState } from 'react';
import ResetPasswordForm from './reset-password-form';
import { UsersApiV1Service } from '@/lib/generated/services/UsersApiV1Service';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' })
});

type ForgotPasswordFormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordForm() {
  const [loading, startTransition] = useTransition();
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [email, setEmail] = useState('');

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      startTransition(async () => {
        await UsersApiV1Service.resetPasswordApiV1UsersResetPasswordPost({
          email: data.email
        });

        setEmail(data.email);
        setIsVerificationStep(true);
        toast.success('Reset code sent to your email');
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong!');
      }
    }
  };

  if (isVerificationStep) {
    return <ResetPasswordForm email={email} />;
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    disabled={loading}
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="w-full" type="submit">
            Send Reset Code
          </Button>
        </form>
      </Form>
    </div>
  );
}
