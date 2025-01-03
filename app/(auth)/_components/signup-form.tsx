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
import { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import VerificationForm from './verification-form';
import { UsersApiV1Service } from '@/lib/generated/services/UsersApiV1Service';

const signupSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' })
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const [loading, startTransition] = useTransition();
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [email, setEmail] = useState('');

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      startTransition(async () => {
        await UsersApiV1Service.createUserApiV1UsersSignupPost({
          email: data.email as string,
          password: data.password as string
          // TODO: Add name
        });

        setEmail(data.email);
        setIsVerificationStep(true);
        toast.success('Verification code sent to your email');
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
    return <VerificationForm email={email} />;
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    placeholder="john@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    disabled={loading}
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <Button disabled={loading} className="w-full" type="submit"> */}
          <Button disabled={true} className="w-full" type="submit">
            Create account
          </Button>
          <p className="text-sm text-red-500 text-center">
            For demo purposes, please use the login page where credentials are pre-filled
          </p>
        </form>
      </Form>
    </div>
  );
}
