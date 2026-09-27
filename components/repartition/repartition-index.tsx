'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getMyRepartitions, getMyRepartitionsSummary } from '@/service/repartition/repartition.action';
import { getAllVehicule } from '@/service/vehicule/vehicule.action';
import { getProfile } from '@/service/auth/auth.action';
import { TYPE_CONSOMMABLE_LABELS } from '@/service/repartition/repartition.schema';
import { TypeConsommable } from '@/service/repartition/types/repartition.type';
import AjouterRepartitionDialog from './ajouter-repartition';
import RepartitionTable from './repartition-table';

const RepartitionPDFButton = dynamic(() => import('../pdf/repartition-pdf-button'), { ssr: false, loading: () => null });

const TYPES: TypeConsommable[] = ['HUILE_MOTEUR', 'HUILE_VERIN', 'PNEU', 'BATTERIE'];

function firstDayOfMonth(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

function lastDayOfMonth(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10);
}

const RepartitionIndex = () => {
  const [activeType, setActiveType] = useState<TypeConsommable>('HUILE_MOTEUR');
  const [from, setFrom] = useState(firstDayOfMonth());
  const [to, setTo] = useState(lastDayOfMonth());

  const { data: vehiculesRes } = useQuery({
    queryKey: ['vehicules'],
    queryFn: () => getAllVehicule(),
  });
  const vehicules = vehiculesRes?.success ? vehiculesRes.data : [];

  const { data: listRes, isPending } = useQuery({
    queryKey: ['repartitions', activeType, from, to],
    queryFn: () => getMyRepartitions({ type: activeType, from, to }),
  });

  const { data: summaryRes } = useQuery({
    queryKey: ['repartitions-summary', from, to],
    queryFn: () => getMyRepartitionsSummary({ from, to }),
  });

  // Toutes les répartitions de la période (tous types) — sert au PDF récapitulatif
  const { data: allRes } = useQuery({
    queryKey: ['repartitions-all', from, to],
    queryFn: () => getMyRepartitions({ from, to }),
  });

  const { data: profileRes } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
  });

  useEffect(() => {
    if (listRes && !listRes.success) toast.error(listRes.error);
  }, [listRes]);

  const repartitions = listRes?.success ? listRes.data : [];
  const summary = summaryRes?.success ? summaryRes.data : null;
  const allRepartitions = allRes?.success ? allRes.data : [];
  const site = profileRes?.success ? profileRes.data.site : null;

  const periodLabel = useMemo(() => {
    const start = new Date(from).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    const end = new Date(to).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    return `${start} — ${end}`;
  }, [from, to]);

  return (
    <div className="space-y-6">
      {/* Filtres période + actions */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Du</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Au</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {summary && site && (
            <RepartitionPDFButton
              summary={summary}
              repartitions={allRepartitions}
              site={site}
              periodLabel={periodLabel}
            />
          )}
          <AjouterRepartitionDialog vehicules={vehicules} defaultType={activeType} />
        </div>
      </div>

      {/* Cartes récapitulatives */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white border border-slate-200 p-4">
            <p className="text-xs uppercase text-slate-500 font-medium">Montant achat total</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{summary.global.montantAchatTotal.toLocaleString('fr-FR')} FCFA</p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-4">
            <p className="text-xs uppercase text-slate-500 font-medium">Montant vente total</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{summary.global.montantVenteTotal.toLocaleString('fr-FR')} FCFA</p>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <p className="text-xs uppercase text-emerald-700 font-medium">Bénéfice total</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{summary.global.beneficeTotal.toLocaleString('fr-FR')} FCFA</p>
          </div>
        </div>
      )}

      {/* Onglets par type de stock */}
      <div className="flex flex-wrap gap-2">
        {TYPES.map((type) => {
          const typeSummary = summary?.parType.find((s) => s.type === type);
          const active = activeType === type;
          return (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
                active
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
              }`}
            >
              {TYPE_CONSOMMABLE_LABELS[type]}
              {typeSummary && typeSummary.nombreLignes > 0 && (
                <span className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${active ? 'bg-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                  {typeSummary.nombreLignes}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {isPending ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
        </div>
      ) : (
        <RepartitionTable repartitions={repartitions} showDesignation={activeType === 'PNEU'} />
      )}
    </div>
  );
};

export default RepartitionIndex;
