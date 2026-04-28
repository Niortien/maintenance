import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header1 from "@/components/mvpblocks/header-1";
import { Toaster } from 'react-hot-toast';
import { QueryClientProviderWrapper } from "@/components/providers/query-client-provider";
import { getProfile } from "@/service/auth/auth.action";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profileRes = await getProfile();
  const responsable = profileRes?.success ? profileRes.data : null;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryClientProviderWrapper>
          <Header1 responsable={responsable} />
          {children}
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              style: {
                borderRadius: '10px',
                background: '#111827',
                color: '#f9fafb',
                border: '1px solid #374151',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#f59e0b', secondary: '#111827' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#111827' },
              },
            }}
          />
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
