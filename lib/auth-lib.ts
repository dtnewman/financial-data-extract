import { auth } from '@/auth';
import { OpenAPI } from './generated';
import { redirect } from 'next/navigation';
import { ApiError } from './generated/core/ApiError';

export async function withAuth<T>(apiCall: () => Promise<T>): Promise<T> {
  const session = await auth();

  if (!session?.accessToken) {
    redirect('/signin');
  }

  OpenAPI.TOKEN = session.accessToken;

  try {
    return await apiCall();
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      // Token is invalid or expired, redirect to sign in
      redirect('/signin');
    }
    throw error;
  }
}
