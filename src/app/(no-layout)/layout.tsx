import '../globals.css';
import { Metadata } from 'next';
import localFont from 'next/font/local';

const generalSans = localFont({
  src: [
    {
      path: '../../public/fonts/GeneralSans-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeneralSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeneralSans-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/GeneralSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeneralSans-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/GeneralSans-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeneralSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-generalSans',
});

const ttNorms = localFont({
  src: [
    {
      path: '../../public/fonts/TTNormsPro-Bold.otf',
      weight: '300',
      style: 'normal',
    },
  ],
  variable: '--font-ttNorms',
});

export const metadata: Metadata = {
  title: 'Certfill - Your Certificate Management Solution',
  description: 'Manage and create certificates with Certfill.',
  keywords: ['certificates', 'management', 'Certfill'],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Certfill - Your Certificate Management Solution',
    description: 'Manage and create certificates with Certfill.',
    url: 'https://www.certfill.com/',
    type: 'website',
    images: [
      {
        url: '/public/images/image.png',
        width: 800,
        height: 600,
        alt: 'Certfill',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Certfill - Your Certificate Management Solution',
    description: 'Manage and create certificates with Certfill.',
    images: ['/public/images/image.png'],
  },
  alternates: {
    canonical: 'https://www.certfill.com/',
  },
  // other: {
  //   "application/ld+json": JSON.stringify({
  //     "@context": "https://schema.org",
  //     "@type": "Organization",
  //     name: "Certfill",
  //     url: "https://www.certfill.com/",
  //     logo: "https://www.certfill.com/certLogo.svg",
  //   }),
  // },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${generalSans.variable} ${ttNorms.variable}`}>{children}</body>
    </html>
  );
}
