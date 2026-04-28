import { QueryClientProviderWrapper } from '@/components/providers/query-client-provider';
import { Toaster } from 'react-hot-toast';
import AdminSituationsIndex from '@/components/admin/admin-situations-index';

export const metadata = { title: 'Situations — Admin SATE' };

export default function AdminSituationsPage() {
  return (
    <QueryClientProviderWrapper>
      <Toaster position="top-right" reverseOrder={false} toastOptions={{
        style: { borderRadius: '10px', background: '#111827', color: '#f9fafb', border: '1px solid #374151', fontSize: '14px' },
        success: { iconTheme: { primary: '#f59e0b', secondary: '#111827' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#111827' } },
      }} />
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
          <div>
            <a href="/admin" className="text-sm text-gray-500 hover:text-gray-300 transition">
              ← Retour au tableau de bord
            </a>
            <h1 className="mt-3 text-2xl font-bold text-white">Situations</h1>
            <p className="mt-1 text-sm text-gray-400">Gérez les pannes et incidents signalés par les responsables de site</p>
          </div>
          <AdminSituationsIndex />
        </div>
      </main>
    </QueryClientProviderWrapper>
  );
}
