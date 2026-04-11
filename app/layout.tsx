import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header1 from "@/components/mvpblocks/header-1";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProviderWrapper } from "@/components/providers/query-client-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maintenance",
  description: "Application de gestion et de maintenance des employés et des activités d'un garage",
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
        <QueryClientProviderWrapper>
          <Header1 />
          {children}
          <Toaster />
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
