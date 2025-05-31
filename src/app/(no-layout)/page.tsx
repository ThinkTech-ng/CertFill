'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useContext, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import certImage from '@/public/certImage.png';
import logo from '@/public/certLogo.svg';
import thinktech from '@/public/thinktechLogo.svg';
import tech4dev from '@/public/images/tech4Dev.svg';
import { AppContext } from '@/service/context';
import { Menu } from 'lucide-react';

export default function Home() {
  const app = useContext(AppContext);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (app?.user?.accessToken) {
      router.push('/admin');
    }
  }, [app?.user?.accessToken, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col" onClick={() => setMenuOpen(false)}>
      {/* Header */}
      <header className="relative flex items-center justify-between px-10 md:px-12 lg:px-24 py-6 md:bg-white bg-certFillDarkBlue">
        <div className="flex items-center gap-2">
          <Image src={logo} alt="Certfill Logo" width={48} height={48} />
          <span className="text-2xl font-bold md:text-black text-white">Certfill</span>
        </div>
        {/* Desktop Nav */}
        <nav className="md:flex hidden gap-8">
          <a href="https://wa.me/2349115083790" className="font-semibold">
            Contact Us
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
        >
          <Menu />
        </button>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div
            className="absolute top-16 right-10 bg-white text-black shadow-lg rounded-md mt-2 w-48 z-50 md:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href="https://wa.me/2349115083790"
              className="block px-4 py-3 hover:bg-gray-100 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="font-generalSans flex-1 flex flex-col md:flex-row bg-certFillDarkBlue px-10 md:px-12 lg:px-24 py-12  items-center justify-between">
        <div className="flex-1 flex flex-col items-center md:items-start gap-6 max-w-[620px]">
          <h1 className="md:mx-0 mx-4 text-4xl md:text-7xl md:font-semibold font-medium text-white text-center md:text-left leading-normal  md:leading-loose">
            Issue Certificates in <span className="text-[#4DB6D2] ">Minutes</span>
          </h1>
          <p className="text-xl text-center md:text-left text-white leading-[40px]">
            Certfill makes it easy for educational institutions, training providers, and
            professional bodies to create, personalize, and deliver certificates — fast.
          </p>
          <div className="flex md:flex-row flex-col gap-4 mt-4">
            <Link
              prefetch
              href="/account"
              className="bg-[#4DB6D2] text-white w-56 text-center px-8 py-3 rounded-lg font-medium text-base hover:border hover:border-white transition-all hover:text-certFillBlue hover:bg-transparent"
            >
              Sign in
            </Link>
            <a
              download
              href="/How-Certfill-works.pdf"
              className="border border-white w-56 text-center text-white px-8 py-3 rounded-lg font-medium text-base hover:border-transparent transition-all hover:text-certFillDarkBlue hover:bg-[#4DB6D2]"
            >
              How it works
            </a>
          </div>
        </div>
        <div className="flex-1 md:flex hidden justify-center items-center lg:translate-x-20 md:mt-0">
          <Image src={certImage} alt="Certificates" width={520} height={490} className="" />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto lg:px-24  bg-certFillDarkBlue font-ttNorms">
        {/* Mobile footer */}
        <div className="md:hidden flex flex-col items-center gap-6 text-white pb-8">
          <span className="text-xs text-white tracking-[4px]">OUR CLIENTS</span>
          <div className="flex flex-row gap-12">
            {' '}
            <Image src={tech4dev} alt="tech4dev" width={150} height={25} />
            <span className="font-semibold text-lg text-white max-w-8 text-center">
              Stellar Oasis
            </span>
          </div>
        </div>
        <div className="border-t border-gray-200"></div>
        <div className="flex flex-col md:flex-row items-center justify-between py-12">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="text-xs text-white tracking-[4px]">POWERED BY</span>
            <Image src={thinktech} alt="thinktech" width={80} height={20} />
          </div>
          <div className="md:flex hidden items-center gap-8 text-white">
            <span className="text-xs text-white tracking-[4px]">OUR CLIENTS</span>
            <Image src={tech4dev} alt="tech4dev" width={150} height={25} />
            <span className="font-semibold text-lg text-white">Stellar Oasis</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
