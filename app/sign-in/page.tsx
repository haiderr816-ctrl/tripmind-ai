import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center p-4">
      <SignIn afterSignInUrl="/dashboard" redirectUrl="/dashboard" />
    </div>
  );
}