import { notFound } from 'next/navigation';
import { getTechnicienDetails } from '@/service/techniciens/technicien.action';
import { Wrench, Mail, Phone, MapPin, ArrowLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { BASE_URL } from '@/baseurl/baseurl';

const STATUT_LABELS: Record<string, string> = {
  ACTIF: 'Actif',
  EN_MAINTENANCE: 'En maintenance',
  INACTIF: 'Inactif',
  EN_MISSION: 'En mission',
  EN_CONGE: 'En congé',
  MALADE: 'Malade',
};

const STATUT_COLORS: Record<string, string> = {
  ACTIF: 'bg-green-100 text-green-700',
  EN_MISSION: 'bg-blue-100 text-blue-700',
  EN_MAINTENANCE: 'bg-amber-100 text-amber-700',
  EN_CONGE: 'bg-yellow-100 text-yellow-700',
  MALADE: 'bg-purple-100 text-purple-700',
  INACTIF: 'bg-red-100 text-red-700',
};

export default async function TechnicienDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getTechnicienDetails(id);

  if (!res.success) notFound();

  const t = res.data;
  const photoUrl = t.photo
    ? `${BASE_URL.replace('/api', '')}/uploads/techniciens/${t.photo}`
    : null;
  const initials = `${t.nom[0] ?? ''}${t.prenom[0] ?? ''}`.toUpperCase();

  return (
    <main className="min-h-screen bg-[#fff9ed] px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">

        {/* Retour */}
        <Link
          href="/techniciens"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux techniciens
        </Link>

        {/* En-tête */}
        <div className="flex items-center gap-5 rounded-2xl bg-white border border-emerald-100 shadow-sm p-6">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={`${t.nom} ${t.prenom}`}
              className="h-20 w-20 rounded-2xl object-cover border-2 border-emerald-200"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-700 text-white font-bold text-2xl">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-800">
              {t.prenom} {t.nom}
            </h1>
            <p className="flex items-center gap-1 text-sm text-slate-500 mt-1">
              <Wrench className="h-3.5 w-3.5 text-emerald-600" />
              {t.specialite.replace(/_/g, ' ')}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUT_COLORS[t.statut] ?? 'bg-gray-100 text-gray-600'}`}>
                {STATUT_LABELS[t.statut] ?? t.statut}
              </span>
              {t.lieuMission && (
                <span className="flex items-center gap-1 text-xs text-blue-600">
                  <MapPin className="h-3 w-3" /> {t.lieuMission}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Infos contact + site */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white border border-emerald-100 shadow-sm p-5 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Contact</h2>
            <p className="flex items-center gap-2 text-sm text-slate-700">
              <Mail className="h-4 w-4 text-emerald-600" /> {t.email}
            </p>
            <p className="flex items-center gap-2 text-sm text-slate-700">
              <Phone className="h-4 w-4 text-emerald-600" /> {t.telephone}
            </p>
          </div>
          {'site' in t && t.site && (
            <div className="rounded-2xl bg-white border border-emerald-100 shadow-sm p-5 space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Site</h2>
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <MapPin className="h-4 w-4 text-emerald-600" /> {t.site.nom}
              </p>
              {t.site.region && (
                <p className="text-xs text-slate-500 ml-6">{t.site.region}</p>
              )}
            </div>
          )}
        </div>

        {/* Dernières interventions */}
        {'interventions' in t && t.interventions.length > 0 && (
          <div className="rounded-2xl bg-white border border-emerald-100 shadow-sm p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Dernières interventions
            </h2>
            <ul className="divide-y divide-slate-100">
              {t.interventions.slice(0, 5).map((iv) => (
                <li key={iv.id} className="flex items-start justify-between gap-3 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate">{iv.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(iv.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                    iv.statut === 'TERMINEE' ? 'bg-green-100 text-green-700' :
                    iv.statut === 'EN_COURS' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {iv.statut.replace(/_/g, ' ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Historique statuts */}
        {'historique' in t && t.historique.length > 0 && (
          <div className="rounded-2xl bg-white border border-emerald-100 shadow-sm p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Historique des statuts
            </h2>
            <ul className="space-y-2">
              {t.historique.map((evt) => {
                const isOpen = !evt.dateFin;
                return (
                  <li
                    key={evt.id}
                    className={`flex items-start justify-between gap-3 rounded-xl border p-3 text-sm ${
                      isOpen
                        ? 'border-amber-200 bg-amber-50'
                        : 'border-slate-100 bg-slate-50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800">
                        {STATUT_LABELS[evt.statut] ?? evt.statut}
                        {isOpen && (
                          <span className="ml-2 text-xs font-medium text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">
                            en cours
                          </span>
                        )}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {new Date(evt.dateDebut).toLocaleDateString('fr-FR')}
                        {evt.dateFin
                          ? ` → ${new Date(evt.dateFin).toLocaleDateString('fr-FR')}`
                          : ' → en cours'}
                      </p>
                      {evt.lieu && (
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" /> {evt.lieu}
                        </p>
                      )}
                      {evt.notes && (
                        <p className="text-xs text-slate-400 italic mt-0.5">{evt.notes}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

      </div>
    </main>
  );
}
