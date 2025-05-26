'use client';
import * as z from 'zod';

import AuthForm from '@/components/template/layout/auth';
import { AuthFormType, FormField } from '@/interface/form.dto';
import customFetch from '@/service/https';
import { toast } from 'sonner';
import { AuthError } from '@/interface/error.dto';
import { validateDynamicFormError } from '@/utils/validationError';
import { UseFormReturn } from 'react-hook-form';
import { LoginUser, User } from '@/interface/user.dto';
import { useRouter } from 'next/navigation';
import * as rout from 'next/navigation';
import React from 'react';
import { useLocalStorage, useSessionStorage } from 'usehooks-ts';
import { AppContext } from '@/service/context';
import { useGoogleLogin } from '@react-oauth/google';

export default function Home() {
  const router = useRouter();
  const [, setTempEmail] = useSessionStorage('temp-email', null);
  const { setUser, removeUser } = React.use(AppContext);
  const [isLoading, setIsLoading] = React.useState(false); // Add loading state

  const formSettings: FormField[] = [
    {
      type: 'email',
      name: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
    },
    {
      type: 'password',
      name: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
    },
  ];
  const formRegisterSettings: FormField[] = [
    {
      type: 'text',
      name: 'name',
      label: 'Full name',
      placeholder: 'Enter your name (John Mark)',
    },
    ...formSettings,
  ];

  const handleGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true); // Start loading
      try {
        // This code handles OAuth 2.0 authorization code flow
        // First, exchange the code for tokens through Next.js API
        const exchangeResponse = await fetch('/api/auth/google-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: tokenResponse.code,
          }),
        });

        if (!exchangeResponse.ok) {
          throw new Error('Failed to exchange token');
        }

        const { idToken } = await exchangeResponse.json();

        // Now send the ID token to your authentication API route
        const authResponse = await fetch('https://api.certfill.com/api/auth/google/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });

        if (!authResponse.ok) {
          throw new Error('Authentication failed');
        }

        const responseData = await authResponse.json();

        // Assuming your backend returns a user object
        const user = responseData.data?.user || {};
        setUser({
          ...(responseData.data || {}),
          ...user,
        } as unknown as LoginUser);

        // Redirect the user to the appropriate page
        router.push(user.username && user.phone ? '/admin' : '/admin/profile');
      } catch (error) {
        console.error('Google authentication error:', error);
        toast.error('Google Sign-In failed');
      } finally {
        setIsLoading(false); // Stop loading
      }
    },
    onError: (errorResponse) => {
      console.error('Google login error:', errorResponse);
      toast.error('Google Sign-In failed');
      setIsLoading(false);
    },
    flow: 'auth-code', // This is important to get an authorization code
  });

  const handleSubmit =
    (type: AuthFormType) => (formState: UseFormReturn) => async (data: Record<string, any>) => {
      const form = type === 'login' ? formSettings : formRegisterSettings;
      setTempEmail(data.email);

      try {
        const response = await customFetch<{
          data: { user: User };
          status: AuthError['status'];
        }>(`/auth/${type}`, { method: 'POST', body: JSON.stringify(data) });
        const user = response.data?.user || {};

        if (type === 'register' && user.email && user.id && response.status === 'success') {
          router.push('/verify');
          return;
        }

        setUser({ ...(response.data || {}), ...user } as unknown as LoginUser);
        router.push(user.username && user.phone ? '/admin' : '/admin/profile');
      } catch (e) {
        const error = e as AuthError;
        if (error.message == 'Validation failed') {
          const { message, fields } = validateDynamicFormError(error.errors, form);
          toast.error(message.join(', \n\t'));
          formState.control._setErrors(fields);
          return;
        }
        if (error.code === 'EMAIL_VERIFICATION') {
          router.push('/verify');
        }
        toast.error(error?.message);
      }
    };

  React.useEffect(() => {
    router.prefetch('/admin');
    router.prefetch('/verify');
    removeUser();
  }, []);
  return (
    <AuthForm
      registerForm={formRegisterSettings}
      loginForm={formSettings}
      handleSubmit={handleSubmit}
      handleGoogle={handleGoogle}
      googleLoading={isLoading}
    />
  );
}
