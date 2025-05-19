'use client';

import AuthForm from '@/components/template/layout/auth';
import { AuthFormType, FormField } from '@/interface/form.dto';
import customFetch from '@/service/https';
import { toast } from 'sonner';
import { AuthError } from '@/interface/error.dto';
import { validateDynamicFormError } from '@/utils/validationError';
import { UseFormReturn } from 'react-hook-form';
import { LoginUser, User } from '@/interface/user.dto';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useSessionStorage } from 'usehooks-ts';
import { AppContext } from '@/service/context';

export default function Account() {
  const router = useRouter();
  const [, setTempEmail] = useSessionStorage('temp-email', null);
  const { setUser, removeUser } = React.use(AppContext);
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
        // router.push(user.username && user.phone ? "/admin" : "/admin/profile");
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
    />
  );
}
