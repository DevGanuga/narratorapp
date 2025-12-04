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
  title: "ConvoAI Studio | Conversational Video Intelligence by NR8R",
  description: "Create photorealistic digital replicas and engage in real-time video conversations powered by multimodal AI. Professional tools built by storytellers, for storytellers.",
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
