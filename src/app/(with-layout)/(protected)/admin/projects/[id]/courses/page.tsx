'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '@/public/certLogo.svg';
import { ChevronsDown, ChevronsUp } from 'lucide-react';
import GradeForm from '@/components/organism/certificate/grade-form';
import Link from 'next/link';
import { confirmProgramPayment, confirmProgramSetup, getSinglePrograms } from '@/service/programs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { LoadingAtom } from '@/components/atom/loading';
import { Switch } from '@/components/molecule/switch';
import { Button } from '@/components/molecule/button';
import { formatToCurrency } from '@/utils/utils';
import PaystackPop from '@paystack/inline-js';
import { toast } from 'sonner';

interface ProgramDetails {
  name: string;
  description: string;
  courses: Array<Course>;
}

interface Course {
  name: string;
  _id: string;
}

function ProgramDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [sendEmail, setSendEmail] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const idempotencyKey = React.useId() + Date.now();

  const {
    data: program,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['program-' + id],
    queryFn: () => getSinglePrograms(id as string),
  });
  const finalize = useMutation({
    mutationFn: confirmProgramPayment,
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: async ({ data, code }, v, con) => {
      if (code === 'PAYMENT_SUCCESSFUL') {
        router.push(`../${data.shortcode}/complete`);
      } else {
        finalize.reset();
      }
    },
  });

  const mutation = useMutation({
    mutationFn: confirmProgramSetup,
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: async ({ data, code }) => {
      if (code === 'PROGRAM_SUCCESSFUL' && data.shortcode?.startsWith('CF.')) {
        router.push(`../${data.shortcode}/complete`);
        return;
      }
      if (code === 'PAYMENT_REQUIRED' && data.pay) {
        try {
          const popup = new PaystackPop();
          await popup.checkout({
            ...data.pay,
            onSuccess(tranx) {
              finalize.mutate(tranx);
            },
            onError(error) {
              if (error?.message?.toLowerCase()?.includes('duplicate')) {
                finalize.mutate(data.pay);
                return;
              }
              toast.error(error.message);
            },
          });
        } catch (e) {
          // TODO: track analytic
        }
        return;
      }
      throw 'Please upload all required documents.';
    },
  });

  console.log(mutation);

  React.useEffect(() => {
    if (!program?.shortcode) return;
    router.prefetch(`../${program?.shortcode}/complete`);
  }, []);

  if (loading) return <LoadingAtom />;
  if (error || !program)
    return <p className="text-red-500">Error: {error?.message || 'Service error'}</p>;

  const toggleCourse = (_id: string) => {
    setActiveIndex(_id === activeIndex ? null : _id);
  };
  const handleGradeFormUpdate = (course) => {
    refetch();
  };

  const totalRecipients = program?.courses?.reduce((acc, cur) => {
    return acc + (cur?.recipients?.length || 0);
  }, 0);
  const programPrice = Number(program?.price || 1000);

  return (
    <div className="h-full grow bg-white text-black flex flex-col justify-between  max-sm:p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">{program?.name}</h1>
      <div className="mx-auto max-w-[700px] w-full">
        {' '}
        {program && (
          <div className="w-full py-8">
            {program?.courses.map((course) => (
              <div className="flex flex-col gap-4 mb-3" key={course._id}>
                <div
                  className="text-2xl flex-row justify-between flex"
                  onClick={() => toggleCourse(course._id)}
                >
                  <span>{course.name}</span>
                  <span className="text-xl">
                    {activeIndex === course._id ? <ChevronsUp /> : <ChevronsDown />}
                  </span>
                </div>

                {activeIndex === course._id && (
                  <div className="mt-2 text-gray-600 leading-6 w-full font-satoshi text-lg lg:max-w-[650px] slg:max-w-[590px]">
                    <GradeForm onSave={handleGradeFormUpdate} courseId={course._id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <button type="button" className="inputField border-dashed text-center my-5 hidden">
          Add Learning Track / Course
        </button>
        <div className="flex justify-between items-center py-3">
          <span>Send to individual mails</span>
          <Switch checked={sendEmail} onCheckedChange={setSendEmail} />
        </div>
        <Button
          disabled={
            mutation.isPending || finalize.isPending || (mutation.isSuccess && finalize.isSuccess)
          }
          loading={mutation.isPending || finalize.isPending}
          className="w-full h-[50px]"
          onClick={() => mutation.mutate({ id, sendEmail, idempotencyKey })}
        >
          {program.paymentPlan === 'issuer' && !program.paymentComplete
            ? 'Proceed to make payment'
            : 'Complete and Continue'}
        </Button>
        {/* { ' TODO': calculate for additional courses and students */}
        <p className="py-2 text-center">
          <span>
            You've successfully uploaded {formatToCurrency(totalRecipients)} names. The total cost
            is
            <strong className="px-2">₦{formatToCurrency(programPrice * totalRecipients)}</strong>
          </span>
        </p>
      </div>
    </div>
  );
}

export default ProgramDetailsPage;
