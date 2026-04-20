import { adminGetSiteRapports, adminGetSites } from '@/service/auth/auth.action';
import { IAdminRapport, IAdminSite } from '@/service/auth/types/auth.type';
import { logoutAdmin } from '@/service/auth/auth.action';
import RapportPDFButton from '@/components/admin/rapport-pdf-button';

export const metadata = { title: 'Rapports — Admin SATE' };

// ─── Badges statut ─────────────────────────────────────────────────────────────
const STATUT_STYLE: Record<string, string> = {
  OPERATIONNEL: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  EN_PANNE:     'bg-amber-100 text-amber-700 border-amber-200',
  ACCIDENTE:    'bg-red-100 text-red-700 border-red-200',
  EN_ATTENTE:   'bg-gray-100 text-gray-600 border-gray-200',
};

const STATUT_LABELS: Record<string, string> = {
  OPERATIONNEL: 'Opérationnel',
  EN_PANNE: 'En panne',
  ACCIDENTE: 'Accidenté',
  EN_ATTENTE: 'En attente',
};

const CATEGORIE_LABELS: Record<string, string> = {
  TASSEUR: 'Tasseur', BP: 'BP', AMPLIROLL: 'Ampliroll', TRACTEUR: 'Tracteur',
  KIA: 'KIA', VOITURETTE: 'Voiturette', PC: 'PC', MOTO_TRICYCLE: 'Moto-Tricycle', KB: 'KB',
};

// ─── Rapport viewer ────────────────────────────────────────────────────────────
function RapportCard({ rapport, couleur }: { rapport: IAdminRapport; couleur: string }) {
  const ops       = rapport.lignes.filter((l) => l.statut === 'OPERATIONNEL').length;
  const pannes    = rapport.lignes.filter((l) => l.statut === 'EN_PANNE').length;
  const accidents = rapport.lignes.filter((l) => l.statut === 'ACCIDENTE').length;
  const attente   = rapport.lignes.filter((l) => l.statut === 'EN_ATTENTE').length;
  const categories = [...new Set(rapport.lignes.map((l) => l.categorie))];

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 shadow-lg overflow-hidden">
      {/* Barre couleur site */}
      <div className="h-1 w-full" style={{ backgroundColor: couleur }} />

      {/* En-tête rapport */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div>
          <p className="text-sm font-semibold text-white">
            {new Date(rapport.date).toLocaleDateString('fr-FR', {
              weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
            })}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{rapport.lignes.length} véhicules recensés</p>
        </div>
        <RapportPDFButton rapport={rapport} />
      </div>

      {/* Stats résumé */}
      <div className="grid grid-cols-4 divide-x divide-gray-800 border-b border-gray-800">
        {[
          { label: 'Opérationnels', value: ops,       color: '#10b981' },
          { label: 'En panne',      value: pannes,    color: '#f59e0b' },
          { label: 'Accidentés',    value: accidents, color: '#ef4444' },
          { label: 'En attente',    value: attente,   color: '#6b7280' },
        ].map(({ label, value, color }) => (
          <div key={label} className="py-3 px-4 text-center">
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Lignes par catégorie */}
      <div className="divide-y divide-gray-800/60">
        {categories.map((cat) => {
          const lignes = rapport.lignes.filter((l) => l.categorie === cat);
          return (
            <div key={cat} className="px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                {CATEGORIE_LABELS[cat] ?? cat} · {lignes.length} engin{lignes.length > 1 ? 's' : ''}
              </p>
              <div className="space-y-2">
                {lignes.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-start gap-3 rounded-lg border border-gray-800 bg-gray-950/50 px-3 py-2.5"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-sm font-semibold text-white">
                        {l.codeVehicule}
                      </span>
                      {l.immatriculation && (
                        <span className="ml-2 text-xs text-gray-500">/ {l.immatriculation}</span>
                      )}
                      {(l.description || l.typesPannes?.length > 0) && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {l.description ?? l.typesPannes.join(', ')}
                        </p>
                      )}
                    </div>
                    <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUT_STYLE[l.statut] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      {STATUT_LABELS[l.statut] ?? l.statut}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sélecteur de site ────────────────────────────────────────────────────────
function SiteSelector({ sites, selectedId }: { sites: IAdminSite[]; selectedId?: string }) {
  return (
    <div className="space-y-1.5">
      {sites.map((site) => {
        const isSelected = site.id === selectedId;
        return (
          <a
            key={site.id}
            href={`/admin/rapports?siteId=${site.id}`}
            className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${
              isSelected
                ? 'bg-gray-700 text-white font-semibold'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: site.couleur ?? '#6b7280' }}
              />
              <span>{site.nom}</span>
            </div>
            <span className="text-xs text-gray-500">{site._count.rapports} rapports</span>
          </a>
        );
      })}
    </div>
  );
}

// ─── Page principale ───────────────────────────────────────────────────────────
export default async function AdminRapportsPage({
  searchParams,
}: {
  searchParams: Promise<{ siteId?: string; date?: string }>;
}) {
  const params = await searchParams;
  const { siteId, date } = params;

  const [sitesRes, rapportsRes] = await Promise.all([
    adminGetSites(),
    siteId ? adminGetSiteRapports(siteId, date) : Promise.resolve({ success: true as const, data: [] as IAdminRapport[] }),
  ]);

  const sites: IAdminSite[] = sitesRes.success ? sitesRes.data : [];
  const rapports: IAdminRapport[] = rapportsRes.success ? rapportsRes.data : [];
  const selectedSite = sites.find((s) => s.id === siteId);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Topbar */}
      <header className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <a href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Admin
          </a>
          <span className="text-gray-700">/</span>
          <span className="text-sm font-semibold text-white">Rapports journaliers</span>
        </div>
        <form action={logoutAdmin}>
          <button type="submit" className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-400 hover:border-gray-600 hover:text-white transition">
            Se déconnecter
          </button>
        </form>
      </header>

      <div className="flex h-[calc(100vh-57px)]">
        {/* Sidebar gauche — sélection site */}
        <aside className="w-64 shrink-0 border-r border-gray-800 bg-gray-900 overflow-y-auto p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Sites</p>
          {sites.length > 0 ? (
            <SiteSelector sites={sites} selectedId={siteId} />
          ) : (
            <p className="text-xs text-gray-600">Aucun site trouvé</p>
          )}
        </aside>

        {/* Contenu principal */}
        <div className="flex-1 overflow-y-auto p-6">
          {!siteId ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-400">Sélectionnez un site</p>
                <p className="text-xs text-gray-600 mt-1">pour consulter ses rapports journaliers</p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* En-tête site sélectionné */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: selectedSite?.couleur ?? '#6b7280' }}
                    />
                    {selectedSite?.nom ?? 'Site'}
                  </h1>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {selectedSite?.region} · {selectedSite?._count.rapports} rapport{(selectedSite?._count.rapports ?? 0) > 1 ? 's' : ''}
                  </p>
                </div>

                {/* Filtre par date */}
                <form method="GET" className="flex items-center gap-2">
                  <input type="hidden" name="siteId" value={siteId} />
                  <input
                    type="date"
                    name="date"
                    defaultValue={date ?? ''}
                    className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-gray-700 px-3 py-1.5 text-sm text-white hover:bg-gray-600 transition"
                  >
                    Filtrer
                  </button>
                  {date && (
                    <a
                      href={`/admin/rapports?siteId=${siteId}`}
                      className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-400 hover:text-white transition"
                    >
                      ✕
                    </a>
                  )}
                </form>
              </div>

              {/* Rapports */}
              {rapports.length === 0 ? (
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-10 text-center">
                  <p className="text-sm text-gray-400">
                    {date
                      ? `Aucun rapport pour le ${new Date(date).toLocaleDateString('fr-FR')}`
                      : 'Aucun rapport pour ce site'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {rapports.map((rapport) => (
                    <RapportCard
                      key={rapport.id}
                      rapport={rapport}
                      couleur={selectedSite?.couleur ?? '#6b7280'}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
