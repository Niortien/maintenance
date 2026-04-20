import { logoutAdmin } from '@/service/auth/auth.action';
import { adminGetSites } from '@/service/auth/auth.action';

export const metadata = { title: 'Admin — SATE Maintenance' };

export default async function AdminPage() {
  const sitesRes = await adminGetSites();
  const sites = sitesRes.success ? sitesRes.data : [];

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Topbar */}
      <header className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="font-semibold text-white">Administration SATE</span>
        </div>
        <form action={logoutAdmin}>
          <button type="submit" className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-400 hover:border-gray-600 hover:text-white transition">
            Se déconnecter
          </button>
        </form>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">
        <div>
          <h1 className="text-2xl font-bold text-white">Tableau de bord administrateur</h1>
          <p className="mt-1 text-sm text-gray-400">Vue d&apos;ensemble des sites SATE</p>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            href="/admin/rapports"
            className="group rounded-xl border border-gray-800 bg-gray-900 p-5 hover:border-amber-600 transition"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white group-hover:text-amber-300 transition">Rapports journaliers</p>
                <p className="mt-0.5 text-xs text-gray-500">Consulter et exporter les rapports par site et date</p>
              </div>
            </div>
          </a>
        </div>

        {/* Aperçu sites */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Sites</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sites.map((site) => (
              <a
                key={site.id}
                href={`/admin/rapports?siteId=${site.id}`}
                className="rounded-xl border border-gray-800 bg-gray-900 p-4 hover:border-gray-600 transition"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: site.couleur ?? '#6b7280' }} />
                  <span className="font-semibold text-white text-sm">{site.nom}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div>
                    <p className="text-lg font-bold" style={{ color: site.couleur ?? '#6b7280' }}>{site._count.vehicules}</p>
                    <p className="text-xs text-gray-600">Véhic.</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-300">{site._count.techniciens}</p>
                    <p className="text-xs text-gray-600">Tech.</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-300">{site._count.rapports}</p>
                    <p className="text-xs text-gray-600">Rapp.</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

