'use client';
import { AppContext } from '@/service/context';
import { PowerCircleIcon, UserCog2Icon, UserIcon } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/molecule/dropdown-menu';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const app = React.useContext(AppContext);
  const router = useRouter();

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     if (!app.user?.user?.email) {
  //       window.location.href = "/";
  //     }
  //   }, 4000);
  // }, [app]);
  return (
    <div className="h-full relative w-full">
      <div className="absolute right-0">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-[50px] outline outline-0 flex justify-end">
            <UserIcon className="p-3 cursor-pointer w-12 h-12" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link prefetch href="/admin/profile" className="flex gap-2">
                <UserCog2Icon /> My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span
                onClick={() => {
                  app.removeUser();
                  router.push('/');
                }}
                className="flex gap-2"
              >
                <PowerCircleIcon /> Logout
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {children}
    </div>
  );
}
