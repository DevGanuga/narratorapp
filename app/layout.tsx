import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: "ConvoAI Studio | by Narrator",
  description: "Conversational video tools built by storytellers, for storytellers. Partner with us to bring your creative vision to life.",
  icons: {
    icon: [
      { url: '/favicon_io-3/favicon.ico' },
      { url: '/favicon_io-3/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io-3/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon_io-3/apple-touch-icon.png' },
    ],
    other: [
      { url: '/favicon_io-3/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon_io-3/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/favicon_io-3/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${newsreader.variable} font-sans antialiased bg-[#0a0a0a] text-[#e8e6e3]`}
      >
        {children}
      </body>
    </html>
  );
}
