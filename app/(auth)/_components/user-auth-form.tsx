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
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import GithubSignInButton from './github-auth-button';
import Link from 'next/link';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignupForm from './signup-form';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
});

type UserFormValue = z.infer<typeof formSchema>;

type UserAuthFormProps = {
  defaultTab?: 'signin' | 'signup';
};

export default function UserAuthForm({
  defaultTab = 'signin'
}: UserAuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, startTransition] = useTransition();
  const defaultValues = {
    email: '',
    password: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleTabChange = (value: string) => {
    if (value === 'signin') {
      router.push('/signin');
    } else {
      router.push('/signup');
    }
  };

  const onSubmit = async (data: UserFormValue) => {
    try {
      setFormError(null);
      startTransition(async () => {
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false
        });

        if (!result?.ok || result?.error) {
          setFormError('Invalid email or password. Please try again.');
          return;
        }

        toast.success('Signed in successfully!');

        const redirectUrl = callbackUrl || '/dashboard';
        router.push(
          redirectUrl.startsWith('/') ? redirectUrl : `/${redirectUrl}`
        );
      });
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Something went wrong!');
      setFormError('An unexpected error occurred');
    }
  };

  return (
    <Tabs
      defaultValue={defaultTab}
      className="w-full"
      onValueChange={handleTabChange}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <div className="min-h-[400px]">
        <TabsContent value="signin">
          <div className="grid gap-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email..."
                          disabled={loading}
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
                          placeholder="Enter your password..."
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {formError && (
                  <div className="py-1 text-center text-sm text-destructive">
                    {formError}
                  </div>
                )}

                <Button disabled={loading} className="w-full" type="submit">
                  Sign in with email
                </Button>
                <div className="text-center">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Forgot password?
                  </Link>
                </div>
              </form>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <GithubSignInButton />
          </div>
        </TabsContent>
        <TabsContent value="signup">
          <SignupForm />
        </TabsContent>
      </div>
    </Tabs>
  );
}
