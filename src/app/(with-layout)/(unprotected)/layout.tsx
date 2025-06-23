'use client';
import { redirect } from 'next/navigation';
import { AppContext } from '../../../service/context';
import React from 'react';

export default function UnprotectedLayout({ children }: { children: React.ReactNode }) {
  const app = React.useContext(AppContext);

  // if (app?.user?.accessToken) {
  //   redirect('/admin');
  // }

  return <div>{children}</div>;
}
