import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const suisseIntl = localFont({
  src: [
    {
      path: "../fonts/suisse/SuisseIntlTrial-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/suisse/SuisseIntlTrial-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-suisse",
});

export const metadata: Metadata = {
  title: "Bino",
  description: "Bino",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${suisseIntl.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
