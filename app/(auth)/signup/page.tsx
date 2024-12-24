import { Metadata } from 'next';
import SignUpViewPage from '../_components/signup-view';

export const metadata: Metadata = {
  title: 'Authentication | Sign Up',
  description: 'Sign Up page for authentication.'
};

export default function Page() {
  return <SignUpViewPage />;
}
