import {
  Inter,
  Roboto,
  Lora,
  Poppins,
  Montserrat,
  Dancing_Script,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const generalSans = localFont({
  src: [
    {
      path: "../public/fonts/GeneralSans-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/GeneralSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/GeneralSans-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/GeneralSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/GeneralSans-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/GeneralSans-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/GeneralSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-generalSans",
});

const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const dancingFont = Dancing_Script({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-dancing",
});

const robotoFont = Roboto({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-roboto",
});

const loraFont = Lora({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-lora",
});

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-poppins",
});

const montserratFont = Montserrat({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${generalSans.variable} ${interFont.variable} ${dancingFont.variable} ${robotoFont.variable} ${loraFont.variable} ${poppinsFont.variable} ${montserratFont.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
