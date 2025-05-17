'use client';
import Image from 'next/image';
import certImage from '@/public/images/certImage.svg';
import logo from '@/public/certLogo.svg';
import thinktech from '@/public/thinktechLogo.svg';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-6 bg-white">
        <div className="flex items-center gap-2">
          <Image src={logo} alt="Certfill Logo" width={48} height={48} />
          <span className="text-2xl font-bold">Certfill</span>
        </div>
        <nav className="flex gap-8">
          <a href="#" className="font-semibold border-b-2 border-black pb-1">
            Watch Demo
          </a>
          <a href="#" className="font-semibold">
            Contact Us
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col md:flex-row bg-[#0B1B24] p-10 rounded-lg mx-2 md:mx-8 my-6 items-center justify-between">
        <div className="flex-1 flex flex-col gap-6 max-w-xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Issue Certificates <br />
            in <span className="text-[#4DB6D2] underline">Minutes</span>
          </h1>
          <p className="text-lg text-[#D1DFE8]">
            Certfill makes it easy for educational institutions, training providers, and
            professional bodies to create, personalize, and deliver certificates — fast.
          </p>
          <div className="flex gap-4 mt-4">
            <Link
              prefetch
              href="/account"
              className="bg-[#4DB6D2] text-white px-8 py-3 rounded-lg font-semibold text-lg"
            >
              Sign in
            </Link>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold text-lg">
              How it works
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center mt-10 md:mt-0">
          <Image src={certImage} alt="Certificates" width={400} height={300} />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 px-10 bg-white border-t border-gray-200 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>POWERED BY</span>
          <Image src={thinktech} alt="thinktech" width={80} height={20} />
        </div>
        <div className="flex items-center gap-8 mt-4 md:mt-0">
          <span className="text-xs text-gray-500">OUR CLIENTS</span>
          <span className="font-semibold text-lg text-black">TECH4DEV</span>
          <span className="font-semibold text-lg text-black">Stellar Oasis</span>
        </div>
      </footer>
    </div>
  );
}
