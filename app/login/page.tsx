import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';

export const metadata = {
  title: 'Connexion — SATE Maintenance',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-emerald-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / titre */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Espace Responsable</h1>
          <p className="mt-1 text-sm text-emerald-400">SATE — Système de gestion de maintenance</p>
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
