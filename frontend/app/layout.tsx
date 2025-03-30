import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./provider";
import { GoogleTagManager } from '@next/third-parties/google'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MinialDoc - Open Source Documentation Platform",
  description: "Create clean, easy-to-read documentation for your projects. MinialDoc is an open source, simple documentation tool built for developers and teams.",
  keywords: "open source docs, documentation tool, docs platform, technical writing, developer docs, simple documentation, markdown docs, team documentation, project docs",
  openGraph: {
    title: "MinialDoc - Open Source Documentation Platform",
    description: "Create clean, easy-to-read documentation for your projects. Open source and community-driven.",
    type: "website",
    locale: "en_US",
    images: [{
      url: 'https://res.cloudinary.com/dbwm0ksoi/image/upload/v1738529645/seo-image_twgcd6.png',
      width: 1200,
      height: 630,
      alt: 'MinialDoc - Open Source Documentation Platform'
    }],
    siteName: 'MinialDoc'
  },
  twitter: {
    card: "summary_large_image",
    title: "MinialDoc - Open Source Documentation Platform",
    description: "Create clean, easy-to-read documentation for your projects. Open source and community-driven.",
    images: ['https://res.cloudinary.com/dbwm0ksoi/image/upload/v1738529645/seo-image_twgcd6.png']
  },
  authors: [{ name: "Oye Olalekan" }],
  creator: "Oye Olalekan",
  publisher: "Oye Olalekan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID as string} />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
