'use client';
import { redirect } from 'next/navigation';
import { AppContext } from '../../../service/context';
import React from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const app = React.useContext(AppContext);

  if (!app?.user?.accessToken) {
    redirect('/account');
  }

  return <div>{children}</div>;
}
