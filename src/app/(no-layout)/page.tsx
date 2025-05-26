'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import certImage from '@/public/certImage.png';
import logo from '@/public/certLogo.svg';
import thinktech from '@/public/thinktechLogo.svg';
import tech4dev from '@/public/images/tech4Dev.svg';
import { AppContext } from '@/service/context';

export default function Home() {
  const app = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (app?.user?.accessToken) {
      router.push('/admin');
    }
  }, [app?.user?.accessToken, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-24 py-6 bg-white">
        <div className="flex items-center gap-2">
          <Image src={logo} alt="Certfill Logo" width={48} height={48} />
          <span className="text-2xl font-bold">Certfill</span>
        </div>
        <nav className="flex gap-8">
          <a href="https://wa.me/2349115083790" className="font-semibold">
            Contact Us
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="font-generalSans flex-1 flex flex-col md:flex-row bg-certFillDarkBlue px-2 md:px-8 lg:px-24 lg:py-12 py-6 items-center justify-between">
        <div className="flex-1 flex flex-col gap-6 max-w-[620px]">
          <h1 className="text-5xl md:text-7xl font-semibold text-white leading-loose">
            Issue Certificates in <span className="text-[#4DB6D2] ">Minutes</span>
          </h1>
          <p className="text-xl text-white leading-[40px]">
            Certfill makes it easy for educational institutions, training providers, and
            professional bodies to create, personalize, and deliver certificates — fast.
          </p>
          <div className="flex gap-4 mt-4">
            <Link
              prefetch
              href="/account"
              className="bg-[#4DB6D2] text-white w-56 text-center px-8 py-3 rounded-lg font-medium text-base hover:border hover:border-white transition-all hover:text-certFillBlue hover:bg-transparent"
            >
              Sign in
            </Link>
            <button className="border border-white w-56 text-center text-white px-8 py-3 rounded-lg font-medium text-base hover:border-transparent transition-all hover:text-certFillDarkBlue hover:bg-[#4DB6D2]">
              How it works
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center translate-x-20 md:mt-0">
          <Image src={certImage} alt="Certificates" width={520} height={490} className="" />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto px-24 bg-certFillDarkBlue font-ttNorms">
        <div className="border-t border-gray-200"></div>
        <div className="flex flex-col md:flex-row items-center justify-between py-12">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="text-xs text-white tracking-[4px]">POWERED BY</span>
            <Image src={thinktech} alt="thinktech" width={80} height={20} />
          </div>
          <div className="flex items-center gap-8 text-white">
            <span className="text-xs text-white tracking-[4px]">OUR CLIENTS</span>
            <Image src={tech4dev} alt="tech4dev" width={150} height={25} />
            <span className="font-semibold text-lg text-white">Stellar Oasis</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
