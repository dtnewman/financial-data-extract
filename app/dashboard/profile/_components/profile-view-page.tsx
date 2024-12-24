'use client';

import { useSession } from 'next-auth/react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import ChangePasswordForm from './change-password-form';

export default function ProfileViewPage() {
  const { data: session } = useSession();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <Separator />

        <div className="grid gap-6">
          {/* User Information Card */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Account Information</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Name
                </div>
                <div>{session?.user?.name || 'Not set'}</div>
              </div>
              <div className="grid gap-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Email
                </div>
                <div>{session?.user?.email}</div>
              </div>
            </CardContent>
          </Card>

          {/* Password Section */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Password</h2>
            </CardHeader>
            <CardContent>
              {!isChangingPassword ? (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Change your password
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    Change Password
                  </Button>
                </div>
              ) : (
                <ChangePasswordForm
                  onCancel={() => setIsChangingPassword(false)}
                  onSuccess={() => setIsChangingPassword(false)}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
