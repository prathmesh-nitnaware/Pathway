import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pathway",
  description: "Find your ideal college pathway.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <Chatbot />
          <Toaster position="top-center" />
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
