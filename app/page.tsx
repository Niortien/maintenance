import Link from 'next/link';
import { getAuthToken, getAdminToken } from '@/service/auth/auth.action';
import { redirect } from 'next/navigation';

export default async function Home() {
  // Si déjà connecté, rediriger directement
  const [token, adminToken] = await Promise.all([getAuthToken(), getAdminToken()]);
  if (adminToken) redirect('/admin');
  if (token) redirect('/dashboard');

  return (
    <main className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 shadow-xl shadow-amber-900/40">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Maintenance<span className="text-amber-400">Pro</span>
        </h1>
        <p className="mt-2 text-sm text-emerald-400">
          SATE — Système de gestion de maintenance
        </p>
      </div>

      {/* Sélection du rôle */}
      <div className="w-full max-w-sm space-y-3">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-5">
          Choisissez votre accès
        </p>

        {/* Responsable de site */}
        <Link
          href="/login"
          className="group flex items-center gap-4 w-full rounded-xl border border-emerald-800/60 bg-emerald-900/40 px-5 py-4 hover:border-emerald-500 hover:bg-emerald-900/70 transition-all duration-200"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 group-hover:bg-emerald-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-white">Responsable de site</p>
            <p className="text-xs text-emerald-400">Gérer les activités de votre site</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 group-hover:text-emerald-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* Administrateur */}
        <Link
          href="/admin/login"
          className="group flex items-center gap-4 w-full rounded-xl border border-gray-800 bg-gray-900/40 px-5 py-4 hover:border-amber-600/60 hover:bg-gray-900/70 transition-all duration-200"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 group-hover:bg-amber-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-white">Administrateur</p>
            <p className="text-xs text-gray-500">Accès au panneau d&apos;administration</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700 group-hover:text-amber-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </main>
  );
}

