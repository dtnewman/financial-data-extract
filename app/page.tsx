import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import HomePage from './home/page';

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    return redirect('/dashboard/jobs');
  }

  return <HomePage />;
}
