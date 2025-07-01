import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/layout/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mystery Message",
  description:
    "Send anonymous messages to anyone with Mystery Message — a fun and secretive way to connect and express yourself.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="selection:bg-amber-400">
      <AuthProvider>
        <body
          className={`bg-slate-800 min-h-screen flex flex-col ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <header className="">
            <nav>
              <Navbar />
            </nav>
          </header>
          <main className="text-white flex-grow">
            {children}
            <Toaster />
          </main>
          <footer className="text-slate-500 text-sm text-center py-1">all rights reserved</footer>
        </body>
      </AuthProvider>
    </html>
  );
}
