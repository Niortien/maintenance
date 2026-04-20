import { Suspense } from 'react';
import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';

export const metadata = {
  title: 'Connexion — GI2E Maintenance',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-emerald-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / titre */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <Image
              src="/assets/images/logogi2e.jpg"
              alt="GI2E Logo"
              width={80}
              height={80}
              className="rounded-xl shadow-lg shadow-emerald-900 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Espace Responsable</h1>
          <p className="mt-1 text-sm text-emerald-400">GI2E — Système de gestion de maintenance</p>
        </div>

        {/* Carte */}
        <div className="rounded-2xl border border-emerald-800/60 bg-emerald-900/40 p-8 shadow-2xl backdrop-blur-sm">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-emerald-700">
          Accès réservé aux responsables de site autorisés.
        </p>
      </div>
    </main>
  );
}
