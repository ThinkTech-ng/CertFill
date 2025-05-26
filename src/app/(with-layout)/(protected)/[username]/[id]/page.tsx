'use client';
import * as z from 'zod';

import Image from 'next/image';
import thinktech from '@/public/thinktechLogo.svg';
import cert from '@/public/images/certImage.svg';
import logo from '@/public/certLogo.svg';
import AppLayout from '@/components/template/layout';
import DynamicForm from '@/components/organism/forms/dynamic';
import AuthForm from '@/components/template/layout/auth';
import { FormField } from '@/interface/form.dto';
import customFetch from '@/service/https';
import { toast } from 'sonner';
import { AuthError } from '@/interface/error.dto';
import { validateDynamicFormError } from '@/utils/validationError';
import { UseFormReturn } from 'react-hook-form';
import { User, LoginUser } from '@/interface/user.dto';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '@/components/molecule/button';
import Link from 'next/link';
import { useSessionStorage } from 'usehooks-ts';
import { TermAndCondition } from '@/components/atom/terms';
import { alphaNumericUnderscoreSchema } from '../../../../../../validators';
import { AppContext } from '@/service/context';
import { getProgramsCourses } from '@/service/programs';
import { useQuery } from '@tanstack/react-query';
import { LoadingAtom } from '@/components/atom/loading';
import { CertificateNotFound } from '@/components/template/layout/certificate/not-found';
import { PaidCertificate } from '@/components/template/layout/certificate/paid-certificate';

export default function GetProgramCertificate() {
  const router = useRouter();
  const { id, username } = useParams();
  const [notFound, setNotFound] = React.useState(false);
  const [paidGenerate, setPaidGenerate] = React.useState<any>(null);

  const {
    data: programs = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => await getProgramsCourses({ id, username }),
  });
  const app = React.useContext(AppContext);

  if (isLoading) return <LoadingAtom />;

  if (error) {
    return <CertificateNotFound />;
  }
  if (notFound) {
    return <CertificateNotFound onClick={() => window.location.reload()} />;
  }
  if (paidGenerate) {
    return <PaidCertificate program={paidGenerate} />;
  }
  const formSettings: FormField[] = [
    {
      type: 'select',
      name: 'program',
      label: 'Select a Program',
      placeholder: 'Program',
      labelClassName: 'font-normal',
      options:
        programs?.courses?.map((course: any, index) => ({
          value: index + '',
          label: course.name,
        })) || [],
    },
    {
      type: 'text',
      name: 'email',
      label: 'Email',
      validation: z.string().email(),
      labelClassName: 'font-normal pt-5 block',
      inputClassName: 'inputField h-auto',
    },
  ];

  const handleSubmit = (formState: UseFormReturn) => async (data: Record<string, any>) => {
    try {
      const courses = programs.courses?.[data.program];
      const user = courses.recipients?.find(
        (user: any) => user?.email?.toLowerCase() === data.email?.toLowerCase(),
      );
      console.log(data, courses, user);
      if (!user) {
        setNotFound(true);
        return;
      }

      setPaidGenerate({ user, course: courses, programs });
    } catch (e) {
      const error = e as AuthError;
      if (error.message == 'Validation failed') {
        const { message, fields } = validateDynamicFormError(error.errors, formSettings);
        toast.error(message.join(', \n\t'));
        formState.control._setErrors(fields);
        return;
      }
      toast.error(error?.message);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5 py-10 px-5 h-full justify-between">
        <div>
          <h3 className="lg:text-[40px] text-3xl font-lighter  text-black">Welcome!</h3>
          <div className="lg:pb-20 pt-2 pb-5 lg:text-[20px] flex flex-col gap-1 text-left items-start font-light text-sm">
            <span> Select Your Program and </span>
            <span>Download Your Certificates Instantly!</span>
          </div>
        </div>
        <DynamicForm onSubmit={handleSubmit} formSettings={formSettings} hideError>
          {(form) => (
            <>
              <Button
                type="submit"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
                className="w-full h-[46px] text-base  mt-4"
              >
                Continue
              </Button>
            </>
          )}
        </DynamicForm>
      </div>
    </>
  );
}
