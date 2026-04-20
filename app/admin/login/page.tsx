import { Suspense } from 'react';
import Image from 'next/image';
import { AdminLoginForm } from '@/components/auth/admin-login-form';

export const metadata = {
  title: 'Administration — GI2E Maintenance',
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <Image
              src="/assets/images/logogi2e.jpg"
              alt="GI2E Logo"
              width={80}
              height={80}
              className="rounded-xl shadow-lg shadow-amber-900/40 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Panneau d&apos;administration</h1>
          <p className="mt-1 text-sm text-gray-500">GI2E — Accès administrateur</p>
        </div>

        {/* Carte */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-8 shadow-2xl backdrop-blur-sm">
          <Suspense>
            <AdminLoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-gray-700">
          Accès réservé aux administrateurs système.
        </p>
      </div>
    </main>
  );
}
