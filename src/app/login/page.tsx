'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoginForm from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const error = searchParams.get('error');

  useEffect(() => {
    if (session) {
      router.push(redirect || '/admin');
    }
  }, [session, router, redirect]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to Kusina de Amadeo
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please sign in to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error === 'CredentialsSignin' 
                ? 'Invalid email or password'
                : 'An error occurred. Please try again.'}
            </div>
          )}
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
