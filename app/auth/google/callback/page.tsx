import { Suspense } from 'react';
import { GoogleCallbackClient } from './google-callback-client';

export const metadata = {
  title: 'Connexion Google — GI2E Maintenance',
};

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-emerald-950">
          <p className="text-sm text-emerald-400">Connexion en cours…</p>
        </main>
      }
    >
      <GoogleCallbackClient />
    </Suspense>
  );
}
